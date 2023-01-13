import { MailOptions, SentMessageInfo } from "nodemailer/lib/smtp-transport";
import Mailer from "../Mailer/Mailer";
import conn from "../config/conn";
import { Curriculum, Vacancies } from "@prisma/client";
import CurriculumModels from "../Curriculum/Curriculum";

class VacanciesModels {
  async get(companie: string, field: string): Promise<Vacancies[] | null> {
    return await new Promise((resolve, reject) => {
      conn.vacancies
        .findMany()
        .then((vacancies: Vacancies[] | null) => {
          if (vacancies === null || vacancies.length === 0) {
            resolve(null);
            return;
          }

          const vacancieList: Vacancies[] | null = [];
          vacancies.forEach((vacancie: Vacancies, i: number) => {
            const vdate = new Date(vacancie.created_at);
            const vexpires = new Date(
              vdate.getTime() + 24 * 60 * 60 * 1000 * 20
            );

            const today = new Date();

            if (today > vexpires) {
              return;
            }

            if (
              (field === undefined || field === "") &&
              (companie === undefined || companie === "")
            ) {
              vacancieList.push(vacancie);
              return;
            }

            if (field === undefined || field === "") {
              if (vacancie.companie !== parseInt(companie)) {
                return;
              }
            }

            if (companie === undefined || companie === "") {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (!String(vacancie.fields).match(field)) {
                return;
              }
            }

            if (
              field !== undefined &&
              companie !== undefined &&
              field !== "" &&
              companie !== ""
            ) {
              if (
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                !String(vacancie.fields).match(field) ||
                vacancie.companie !== parseInt(companie)
              ) {
                return;
              }
            }

            vacancieList.push(vacancie);
          });

          if (vacancieList === null || vacancieList.length === 0) {
            resolve(null);
            return;
          }

          resolve(vacancieList);
        })
        .catch((e) => reject(e));
    });
  }

  async getById(id: number): Promise<Vacancies | null> {
    return await conn.vacancies.findFirst({
      where: {
        id,
      },
    });
  }

  async getByCompanie(companie: number): Promise<Vacancies[] | null> {
    return await conn.vacancies.findMany({
      where: {
        companie,
      },
    });
  }

  async create(data: Vacancies): Promise<Vacancies | null> {
    return await conn.vacancies.create({
      data,
    });
  }

  async delete(id: number): Promise<Vacancies | never> {
    return await conn.vacancies.delete({
      where: {
        id,
      },
    });
  }

  async sendCurriculum(
    id: number,
    email: string,
    password: string
  ): Promise<SentMessageInfo | null> {
    return await new Promise((resolve, reject) => {
      conn.vacancies
        .findUnique({
          where: {
            id,
          },
        })
        .then(async (vacancie: Vacancies | null) => {
          if (vacancie === null) {
            resolve(null);
            return;
          }

          const curriculum: Curriculum | null = await CurriculumModels.login(
            email,
            password
          );

          if (curriculum === null) {
            resolve(null);
            return;
          }

          const companie = await conn.companies.findUnique({
            where: {
              id: vacancie.companie,
            },
          });

          if (companie === null) {
            resolve(null);
            return;
          }

          const mailOptions: MailOptions = Mailer.createMailOptions(
            companie.email,
            "Você recebeu um currículo para concorrer a uma das suas vagas!",
            this.createVacancieEmailHTML(vacancie, curriculum)
          );

          const mail: SentMessageInfo = await Mailer.send(mailOptions);

          resolve(mail);
        })
        .catch((e) => reject(e));
    });
  }

  formatDate(date: Date): string {
    return `${((): string => {
      if (date.getDay() > 9) {
        return String(date.getDay());
      } else {
        return `0${date.getDay()}`;
      }
    })()}/${((): string => {
      if (date.getMonth() > 9) {
        return String(date.getMonth());
      } else {
        return `0${date.getMonth()}`;
      }
    })()}/${String(date.getFullYear())}
    `;
  }

  createVacancieEmailHTML(vacancie: Vacancies, curriculum: Curriculum): string {
    const birthdate: string = this.formatDate(curriculum.birthdate);

    const conclusion: string = `${((): string => {
      if (curriculum.conclusion.getMonth() > 9) {
        return String(curriculum.conclusion.getMonth());
      } else {
        return `0${curriculum.conclusion.getMonth()}`;
      }
    })()}/${String(curriculum.conclusion.getFullYear())}
    `;

    return `
    <div align="center">
    <img
      alt="CRCGO logo"
      src="https://crcgo.org.br/novo/wp-content/themes/crc/images/logo.png"
    />
    <div style="text-align: center; margin-top: 10px">
      <h4>
        Uma currículo foi enviado para concorrer a seguinte vaga da sua
        empresa:
      </h4>
      <div
        style="
          width: 450px;
          border: 1px blue solid;
          padding: 25px;
          margin: auto;
        "
      >
        <ul style="list-style: none; width: auto; margin: 0">
          <li>Título: <strong>${vacancie.title}</strong></li>
          <li>Descrição: <strong>${vacancie.description}</strong></li>
          <li>Requerimentos: <strong>${vacancie.requirements}</strong></li>
          <li>Áreas: <strong>${vacancie.fields}</strong></li>
          <li>Salário: <strong>${vacancie.salary}</strong></li>
        </ul>
      </div>
      <hr />
      <div style="width: 500px; margin: auto">
        <h5 style="text-align: left; margin-left: 23px">
          <strong>Currículo: </strong>
        </h5>
        <div
          style="
            width: 90%;
            border: 1px blue solid;
            padding: 5%;
            margin: auto;
          "
        >
          <ul style="list-style: none; width: auto; margin: 0">
            <li>Nome: <strong>${curriculum.name}</strong></li>
            <li>Data de nascimento: <strong>${birthdate}</strong></li>
            <li>Telefone: <strong>${curriculum.tel}</strong></li>
            <li>E-mail: <strong>${curriculum.email}</strong></li>
            <li>Endereço completo: <strong>${curriculum.address}</strong></li>
            <li>Cidade/UF: <strong>${curriculum.city}/${curriculum.uf}</strong></li>
            <li>Aréas: <strong>${curriculum.fields}</strong></li>
            <li>Formação: <strong>${curriculum.formation}</strong></li>
            <li>Data de conclusão: <strong>${conclusion}</strong></li>
            <li>Informações gerais: <strong>${curriculum.general_info}</strong></li>
            <li>Referencias pessoais: <strong>${curriculum.personal_references}</strong></li>
          </ul>
        </div>
      </div>
      <hr />
      <small style="color: gray"
        >Entre em contato com o dono do currículo pelo seu telefone ou
        e-mail.</small
      >
    </div>
  </div>
    `;
  }

  async update(data: Vacancies, id: number): Promise<Vacancies | null> {
    return await conn.vacancies.update({
      data,
      where: {
        id,
      },
    });
  }
}

export default new VacanciesModels();
