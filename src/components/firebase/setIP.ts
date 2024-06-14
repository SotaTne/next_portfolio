import db from './base';

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
export default setData;
