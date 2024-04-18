"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation"; // Suspense を追加
import Link from "next/link";
import { middleware } from "@/components/middleware/middleware";
import { NextRequest } from "next/server";

export default function Page(req: NextRequest) {
  const router = useRouter();
  middleware(req);
  /*
  useEffect(() => {
    const now = Number(searchParams.now);
    const to = searchParams.to;
    const useTo = to.replace(/%2F/g, "/");
    console.log("useTo : " + useTo);
    const current = Date.now();
    console.log();
    console.log("now : " + now);
    console.log("current : " + current);
    if (current - now > 0 && current - now < 1000) {
      console.log("ok");
      console.log(useTo);
      //router.(useTo);

      router.push("/contact");
    } else {
      console.log("no");
      router.push("/");
    }
  }, [router, searchParams]);
  */
  useEffect(() => {
    const now = Number(searchParams.now);
    const to = searchParams.to;
    const useTo = to.replace(/%2F/g, "/");
    console.log("useTo : " + useTo);
    const current = Date.now();
    console.log();
    console.log("now : " + now);
    console.log("current : " + current);
    router.replace(current - now > 0 && current - now < 1000 ? "/contact" : "/"); // ここでリダイレクト
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {" "}
      <div>
        <Link href="/contact">TOP</Link>
      </div>
    </Suspense>
  );
}
