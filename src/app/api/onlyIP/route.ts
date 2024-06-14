import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  let returnJson = { success: false, clientIp: '' };

  // クライアントのIPアドレスを取得する関数
  const getClientIp = (req: NextRequest): string | null => {
    const headers = req.headers;

    // Cloudflareの場合
    const cfConnectingIP = headers.get('cf-connecting-ip');
    if (cfConnectingIP != null) {
      return cfConnectingIP;
    }

    const trueClientIP = headers.get('true-client-ip');
    if (trueClientIP != null) {
      return trueClientIP;
    }
    // x-forwarded-forヘッダーの値を取得
    const xForwardedFor = headers.get('x-forwarded-for');
    if (xForwardedFor != null) {
      const forwardedForArray = xForwardedFor.split(',');
      if (forwardedForArray.length > 0 && forwardedForArray[0] != null) {
        return forwardedForArray[0].trim();
      }
    }

    // x-real-ipヘッダーの値を取得
    const xRealIp = headers.get('x-real-ip');
    if (xRealIp != null) {
      return xRealIp;
    }

    // 追加のヘッダーをチェック（例：fastly-client-ip）
    const fastlyClientIp = headers.get('fastly-client-ip');
    if (fastlyClientIp != null) {
      return fastlyClientIp;
    }
    /*
    const remoteAddr = req.socket.remoteAddress;
    if (remoteAddr) {
      return remoteAddr;
    }
    */

    // req.ipはサーバーレス環境では信頼できないことが多い
    return null;
  };

  // クライアントのIPアドレスを取得
  const clientIp = getClientIp(req);

  // レスポンスを返す
  if (clientIp != null) {
    returnJson = { success: true, clientIp };
  } else {
    // クライアントのIPアドレスが取得できない場合はエラーログを記録
    console.error('Unable to determine client IP address:', {
      headers: req.headers,
      ip: req.ip,
    });
    returnJson = { success: false, clientIp: 'Not Found' };
  }

  return NextResponse.json(returnJson);
}
