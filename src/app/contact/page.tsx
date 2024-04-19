"use client";

import Footer from "@/components/Footer";
import { escapeHTML } from "@/components/funcs/Translator";
import Header from "@/components/Header";
import { FormEvent } from "react";
import axios from "axios";

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
          .then((value: { success: boolean }) => {
            return_success = value.success;
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

/*
function getIp() {
  let res_fetch = "";
  fetch("/api/getIp", {
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
            res_fetch = value.clientIp;
          })
          .catch((error) => {
            console.log("throwError1");
            throw error;
          });
      }
    })
    .catch((error) => {
      console.log("throwError2");
      console.log(error);
      () => {};
    });
  return res_fetch;
}
*/
async function getIp() {
  let return_response: { success: boolean; clientIp: string } = {
    success: false,
    clientIp: "",
  };
  try {
    return_response = ((await axios.get("/api/getIp")).data as {
      success: boolean;
      clientIp: string;
    }) || { success: false, clientIp: "" };
    console.log(return_response);
  } catch (error) {
    console.log(error);
  }
  return return_response;
}

/*
function getIp() {
  axios
    .get("/api/getIp")
    .then((value) => {
      console.log(value);
    })
    .catch((error) => {
      console.log(error);
    });
}
*/
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
  console.log("UUID" + UUID);
  console.log("ip\n");

  console.log(getIp());
  console.log("endi\n");
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
