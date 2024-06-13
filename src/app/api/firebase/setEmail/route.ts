import { escapeHTML } from '@/components/funcs/Translator';
import db from '../base';

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

type ResData = { name: string; email: string; contents: string; uuid: string; ip: string };

export async function POST(req: Request) {
  let returnJson = { success: false };
  const data: ResData = (await req.json()) as ResData;
  const name: string = escapeHTML(data.name || '');
  const email: string = escapeHTML(data.email || '').replace(/\s+/g, '');
  const contents: string = escapeHTML(data.contents || '');
  const uuid: string = escapeHTML(data.uuid || '');
  const ip: string = escapeHTML(data.ip || '');
  try {
    returnJson = await setData(name, email, contents, uuid, ip);
  } catch (e) {
    console.error('Error setting data:', e);
  }
  return Response.json(returnJson);
}
