import url from '@/components/funcs/api_baseURL';
import { NextRequest, NextResponse } from 'next/server';

type ResData = { UUID: string };

export async function POST(req: NextRequest) {
  let returnJson = { success: false, clientIp: '' };

  // クライアントのIPアドレスを取得する関数
  const getClientIp = (req: NextRequest): string | null => {
    // x-forwarded-forヘッダーの値を取得
    const xForwardedFor = req.headers.get('x-forwarded-for');
    if (xForwardedFor != null) {
      const forwardedForArray = xForwardedFor.split(',');
      if (forwardedForArray.length > 0 && forwardedForArray[0] != null) {
        return forwardedForArray[0].trim();
      }
    }

    // x-real-ipヘッダーの値を取得
    const xRealIp = req.headers.get('x-real-ip');
    if (xRealIp != null) {
      return xRealIp;
    }

    // 追加のヘッダーをチェック（例：fastly-client-ip）
    const fastlyClientIp = req.headers.get('fastly-client-ip');
    if (fastlyClientIp != null) {
      return fastlyClientIp;
    }

    // req.ipはサーバーレス環境では信頼できないことが多い
    return null;
  };

  // クライアントのIPアドレスを取得
  const clientIp = getClientIp(req);

  if (clientIp != null) {
    try {
      const data: ResData = (await req.json()) as ResData;
      const UUID = data.UUID;
      returnJson = await setIP(UUID, clientIp);
    } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
  } else {
    // クライアントのIPアドレスが取得できない場合はエラーログを記録
    console.error('Unable to determine client IP address:', {
      headers: req.headers,
      ip: req.ip,
    });
  }

  return NextResponse.json(returnJson);
}

async function setIP(uuid: string, ip: string): Promise<{ success: boolean; clientIp: string }> {
  console.log('SetIP');
  let returnJson = { success: false, clientIp: '' };
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
      const success = data.success;
      returnJson = { success: success, clientIp: ip };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return returnJson;
}
