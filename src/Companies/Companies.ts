import conn from "@config/conn";
import { Companies } from "@prisma/client";
import bcrypt from "bcrypt";

class CompaniesModels {
  async get(): Promise<Array<{}> | null> {
    return await conn.companies.findMany({
      select: {
        address: true,
        city: true,
        cnpj: false,
        contact: true,
        created_at: true,
        email: true,
        fantasy_name: true,
        id: true,
        password: false,
        tel: true,
        uf: true,
      },
    });
  }

  async create(data: Companies): Promise<Companies | null> {
    return await new Promise((resolve, reject) => {
      this.alreadySingup(data)
        .then((isSingup) => {
          if (isSingup) {
            resolve(null);
            return;
          }

          this.encrypt(data.password)
            .then(async (password) => {
              data.password = password;
              resolve(
                await conn.companies.create({
                  data,
                })
              );
            })
            .catch((e) => reject(e));
        })
        .catch((e) => reject(e));
    });
  }

  async alreadySingup(data: Companies): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      conn.companies
        .findFirst({
          where: {
            OR: [{ email: data.email }, { cnpj: data.cnpj }, { tel: data.tel }],
          },
        })
        .then((isSingup: Companies | null): void => {
          if (isSingup === null) {
            resolve(false);
            return;
          }

          resolve(true);
        })
        .catch((e) => reject(e));
    });
  }

  async login(email: string, password: string): Promise<Companies | null> {
    return await new Promise((resolve, reject) => {
      conn.companies
        .findFirst({
          where: {
            email,
          },
        })
        .then(async (companies) => {
          if (companies === null) {
            resolve(null);
            return;
          }

          await bcrypt
            .compare(password, companies.password)
            .then((logged) => {
              if (logged) {
                resolve(companies);
                return;
              }

              resolve(null);
            })
            .catch((e) => reject(e));
        })
        .catch((e) => reject(e));
    });
  }

  async delete(id: number): Promise<Companies | never> {
    return await conn.companies.delete({
      where: {
        id,
      },
    });
  }

  async update(data: Companies, id: number): Promise<Companies | null> {
    return await conn.companies.update({
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

export default new CompaniesModels();
