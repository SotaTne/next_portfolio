import deleteIpData from '@/components/firebase/deleteData';
import searchIpData from '@/components/firebase/search';
import setData from '@/components/firebase/setEmail';
import { escapeHTML } from '@/components/funcs/Translator';
import { SendEMail } from '@/components/node_funcs/Email';

type ResData = { name: string; email: string; contents: string; uuid: string; ip: string };

const isIpAddress = (ip: string): boolean => {
  const ipv4Pattern =
    /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/;
  const ipv6Pattern =
    /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){1,7}:)|(([0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2})|(([0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3})|(([0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4})|(([0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5})|([0-9A-Fa-f]{1,4}:)((:[0-9A-Fa-f]{1,4}){1,6})|(:((:[0-9A-Fa-f]{1,4}){1,7}|:))|(fe80:(:[0-9A-Fa-f]{0,4}){0,4}%[0-9a-zA-Z]{1,})|(::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))|(([0-9A-Fa-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])))$/;
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
  //return true;
};

export async function POST(req: Request) {
  const referer = req.headers.get('referer');
  const origin = req.headers.get('origin');
  let isRefererValid = false;

  // refererとoriginが存在する場合のみ処理
  if (referer != null && origin != null) {
    // refererのURLオブジェクトを作成
    const refererUrl = new URL(referer);
    // refererのクエリパラメータを除いたパスを取得
    const refererBasePath = refererUrl.pathname;

    // refererのベースパスが/contactで、originが正しいかどうかを検証
    isRefererValid = origin + refererBasePath === `${origin}/contact`;
  }
  let returnJson = { success: false };

  try {
    const data: ResData = (await req.json()) as ResData;
    const name: string = escapeHTML(data.name || '');
    const email: string = escapeHTML(data.email || '').replace(/\s+/g, '');
    const contents: string = escapeHTML(data.contents || '');
    const uuid: string = escapeHTML(data.uuid || '');
    const ip: string = escapeHTML(data.ip || '');

    console.log('Received Data:', { name, email, contents, uuid, ip });

    // Check if UUID and IP are linked
    const { success: searchSuccess, clientIp } = await searchData(uuid);
    const success = searchSuccess && clientIp === ip;

    const allMatch =
      typeof name === 'string' &&
      typeof email === 'string' &&
      typeof contents === 'string' &&
      typeof uuid === 'string' &&
      typeof ip === 'string' &&
      email.match(/.+@.+\..+/) &&
      name.trim() !== '' &&
      contents.trim() !== '' &&
      isRefererValid &&
      isIpAddress(ip) &&
      uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) &&
      success;

    console.log('All Match:', allMatch);

    if (allMatch != null && allMatch) {
      await deleteData(uuid);

      const setEmailResponse = await setEmail(name, email, contents, uuid, ip);
      if (setEmailResponse.success) {
        await SendEMail({
          name: name,
          fromMail: email,
          contents: contents,
        });
        returnJson = { success: true };
      }
    } else {
      console.log('Data did not match validation checks');
    }
  } catch (error) {
    console.error('Error processing request:', error);
  }

  return new Response(JSON.stringify(returnJson), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function setEmail(
  name: string,
  email: string,
  contents: string,
  uuid: string,
  ip: string,
): Promise<{ success: boolean }> {
  let returnJson = { success: false };
  try {
    returnJson = await setData(name, email, contents, uuid, ip);
  } catch (error) {
    console.error('Error setting email data:', error);
  }
  return returnJson;
}

async function searchData(uuid: string): Promise<{ success: boolean; clientIp: string }> {
  let returnJson = { success: false, clientIp: '' };
  try {
    returnJson = await searchIpData(uuid);
  } catch (error) {
    console.error('Error searching data:', error);
  }
  return returnJson;
}

async function deleteData(uuid: string): Promise<{ success: boolean }> {
  let returnJson = { success: false };
  try {
    returnJson = await deleteIpData(uuid);
  } catch (error) {
    console.error('Error deleting data:', error);
  }
  return returnJson;
}
