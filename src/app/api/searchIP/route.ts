import searchIpData from '@/components/firebase/search';
import { isIpAddress, validateUUID } from '@/components/funcs/matcher';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const UUID = url.searchParams.get('UUID');
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
  console.log(referer);
  console.log(origin);
  let returnJson = { success: false, clientIp: '' };
  console.log(validateUUID(UUID as string));
  console.log(isRefererValid);
  if (UUID == null || !isRefererValid || !validateUUID(UUID)) {
    return new Response(JSON.stringify({ success: false, error: 'UUID is missing' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const searchedData = await searchData(UUID);
    if (searchedData.success && isIpAddress(searchedData.clientIp)) {
      returnJson = { success: true, clientIp: searchedData.clientIp };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify(returnJson), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function searchData(uuid: string): Promise<{ success: boolean; clientIp: string }> {
  let returnJson = { success: false, clientIp: '' };
  try {
    returnJson = await searchIpData(uuid);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return returnJson;
}
