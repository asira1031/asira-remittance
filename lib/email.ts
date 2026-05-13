import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams) {
  try {
    const data = await resend.emails.send({
      from:
        "Asira Global Remit <onboarding@resend.dev>",

      to,

      subject,

      html,
    });

    console.log(
      "Email sent:",
      data
    );

    return data;
  } catch (error) {
    console.log(
      "Email error:",
      error
    );

    return null;
  }
}