import getClientIp from '@/components/node_funcs/GetClientIP';
import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  let returnJson = { success: false, clientIp: '' };
  const referer = req.headers.get('referer');
  const origin = req.headers.get('origin');
  let isRefererValid = false;

  if (referer != null && origin != null) {
    const refererUrl = new URL(referer);
    const refererBasePath = refererUrl.pathname;
    isRefererValid = origin + refererBasePath === `${origin}/contact`;
  }

  if (isRefererValid) {
    // クライアントのIPアドレスを取得する関数

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
  }

  return NextResponse.json(returnJson);
}
