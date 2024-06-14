/*
// searchData/route.ts
import db from '../base';

type SearchDataResponse = { success: boolean; clientIp: string };

const searchData = async (uuid: string): Promise<SearchDataResponse> => {
  const Ref = db.collection('uuidIpMap').doc(uuid);
  let returnJson: SearchDataResponse = { success: false, clientIp: '' };

  try {
    const doc = await Ref.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      const data = doc.data();
      if (data && Boolean(data.IP)) {
        returnJson = { success: true, clientIp: data.IP as string };
      }
      console.log('Document data:', data);
    }
  } catch (error) {
    console.error('Error getting document: ', error);
  }

  return returnJson;
};

export async function GET(req: Request) {
  let returnJson: SearchDataResponse = { success: false, clientIp: '' };
  const url = new URL(req.url);
  const uuid = url.searchParams.get('UUID');
  if (uuid != null) {
    try {
      returnJson = await searchData(uuid);
    } catch (e) {
      console.error('Error searching data:', e);
    }
  }

  return Response.json(returnJson);
}
*/
