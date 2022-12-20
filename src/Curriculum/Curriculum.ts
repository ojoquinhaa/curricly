import conn from "@config/conn";
import { Curriculum } from "@prisma/client";
import bcrypt from "bcrypt";

class CurriculumModels {
  async get(): Promise<Array<{}> | null> {
    return await conn.curriculum.findMany({
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

  async update(data: Curriculum, id: number): Promise<Curriculum | null> {
    return await conn.curriculum.update({
      data,
      where: {
        id,
      },
    });
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
