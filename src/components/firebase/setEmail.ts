import db from './base';

const setData = async (name: string, email: string, contents: string, uuid: string, ip: string) => {
  const docRef = db.collection('email').doc(uuid);
  let returnJson = { success: false };
  try {
    await docRef.set({
      name: name,
      email: email,
      contents: contents,
      ip: ip,
    });
    returnJson = { success: true };
  } catch (error) {
    console.error('Error setting document: ', error);
  }
  return returnJson;
};
export default setData;
