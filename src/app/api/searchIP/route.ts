import url from '@/components/funcs/api_baseURL';

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
    const response = await fetch(`${url()}/api/firebase/searchData?UUID=${uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = (await response.json()) as { success: boolean; clientIp: string };
      returnJson = data;
    } else {
      console.error('Failed to fetch data:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return returnJson;
}
