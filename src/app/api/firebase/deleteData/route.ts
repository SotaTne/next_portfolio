// deleteData/route.ts
import { escapeHTML } from '@/components/funcs/Translator';
import db from '../base';

type DeleteDataResponse = { success: boolean };

const deleteData = async (uuid: string): Promise<DeleteDataResponse> => {
  const Ref = db.collection('uuidIpMap').doc(uuid);
  let returnJson: DeleteDataResponse = { success: false };

  try {
    await Ref.delete();
    returnJson = { success: true };
  } catch (error) {
    console.error('Error deleting document: ', error);
  }

  return returnJson;
};

type ResData = { UUID: string };

export async function POST(req: Request) {
  let returnJson: DeleteDataResponse = { success: false };
  const data: ResData = (await req.json()) as ResData;
  const uuid: string = escapeHTML(data.UUID || '');

  try {
    returnJson = await deleteData(uuid);
  } catch (e) {
    console.error('Error deleting data:', e);
  }

  return Response.json(returnJson);
}
