import { NextRequest } from 'next/server';

const getClientIp = (req: NextRequest): string | null => {
  const headers = req.headers;

  // ヘッダーの順序でIPアドレスを取得
  const headerNames = [
    'cf-connecting-ip',
    'true-client-ip',
    'x-forwarded-for',
    'x-real-ip',
    'fastly-client-ip',
  ];

  for (const headerName of headerNames) {
    const headerValue = headers.get(headerName);
    if (headerValue != null) {
      if (headerName === 'x-forwarded-for') {
        const forwardedForArray = headerValue.split(',');
        if (forwardedForArray.length > 0 && forwardedForArray[0] != null) {
          return forwardedForArray[0].trim();
        }
      } else {
        return headerValue;
      }
    }
  }

  return null;
};

export default getClientIp;
