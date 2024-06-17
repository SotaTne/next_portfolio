import deleteIpData from '@/components/firebase/deleteData';
import searchIpData from '@/components/firebase/search';
import setData from '@/components/firebase/setEmail';
import { isIpAddress, validateEmail, validateUUID } from '@/components/funcs/matcher';
import { escapeHTML } from '@/components/funcs/Translator';
import { SendEMail } from '@/components/node_funcs/Email';

type ResData = { name: string; email: string; contents: string; uuid: string; ip: string };

const validateInput = (
  name: string,
  email: string,
  contents: string,
  uuid: string,
  ip: string,
  isRefererValid: boolean,
  searchSuccess: boolean,
  clientIp: string,
): boolean => {
  return (
    typeof name === 'string' &&
    name.trim() !== '' &&
    typeof email === 'string' &&
    validateEmail(email) &&
    typeof contents === 'string' &&
    contents.trim() !== '' &&
    typeof uuid === 'string' &&
    validateUUID(uuid) &&
    typeof ip === 'string' &&
    isIpAddress(ip) &&
    isRefererValid &&
    searchSuccess &&
    clientIp === ip
  );
};

export async function POST(req: Request) {
  const referer = req.headers.get('referer');
  let origin = req.headers.get('origin');
  let isRefererValid = false;

  // Originがnullの場合、refererから取得
  if (origin === null && referer !== null) {
    try {
      const refererUrl = new URL(referer);
      origin = refererUrl.origin;
    } catch (error) {
      console.error('Error parsing referer URL:', error);
    }
  }

  if (referer != null && origin != null) {
    const refererUrl = new URL(referer);
    const refererBasePath = refererUrl.pathname;
    isRefererValid = origin + refererBasePath === `${origin}/contact`;
  }

  let returnJson = { success: false };

  try {
    const data: ResData = (await req.json()) as ResData;
    const name = escapeHTML(data.name || '');
    const email = escapeHTML(data.email || '').replace(/\s+/g, '');
    const contents = escapeHTML(data.contents || '');
    const uuid = escapeHTML(data.uuid || '');
    const ip = escapeHTML(data.ip || '');

    console.log('Received Data:', { name, email, contents, uuid, ip });

    const { success: searchSuccess, clientIp } = await searchData(uuid);

    if (validateInput(name, email, contents, uuid, ip, isRefererValid, searchSuccess, clientIp)) {
      const deleteResponse = await deleteData(uuid);
      if (deleteResponse.success) {
        const setEmailResponse = await setEmail(name, email, contents, uuid, ip);
        if (setEmailResponse.success) {
          await SendEMail({ name, fromMail: email, contents });
          returnJson = { success: true };
        }
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
