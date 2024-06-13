import url from '@/components/funcs/api_baseURL';

type ResData = { UUID: string; ip: string };

export async function POST(req: Request) {
  let returnJson = { success: false, clientIp: '' };
  try {
    const data: ResData = (await req.json()) as ResData;
    const UUID = data.UUID;
    const IP = data.ip;
    returnJson = await setIP(UUID, IP);
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

async function setIP(uuid: string, ip: string): Promise<{ success: boolean; clientIp: string }> {
  let returnJson = { success: false, clientIp: '' };
  try {
    const response = await fetch(`${url}/api/firebase/setIP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ UUID: uuid, IP: ip }),
    });
    if (response.ok) {
      const data = (await response.json()) as { success: boolean };
      const success = data.success;
      returnJson = { success: success, clientIp: '' };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return returnJson;
}
