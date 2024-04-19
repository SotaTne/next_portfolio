export function GET(req: Request): Response {
  // クライアントのIPアドレスを取得する関数
  const getClientIp = (req: Request): string | null => {
    const headers = req.headers;

    // 'x-forwarded-for' ヘッダーからクライアントのIPアドレスを取得
    const xForwardedFor = headers.get("x-forwarded-for");
    if (xForwardedFor) {
      return (xForwardedFor.split(",")[0] + "").trim();
    }
    // 'x-real-ip' ヘッダーからクライアントのIPアドレスを取得
    const xRealIp = headers.get("x-real-ip");
    if (xRealIp) {
      return xRealIp;
    }

    // リクエストの元のIPアドレスを取得する方法は、サーバーの実装によります。
    // Node.jsなどのプラットフォームで`req.connection.remoteAddress`や`req.socket.remoteAddress`を使って取得可能です。
    // サーバーのプラットフォームに応じて修正してください。
    return null;
  };

  // クライアントのIPアドレスを取得
  const clientIp: string | null = getClientIp(req);
  console.log(`Client IP: ${clientIp}`);

  // レスポンスを返す
  if (clientIp) {
    return Response.json({ success: true, clientIp: clientIp });
  } else {
    return Response.json({ success: false, clientIp: "" });
  }
}
