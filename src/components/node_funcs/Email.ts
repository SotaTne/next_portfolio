import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

async function sendMain(
  mailContents: {
    from: string | undefined;
    to: string | undefined;
    subject: string;
    text: string;
  },
  transport: Transporter<SMTPTransport.SentMessageInfo>,
) {
  try {
    const info = await transport.sendMail(mailContents);
    return info.messageId;
  } catch (error) {
    () => {};
    throw error;
  }
}
export async function SendEMail(props: { fromMail: string; name: string; contents: string }) {
  const contents = props.contents;
  const fromMail = props.fromMail;
  const name = props.name;
  const mail = process.env.SEND_GMAIL_ADDRESS;
  const pass = process.env.APP_PASS;
  const receive_mail = process.env.RECEIVE_ADDRESS;

  const transport = createTransport({
    service: "Gmail",
    auth: {
      user: mail,
      pass: pass,
    },
  });
  const mailContents = {
    from: mail,
    to: receive_mail,
    subject: `NextPortfolioでの『${name}』様から連絡です`,
    text: `
    from : ${fromMail}
    name : ${name}

    『${name}』様から『${fromMail}』というアドレスで以下の内容の連絡を頂きました

    <本文>

    ${contents}`,
  };
  await sendMain(mailContents, transport);
}
