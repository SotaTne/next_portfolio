// searchData/route.ts
import { escapeHTML } from '@/components/funcs/Translator';
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

type ResData = { UUID: string };

export async function POST(req: Request) {
  let returnJson: SearchDataResponse = { success: false, clientIp: '' };
  const data: ResData = (await req.json()) as ResData;
  const uuid: string = escapeHTML(data.UUID || '');

  try {
    returnJson = await searchData(uuid);
  } catch (e) {
    console.error('Error searching data:', e);
  }

  return Response.json(returnJson);
}
