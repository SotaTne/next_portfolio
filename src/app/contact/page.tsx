"use client";

import Footer from "@/components/Footer";
import { escapeHTML } from "@/components/funcs/Translator";
import Header from "@/components/Header";
import { FormEvent } from "react";

type mail_res_type = {
  return_success: boolean;
  response_status: number;
  params: { email: string; name: string; contents: string };
};

function emailContact(formData: FormData): mail_res_type {
  const name: string = escapeHTML((formData.get("name") as string) || "");
  const email: string = escapeHTML((formData.get("email") as string) || "").replace(/\s+/g, "");
  const contents: string = escapeHTML((formData.get("contents") as string) || "");
  console.log(name, email, contents);
  let return_success: boolean = false;
  const return_map: mail_res_type = {
    return_success: return_success,
    response_status: 0,
    params: { email: email, contents: contents, name: name },
  };

  // fetch関数の戻り値をawaitするか、.thenで処理する

  fetch("/api/contact", {
    method: "POST",
    mode: "same-origin",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, email: email, contents: contents }),
  })
    .then((response) => {
      console.log("res");
      if (response.ok) {
        response
          .json()
          .then((value: { success: boolean; clientIp: string }) => {
            return_success = value.success;
            console.log(`client IP :${value.clientIp}`);
            console.log("return_success");
            console.log(return_success);
            return_map.return_success = return_success;
            return_map.response_status = response.status;
          })
          .catch((error) => {
            throw error;
          });
      } else {
        return_map.response_status = response.status;
      }

      // 応答を処理する
    })
    .catch((error) => {
      () => {};
      console.log(error);
    });

  console.log(return_map.return_success);
  return return_map;
}

function getIp() {
  let return_value = "";
  fetch("/api/get_ip", {
    method: "POST",
    mode: "same-origin",

    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        response
          .json()
          .then((value: { success: boolean; clientIp: string }) => {
            console.log("vlaue : ");
            console.log(value);
            return_value = value.clientIp;
            console.log("ReturnValue" + return_value);
          })
          .catch((error) => {
            console.log("error1");
            console.log(error);
            throw error;
          });
      }
    })
    .catch((error) => {
      console.log("error2");

      console.log(error);
      throw error;
    });
  console.log("last");
  return return_value;
}

/*
function checkRedirect(UUID: string) {
  fetch("/api/check", {})
    .then((response) => {
      if (response.ok) {
        response
          .json()
          .then((value: { success: boolean; UUID: string }) => {
            console.log(value.success);
          })
          .catch((error) => {
            throw error;
          });
      }
    })
    .catch((error) => {
      throw error;
    });
}
*/
export default function Page({ searchParams: { UUID } }: { searchParams: { UUID: string } }) {
  //const router = useRouter();
  console.log(UUID);
  const IP = getIp();
  console.log(getIp() + "getIpIP");
  console.log("IP : " + IP);
  const clickSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //ページのリロードを防ぐ
    const formData = new FormData(e.currentTarget);
    const res_result = emailContact(formData);
    //const params = new URLSearchParams(res_result.params).toString();
    if (res_result.return_success) {
      //router.replace(`/contact/success?${params}`);
    } else {
      //router.replace(`contact/failure?${params}`);
    }
  };

  return (
    <>
      <Header />
      <main>
        <section className="mx-auto flex h-screen w-4/5 flex-col content-center items-center justify-center pt-[86px] md:flex-row md:justify-around">
          <h1>IP : {IP}</h1>
          <form onSubmit={clickSubmit}>
            <ul>
              <li>
                <ul>
                  <li>
                    <ul>
                      <li>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="bg-red-50"
                          placeholder="お名前"
                        />
                      </li>
                      <li>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="bg-red-50"
                          placeholder="メールアドレス"
                        />
                      </li>
                    </ul>
                  </li>
                  <li>
                    <textarea
                      name="contents"
                      id="contents"
                      cols={30}
                      rows={10}
                      className="bg-red-50"
                      placeholder="お問い合わせ内容"
                    />
                  </li>
                </ul>
              </li>
              <li>
                <button type="submit">送信</button>
              </li>
            </ul>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
