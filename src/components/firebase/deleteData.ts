import db from './base';

type DeleteDataResponse = { success: boolean };

const deleteIpData = async (uuid: string): Promise<DeleteDataResponse> => {
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
export default deleteIpData;
