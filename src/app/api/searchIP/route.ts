import searchIpData from '@/components/firebase/search';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const UUID = url.searchParams.get('UUID');

  let returnJson = { success: false, clientIp: '' };

  if (UUID == null) {
    return new Response(JSON.stringify({ success: false, error: 'UUID is missing' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const searchedData = await searchData(UUID);
    if (searchedData.success) {
      returnJson = { success: true, clientIp: searchedData.clientIp };
    }
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

async function searchData(uuid: string): Promise<{ success: boolean; clientIp: string }> {
  let returnJson = { success: false, clientIp: '' };
  try {
    returnJson = await searchIpData(uuid);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return returnJson;
}
