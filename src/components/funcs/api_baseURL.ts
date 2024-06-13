const url = (): string => {
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  const netlifyUrl = process.env.NETLIFY_SITE_URL;

  return vercelUrl !== null && vercelUrl !== undefined
    ? `https://${vercelUrl}`
    : netlifyUrl !== null && netlifyUrl !== undefined
      ? `https://${netlifyUrl}`
      : 'http://localhost:3000';
};

export default url;
