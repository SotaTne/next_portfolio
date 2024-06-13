import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  let returnJson = { success: false, clientIp: '' };

  // クライアントのIPアドレスを取得する関数
  const getClientIp = (req: NextRequest): string | null => {
    const xForwardedFor = req.headers.get('x-forwarded-for');
    if (xForwardedFor != null) {
      const forwardedForArray = xForwardedFor.split(',');
      if (forwardedForArray[0] != null) {
        return forwardedForArray[0].trim();
      }
    }

    const xRealIp = req.headers.get('x-real-ip');
    if (xRealIp !== null && xRealIp !== undefined) {
      return xRealIp;
    }

    // リクエストの元のIPアドレスを取得する方法は、サーバーの実装によります。
    if (req.ip == undefined) {
      return null;
    } else {
      return req.ip;
    }
  };

  // クライアントのIPアドレスを取得
  const clientIp = getClientIp(req);

  // レスポンスを返す
  if (clientIp != null) {
    returnJson = { success: true, clientIp };
  }

  return NextResponse.json(returnJson);
}
