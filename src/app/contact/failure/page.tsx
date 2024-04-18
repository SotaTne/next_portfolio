"use client";

import Footer from "@/components/Footer";
//import { escapeHTML } from "@/components/funcs/Translator";
import Header from "@/components/Header";
//import { useSearchParams } from "next/navigation";

export default function Page() {
  //const searchParams = useSearchParams();
  //const email: string = escapeHTML(searchParams.get("email") || "").replace(/\s+/g, "");
  //const name: string = escapeHTML(searchParams.get("name") || "");
  //const contents: string = escapeHTML(searchParams.get("contents") || "");
  //const fail_email: boolean = !!email.match(/.+@.+\..+/);
  //const has_name: boolean = name !== "" && !!name.match(/\S/g);
  //const has_contents: boolean = contents !== "" && !!name.match(/\S/g);
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto flex h-screen w-4/5 flex-col content-center items-center justify-center pt-[86px] md:flex-row md:justify-around">
          <ul className="flex flex-col md:flex-row">
            <li>
              <h1>送信が失敗しました</h1>
            </li>
            <li></li>
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
