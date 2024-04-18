import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log(req.nextUrl.pathname);
  /*
  
  //console.log(req.nextUrl);
  // コンタクトフォームをspamから守るためのページ遷移

  //console.log("hello");
  const pathname = req.nextUrl.pathname;
  const origin = req.nextUrl.origin;
  const url = req.nextUrl.clone();
  const toPath = "/contact/auth";
  //const urlParams = new URLSearchParams(window.location.search);

  const referer =
    (req.headers.get("referer") || "").split("?")[0] || "".replace(/\s+/g, " ").trim();
  const matchPath = `${origin}${toPath}`.replace(/\s+/g, " ").trim();
  console.log(`\nsearchPath\n${origin}${toPath}`);
  console.log("\nB_referer");
  console.log(referer);
  console.log("\npathname");
  console.log(pathname);
  const checkBool = matchPath == referer;
  console.log("checkBool : " + checkBool);

  // 直接コンタクトフォームへアクセスした場合はTOPへ誘導
  if (pathname == "/contact") {
    if (!referer) {
      console.error("error");
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    // サイト内遷移の場合
    // /auth を挟んでいなければ一旦リダイレクト
    if (checkBool) {
      //console.log(req.headers);
      console.log("Happy");
      console.log(referer);
    } else {
      const now = Date.now();
      url.pathname = toPath;
      url.search = `?to=${pathname}&now=${now}`;
      url.href = `${origin}${toPath}?to=${pathname}&now=${now}`;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
  // /auth から戻ってきた場合は正常遷移
  
  */
}
