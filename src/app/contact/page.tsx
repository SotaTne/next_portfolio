'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { escapeHTML } from '@/components/funcs/Translator';
import { generateUUIDv4 } from '@/components/funcs/uuid';
import { redirect } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

type MailResType = {
  return_success: boolean;
  response_status: number;
  params: { email: string; name: string; contents: string };
};

const inputFields = [
  { type: 'text', name: 'name', placeholder: 'お名前' },
  { type: 'email', name: 'email', placeholder: 'メールアドレス' },
];

async function fetchWithUUID(
  endpoint: string,
  method: string,
  UUID?: string,
  ip?: string,
): Promise<{ success: boolean; clientIp: string }> {
  try {
    const response = await fetch(`/api/${endpoint}${UUID ? `?UUID=${UUID}` : ''}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(method === 'POST'
        ? { body: JSON.stringify(UUID ? (ip && UUID ? { UUID, ip } : { UUID }) : {}) }
        : {}),
    });
    if (response.ok) {
      const data = (await response.json()) as { success: boolean; clientIp: string };
      return data;
    } else {
      return { success: false, clientIp: '' };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { success: false, clientIp: '' };
  }
}

async function emailContact(
  name: string,
  email: string,
  contents: string,
  uuid: string,
  ip: string,
): Promise<MailResType> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, contents, uuid, ip }),
    });

    if (response.ok) {
      const data = (await response.json()) as { success: boolean };
      return {
        return_success: data.success,
        response_status: response.status,
        params: { email, name, contents },
      };
    } else {
      return {
        return_success: false,
        response_status: response.status,
        params: { email, name, contents },
      };
    }
  } catch (error) {
    console.error('Error sending contact form:', error);
    return { return_success: false, response_status: 0, params: { email, name, contents } };
  }
}

export default function Page({ searchParams: { UUID } }: { searchParams: { UUID: string } }) {
  const [isValid, setIsValid] = useState(false);
  const [uuid, setUUID] = useState('');
  const [ip, setIp] = useState('');

  useEffect(() => {
    const validateUUID = async () => {
      try {
        if (
          UUID &&
          Boolean(
            UUID.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
          )
        ) {
          // UUIDが存在する場合
          const { success: successSearch, clientIp: ipSearched } = await fetchWithUUID(
            'searchIP',
            'GET',
            UUID,
          );
          const { success: successGet, clientIp: ipGet } = await fetchWithUUID('onlyIP', 'GET');

          if (successSearch && successGet && ipSearched === ipGet) {
            setUUID(UUID);
            setIp(ipGet);
            setIsValid(true);
          } else {
            setIsValid(false);
          }
        } else {
          // UUIDが存在しない場合
          const newUUID = generateUUIDv4();
          const { success, clientIp } = await fetchWithUUID('onlyIP', 'GET');
          if (success && clientIp) {
            await fetchWithUUID('setData', 'POST', newUUID, clientIp);
            setUUID(newUUID);
            setIp(clientIp);
            setIsValid(true);
            redirect(`/contact?UUID=${newUUID}`);
          } else {
            setIsValid(false);
          }
        }
      } catch (error) {
        console.error('Error validating UUID:', error);
        setIsValid(false);
      }
    };

    void validateUUID();
  }, [UUID]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = escapeHTML((formData.get('name') as string) || '');
    const email = escapeHTML((formData.get('email') as string) || '').replace(/\s+/g, '');
    const contents = escapeHTML((formData.get('contents') as string) || '');
    const useUUID = escapeHTML(uuid);
    const useIP = escapeHTML(ip);

    try {
      const result = await emailContact(name, email, contents, useUUID, useIP);
      if (result.return_success) {
        // router.replace(`/contact/success`);
      } else {
        // router.replace(`/contact/failure`);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  return isValid ? (
    <>
      <Header />
      <main>
        <section className="mx-auto flex h-screen w-4/5 flex-col content-center items-center justify-center pt-[86px] md:flex-row md:justify-around">
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={handleSubmit}>
            {inputFields.map(({ type, name, placeholder }) => (
              <input
                key={name}
                type={type}
                name={name}
                placeholder={placeholder}
                className="mb-2 bg-red-50"
              />
            ))}
            <textarea
              name="contents"
              placeholder="お問い合わせ内容"
              rows={5}
              className="mb-2 bg-red-50"
            />
            <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
              送信
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  ) : (
    <div>Loading...</div>
  );
}
