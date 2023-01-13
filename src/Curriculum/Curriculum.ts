import conn from "../config/conn";
import { Curriculum } from "@prisma/client";
import bcrypt from "bcrypt";

class CurriculumModels {
  async get(formation: string, field: string): Promise<Array<{}> | null> {
    return await new Promise((resolve, reject) => {
      conn.curriculum
        .findMany()
        .then((curriculuns: Curriculum[] | null) => {
          if (curriculuns === null || curriculuns.length === 0) {
            resolve(null);
            return;
          }

          const curriculumList: Array<Partial<Curriculum>> | null = [];
          curriculuns.forEach((curriculum: Partial<Curriculum>) => {
            if (
              (formation === undefined || formation === "") &&
              (field === undefined || field === "")
            ) {
              delete curriculum.password;
              curriculumList.push(curriculum);
              return;
            }

            if (field === undefined || field === "") {
              if (curriculum.formation !== formation) {
                return;
              }
            }

            if (formation === undefined || formation === "") {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (!String(curriculum.fields).match(field)) {
                return;
              }
            }

            if (
              field !== undefined &&
              formation !== undefined &&
              field !== "" &&
              formation !== ""
            ) {
              if (
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                !String(curriculum.fields).match(field) ||
                curriculum.formation !== formation
              ) {
                return;
              }
            }

            delete curriculum.password;
            curriculumList.push(curriculum);
          });

          if (curriculumList === null || curriculumList.length === 0) {
            resolve(null);
            return;
          }

          resolve(curriculumList);
        })
        .catch((e) => reject(e));
    });
  }

  async getById(id: number): Promise<{} | null> {
    return await conn.curriculum.findUnique({
      where: {
        id,
      },
      select: {
        password: false,
        id: true,
        name: true,
        birthdate: true,
        cpf: true,
        tel: true,
        email: true,
        address: true,
        city: true,
        uf: true,
        fields: true,
        formation: true,
        conclusion: true,
        general_info: true,
        personal_references: true,
        created_at: true,
      },
    });
  }

  async create(data: Curriculum): Promise<Curriculum | null> {
    return await new Promise((resolve, reject) => {
      this.alreadySingup(data)
        .then((isSingup) => {
          if (isSingup) {
            resolve(null);
            return;
          }

          this.encrypt(data.password)
            .then(async (password) => {
              const birthdate = new Date(data.birthdate);
              const conclusion = new Date(data.conclusion);

              data.birthdate = birthdate;
              data.conclusion = conclusion;
              data.password = password;
              const result = await conn.curriculum.create({
                data,
              });
              resolve(result);
            })
            .catch((e) => reject(e));
        })
        .catch((e) => reject(e));
    });
  }

  async alreadySingup(data: Curriculum): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      conn.curriculum
        .findFirst({
          where: {
            OR: [{ email: data.email }, { cpf: data.cpf }, { tel: data.tel }],
          },
        })
        .then((isSingup: Curriculum | null): void => {
          if (isSingup === null) {
            resolve(false);
            return;
          }

          resolve(true);
        })
        .catch((e) => reject(e));
    });
  }

  async login(email: string, password: string): Promise<Curriculum | null> {
    return await new Promise((resolve, reject) => {
      conn.curriculum
        .findFirst({
          where: {
            email,
          },
        })
        .then(async (curriculum) => {
          if (curriculum === null) {
            resolve(null);
            return;
          }

          await bcrypt
            .compare(password, curriculum.password)
            .then((logged) => {
              if (logged) {
                resolve(curriculum);
                return;
              }

              resolve(null);
            })
            .catch((e) => reject(e));
        })
        .catch((e) => reject(e));
    });
  }

  async delete(id: number): Promise<Curriculum | never> {
    return await conn.curriculum.delete({
      where: {
        id,
      },
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

  async update(
    data: Curriculum,
    email: string,
    password: string
  ): Promise<Curriculum | null> {
    return await new Promise((resolve, reject) => {
      this.login(email, password)
        .then(async (login: Curriculum | null) => {
          if (login === null) {
            resolve(null);
            return;
          }

          const birthdate = new Date(data.birthdate);
          const conclusion = new Date(data.conclusion);

          data.birthdate = birthdate;
          data.conclusion = conclusion;

          const result: Curriculum | null = await conn.curriculum.update({
            data,
            where: {
              id: login.id,
            },
          });

          resolve(result);
        })
        .catch((e) => reject(e));
    });
  }

  createMailCurriculumHTML(curriculum: Curriculum): string {
    const birthdate: string = this.formatDate(curriculum.birthdate);

    return `
    <div align="center">
      <img
        alt="CRCGO logo"
        src="https://crcgo.org.br/novo/wp-content/themes/crc/images/logo.png"
      />
      <div style="text-align: center; margin-top: 10px">
        <h4>
          Bem vindo ao sistema currícular do CRCGO, segue abaixo as informações
          do seu currículo:
        </h4>
        <ul style="list-style: none; margin-top: 10px">
          <li>Nome: <strong>${curriculum.name}</strong></li>
          <li>Email: <strong>${curriculum.email}</strong></li>
          <li>Cidade/Estado: <strong>${curriculum.city}/${curriculum.uf}</strong></li>
          <li>CPF: <strong>${curriculum.cpf}</strong></li>
          <li>Data de nascimento: <strong>${birthdate}</strong></li>
          <li>Referencias pessoais: <strong>${curriculum.personal_references}</strong></li>
          <li>Informações gerais: <strong>${curriculum.general_info}</strong></li>
        </ul>
        <hr />
        <small style="color: gray"
          >Faça login com sua senha de acesso para poder alterar essas
          informações.</small
        >
      </div>
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

export default new CurriculumModels();
