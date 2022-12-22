import conn from "../config/conn";
import { Vacancies } from "@prisma/client";

class VacanciesModels {
  async get(): Promise<Vacancies[] | null> {
    return await new Promise((resolve, reject) => {
      conn.vacancies
        .findMany()
        .then((vacancies: Vacancies[] | null) => {
          if (vacancies === null || vacancies.length === 0) {
            resolve(null);
            return;
          }

          const vacancieList: Vacancies[] = [];
          vacancies.forEach((vacancie: Vacancies) => {
            const vdate = new Date(vacancie.created_at);
            const vexpires = new Date(
              vdate.getTime() + 24 * 60 * 60 * 1000 * 20
            );

            const today = new Date();

            if (today > vexpires) {
              return;
            }

            vacancieList.push(vacancie);
          });

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
