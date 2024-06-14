import setData from '@/components/firebase/setIP';

type ResData = { UUID: string; ip: string };
type SetIPResponse = { success: boolean; clientIp: string };

export async function POST(req: Request): Promise<Response> {
  try {
    const data: ResData = (await req.json()) as ResData;
    const { UUID, ip } = data;
    const result = await saveClientIP(UUID, ip);

    return createJsonResponse(result, 200);
  } catch (error) {
    logError('Error fetching data', error);
    return createJsonResponse({ success: false, error: 'Internal Server Error' }, 500);
  }
}

async function saveClientIP(uuid: string, ip: string): Promise<SetIPResponse> {
  console.log('Calling setIP API with:', { uuid, ip });
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

function createJsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
