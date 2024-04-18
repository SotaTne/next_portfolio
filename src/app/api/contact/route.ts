import { escapeHTML } from "@/components/funcs/Translator";
//import { SendEMail } from "@/components/node_funcs/Email";

type ResData = { name: string; email: string; contents: string };

export async function POST(req: Request) {
  console.log("you " + req.headers.get("referer"));
  const data: ResData = (await req.json()) as ResData;
  const name: string = escapeHTML(data.name || "");
  const email: string = escapeHTML(data.email || "").replace(/\s+/g, "");
  const contents: string = escapeHTML(data.contents || "");

  console.log(name);
  console.log(email);
  console.log(contents);

  const allMatch: boolean =
    typeof name === "string" && typeof email === "string" && typeof contents === "string"
      ? !!email.match(/.+@.+\..+/) &&
        name !== "" &&
        !!name.match(/\S/g) &&
        contents !== "" &&
        !!contents.match(/\S/g)
      : false;
  console.log("");
  console.log(allMatch);
  console.log("");

  if (allMatch) {
    /*
    await SendEMail({
      name: name,
      fromMail: email,
      contents: contents,
    });
*/
    console.log(allMatch);
    return Response.json({ success: true });
  } else {
    return Response.json({ success: false });
  }
}
