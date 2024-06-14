import url from '@/components/funcs/api_baseURL';

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
  try {
    const response = await fetch(`${url()}/api/firebase/setIP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ UUID: uuid, IP: ip }),
    });

    if (response.ok) {
      const data = (await response.json()) as { success: boolean };
      return { success: data.success, clientIp: ip };
    } else {
      logError('Error setting IP: Response not ok');
      return { success: false, clientIp: '' };
    }
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
