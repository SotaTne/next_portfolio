const url = `${process.env.NEXT_PUBLIC_VERCEL_URL != null ? process.env.NEXT_PUBLIC_VERCEL_URL : process.env.NETLIFY_SITE_URL != null ? process.env.NETLIFY_SITE_URL : 'http://localhost:3000'}`;
export default url;
