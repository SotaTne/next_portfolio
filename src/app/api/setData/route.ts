import setData from '@/components/firebase/setIP';
import { isIpAddress, validateUUID } from '@/components/funcs/matcher';
import getClientIp from '@/components/node_funcs/GetClientIP';
import { NextRequest, NextResponse } from 'next/server';

type ResData = { UUID: string; ip: string };
type SetIPResponse = { success: boolean; clientIp: string };

export async function POST(req: NextRequest): Promise<NextResponse> {
  const referer = req.headers.get('referer');
  let origin = req.headers.get('origin');
  let isRefererValid = false;

  // Originがnullの場合、refererから取得
  if (origin === null && referer !== null) {
    try {
      const refererUrl = new URL(referer);
      origin = refererUrl.origin;
    } catch (error) {
      console.error('Error parsing referer URL:', error);
    }
  }

  if (referer != null && origin != null) {
    const refererUrl = new URL(referer);
    const refererBasePath = refererUrl.pathname;
    isRefererValid = origin + refererBasePath === `${origin}/contact`;
  }

  try {
    const data: ResData = (await req.json()) as ResData;
    const { UUID, ip } = data;
    const clientIp = getClientIp(req) as string;
    if (ip === clientIp && isIpAddress(ip) && validateUUID(UUID)) {
      const result = await saveClientIP(UUID, clientIp, isRefererValid);
      return createJsonResponse(result, 200);
    } else {
      return createJsonResponse({ success: false, error: "Don't match ip" }, 200);
    }
  } catch (error) {
    logError('Error processing request', error);
    return createJsonResponse({ success: false, error: 'Internal Server Error' }, 500);
  }
}

async function saveClientIP(
  uuid: string,
  ip: string,
  isRefererValid: boolean,
): Promise<SetIPResponse> {
  console.log('Calling setIP API with:', { uuid, ip });
  if (!isRefererValid) {
    return { success: false, clientIp: '' };
  }
  try {
    return { success: (await setData(uuid, ip)).success, clientIp: 'ok' };
  } catch (error) {
    logError('Error setting IP', error);
    return { success: false, clientIp: '' };
  }
}

function logError(message: string, error?: unknown) {
  if (error instanceof Error) {
    console.error(`${message}:`, error.message);
  } else {
    console.error(`${message}: Unknown error`);
  }
}

function createJsonResponse(data: unknown, status: number): NextResponse {
  return NextResponse.json(data, { status });
}
