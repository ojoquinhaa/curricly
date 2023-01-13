import { createTransport, Transporter } from "nodemailer";
import { config } from "dotenv";
import { SentMessageInfo, MailOptions } from "nodemailer/lib/smtp-transport";

config();

const user: string = process.env.MAILER_USER ?? "email@email.com";
const pass: string = process.env.MAILER_PASSWORD ?? "123123";
const copyEmail: string = process.env.MAILER_COPY ?? "copy@copy.com";

class Mailer {
  private readonly user: string;
  private readonly password: string;
  private readonly transport: Transporter;

  constructor(user: string, password: string) {
    this.user = user;
    this.password = password;

    this.transport = createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      auth: {
        user: this.user,
        pass: this.password,
      },
    });
  }

  async send(mailOptions: MailOptions): Promise<SentMessageInfo> {
    mailOptions.from = "CRCGO";

    const copyOptions: MailOptions = { ...mailOptions };
    copyOptions.to = copyEmail;

    await this.transport.sendMail(copyOptions);
    return await this.transport.sendMail(mailOptions);
  }

  createMailOptions(to: string, subject: string, html: string): MailOptions {
    return {
      to,
      subject,
      html,
    };
  }
}

export default new Mailer(user, pass);
