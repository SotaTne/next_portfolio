import url from '@/components/funcs/api_baseURL';
import db from '../firebase/base';

type ResData = { UUID: string; ip: string };
type SetIPResponse = { success: boolean; clientIp: string };

export async function POST(req: Request): Promise<Response> {
  console.log('API Endpoint Hit'); // デバッグログを追加
  const ref = db.collection('test').doc('test');
  try {
    await ref.set({ go: 'name' });
  } catch (error) {
    console.error(error);
  }

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
  console.log('Calling setIP API with:', { uuid, ip }); // デバッグログを追加
  try {
    const response = await fetch(`${url()}/api/firebase/setIP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ UUID: uuid, IP: ip }),
    });

    console.log('Response status:', response.status); // デバッグログを追加

    if (response.ok) {
      const data = (await response.json()) as { success: boolean };
      console.log('Response data:', data); // デバッグログを追加
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
