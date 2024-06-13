import url from '@/components/funcs/api_baseURL';
import { NextRequest, NextResponse } from 'next/server';

type ResData = { UUID: string; ip: string };
type SetIPResponse = { success: boolean; clientIp: string };

export async function POST(req: NextRequest) {
  let returnJson = { success: false, clientIp: '' };

  try {
    const data: ResData = (await req.json()) as ResData;
    const { UUID, ip } = data;
    returnJson = await saveClientIP(UUID, ip);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching data:', error.message);
    } else {
      console.error('Unknown error fetching data');
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
  return NextResponse.json(returnJson);
}

async function saveClientIP(uuid: string, ip: string): Promise<SetIPResponse> {
  let returnJson: SetIPResponse = { success: false, clientIp: '' };
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
      returnJson = { success: data.success, clientIp: ip };
    } else {
      console.error('Error setting IP: Response not ok');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error setting IP:', error.message);
    } else {
      console.error('Unknown error setting IP');
    }
  }
  return returnJson;
}
