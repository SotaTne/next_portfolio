import deleteIpData from '@/components/firebase/deleteData';
import searchIpData from '@/components/firebase/search';
import setData from '@/components/firebase/setEmail';
import { escapeHTML } from '@/components/funcs/Translator';
import { SendEMail } from '@/components/node_funcs/Email';

type ResData = { name: string; email: string; contents: string; uuid: string; ip: string };

export async function POST(req: Request) {
  const referer = req.headers.get('referer');
  const data: ResData = (await req.json()) as ResData;
  const name: string = escapeHTML(data.name || '');
  const email: string = escapeHTML(data.email || '').replace(/\s+/g, '');
  const contents: string = escapeHTML(data.contents || '');
  const uuid: string = escapeHTML(data.uuid || '');
  const ip: string = escapeHTML(data.ip || '');
  const origin = req.headers.get('origin');
  console.log(name);
  console.log(email);
  console.log(contents);
  console.log(uuid);
  console.log(ip);
  //uuidとipが結び付けられているものか確認する
  let clientIp = '';
  let success = false;

  try {
    const searchedData = await searchData(uuid);
    clientIp = searchedData.success ? searchedData.clientIp : '';
    console.log(`Client IP: ${clientIp}`);
    success = searchedData.success && clientIp == ip;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const allMatch: boolean =
    typeof name === 'string' && typeof email === 'string' && typeof contents === 'string'
      ? Boolean(email.match(/.+@.+\..+/)) &&
        name !== '' &&
        Boolean(name.match(/\S/g)) &&
        contents !== '' &&
        Boolean(contents.match(/\S/g)) &&
        `${origin}/contact` == referer &&
        Boolean(
          ip.match(
            /^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/,
          ) ||
            ip.match(
              /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
            ),
        ) &&
        Boolean(
          uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        ) &&
        success
      : false;
  console.log('allMatch');
  console.log(allMatch);
  console.log('ref');
  console.log(referer);

  let returnJson = { success: false };
  try {
    await deleteData(uuid);
    if (allMatch) {
      try {
        await setEmail(name, email, contents, uuid, ip);
        try {
          await SendEMail({
            name: name,
            fromMail: email,
            contents: contents,
          });
          returnJson = { success: true };
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      console.log(allMatch);
    } else {
      console.log('not match');
    }
  } catch (e) {
    console.error('Error setting data:', e);
  }

  return Response.json(returnJson);
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
    console.error('Error fetching data:', error);
  }
  return returnJson;
}

async function searchData(uuid: string): Promise<{ success: boolean; clientIp: string }> {
  let returnJson = { success: false, clientIp: '' };

  try {
    returnJson = await searchIpData(uuid);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return returnJson;
}

async function deleteData(uuid: string): Promise<{ success: boolean }> {
  let returnJson = { success: false };
  try {
    returnJson = await deleteIpData(uuid);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return returnJson;
}
