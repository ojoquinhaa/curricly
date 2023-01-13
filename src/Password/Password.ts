/* eslint-disable @typescript-eslint/no-misused-promises */
import { Companies, Curriculum, RequestPassword } from "@prisma/client";
import conn from "../config/conn";
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";
import bcrypt from "bcrypt";
import Mailer from "../Mailer/Mailer";

class Password {
  async createPasswordRequest(
    email: string,
    type: string
  ): Promise<Array<RequestPassword | null | SentMessageInfo> | null> {
    return await new Promise((resolve, reject) => {
      if (type === "companie") {
        conn.companies
          .findFirst({
            where: {
              email,
            },
          })
          .then(async (companie: Companies | null): Promise<void> => {
            if (companie === null) {
              resolve(null);
              return;
            }

            const uuid = randomUUID();
            const html = this.createRequestPasswordHTML(uuid);

            const mailOptions = Mailer.createMailOptions(
              email,
              "Esqueceu a sua senha?",
              html
            );

            Mailer.send(mailOptions)
              .then(async (mailer) => {
                const query = await conn.requestPassword.create({
                  data: {
                    request: uuid,
                    id: companie.id,
                    type,
                  },
                });

                resolve([query, mailer]);
              })
              .catch((e) => reject(e));
          })
          .catch((e) => reject(e));
      } else if (type === "curriculum") {
        conn.curriculum
          .findFirst({
            where: {
              email,
            },
          })
          .then(async (curriculum: Curriculum | null): Promise<void> => {
            if (curriculum === null) {
              resolve(null);
              return;
            }

            const uuid = randomUUID();
            const html = this.createRequestPasswordHTML(uuid);

            const mailOptions = Mailer.createMailOptions(
              email,
              "Esqueceu sua senha?",
              html
            );

            Mailer.send(mailOptions)
              .then(async (mailer) => {
                const query = await conn.requestPassword.create({
                  data: {
                    request: uuid,
                    id: curriculum.id,
                    type,
                  },
                });

                resolve([query, mailer]);
              })
              .catch((e) => reject(e));
          })
          .catch((e) => reject(e));
      }
    });
  }

  checkRequests(req: Request, res: Response, next: NextFunction): void {
    conn.requestPassword
      .findMany()
      .then((requests: RequestPassword[] | null): void => {
        if (requests === null) {
          next();
          return;
        }

        requests.forEach(async (request: RequestPassword): Promise<void> => {
          const today: Date = new Date();

          const requestDate = new Date(request.create_at);
          const expiresRequestDate = new Date(
            requestDate.getTime() + 24 * 60 * 60 * 1000 * 20
          );

          if (today > expiresRequestDate) {
            await conn.requestPassword.delete({
              where: {
                request: request.request,
              },
            });
          }
        });

        next();
      })
      .catch((e) => next(e));
  }

  async changePassword(
    request: string,
    newPassword: string
  ): Promise<Companies | Curriculum | null> {
    const req = await conn.requestPassword.findFirst({
      where: {
        request,
      },
    });

    if (req === null) {
      return null;
    }

    const password = await this.encrypt(newPassword);

    if (req.type === "companie") {
      const companie = await conn.companies.update({
        where: {
          id: req.id,
        },
        data: {
          password,
        },
      });

      await conn.requestPassword.delete({
        where: {
          request,
        },
      });

      return companie;
    }

    if (req.type === "curriculum") {
      const curriculum = await conn.curriculum.update({
        where: {
          id: req.id,
        },
        data: {
          password,
        },
      });

      await conn.requestPassword.delete({
        where: {
          request,
        },
      });

      return curriculum;
    }

    return null;
  }

  createRequestPasswordHTML(request: string): string {
    return `<div style="text-align: center">
  <div style="text-align: center">
    <img
      class="img-fluid col-md-12 rounded"
      alt="CRCGO logo"
      src="https://crcgo.org.br/novo/wp-content/themes/crc/images/logo.png"
    />
  </div>
  <h1>Esqueci minha senha</h1>
  <p>Aqui está o seu codigo de requisição: <strong>${request}</strong></p>
</div>
    `;
  }

  async encrypt(password: string, rounds: number = 10): Promise<string> {
    return await new Promise((resolve, reject) => {
      bcrypt
        .genSalt(rounds)
        .then((salt) => {
          bcrypt
            .hash(password, salt)
            .then((epassword) => {
              resolve(epassword);
            })
            .catch((e) => reject(e));
        })
        .catch((e) => reject(e));
    });
  }
}

export default new Password();
