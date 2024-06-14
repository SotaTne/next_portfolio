import db from '../base';

type SetDataResponse = { success: boolean };

const setData = async (uuid: string, ip: string): Promise<SetDataResponse> => {
  console.log('setIPFire', { uuid, ip }); // デバッグログを追加
  const docRef = db.collection('uuidIpMap').doc(uuid);
  let returnJson: SetDataResponse = { success: false };
  try {
    await docRef.set({ IP: ip });
    returnJson = { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error setting document:', error.message);
    } else {
      console.error('Unknown error setting document');
    }
  }
  return returnJson;
};

type ResData = {
  UUID: string;
  IP: string;
};

export async function POST(req: Request): Promise<Response> {
  let returnJson = { success: false };
  try {
    const data: ResData = (await req.json()) as ResData;
    const UUID = data.UUID;
    const IP = data.IP;
    returnJson = await setData(UUID, IP);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error setting data:', error.message);
    } else {
      console.error('Unknown error setting data');
    }
  }
  return new Response(JSON.stringify(returnJson), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
