import { Companies, Vacancies } from "@prisma/client";
import { validator } from "../middleware/validator";
import { Router, Request, Response } from "express";
import { body, param, query } from "express-validator";
import VacanciesModels from "./Vacancie";
import CompaniesModels from "../Companies/Companies";

const router: Router = Router();

router.get("/", (request: Request, response: Response) => {
  VacanciesModels.get()
    .then((vacancies: Vacancies[] | null) => {
      if (vacancies === null || vacancies.length === 0) {
        response.status(400).json({
          msg: "Não foi encontrado nenhuma vaga",
        });
        return;
      }

      response.status(200).json({
        success: true,
        vacancies,
      });
    })
    .catch((e) =>
      response.status(500).json({
        msg: "Erro no servidor tente novamente mais tarde",
        e,
      })
    );
});

router.post(
  "/",
  body("title").isLength({ min: 5, max: 191 }),
  body("description").notEmpty(),
  body("fields").isLength({ min: 5, max: 191 }),
  body("tel").isLength({ min: 15, max: 15 }),
  body("contact").isLength({ min: 5, max: 255 }).isEmail(),
  body("requirements").isLength({ min: 5, max: 191 }),
  body("city").isLength({ min: 5, max: 191 }),
  body("uf").isLength({ min: 2, max: 2 }),
  body("salary").isNumeric().notEmpty(),
  validator,
  (request: Request, response: Response): void => {
    const email: string = request.query.email as string;
    const password: string = request.query.password as string;

    CompaniesModels.login(email, password)
      .then((companie) => {
        if (companie === null) {
          response.status(400).json({
            msg: "As credenciáis estão inválidas.",
          });
          return;
        }

        const vacancieValues: Vacancies = request.body;
        vacancieValues.companie = companie.id;

        VacanciesModels.create(vacancieValues)
          .then((vacancie: Vacancies | null) => {
            if (vacancie === null) {
              response.status(400).json({
                msg: "Compania ja cadastrado, tente fazer login.",
              });
            }

            response.status(201).json({
              success: true,
              vacancie,
            });
          })
          .catch((error) =>
            response.status(500).json({
              msg: "Erro no servidor, tente novamente mais tarde.",
              error,
            })
          );
      })
      .catch((e) =>
        response.status(500).json({
          msg: "Erro no servidor. Por favor tente novamente mais tarde",
          e,
        })
      );
  }
);

router.delete(
  "/:id",
  query("email").notEmpty().isEmail(),
  query("password").notEmpty(),
  param("id").isNumeric().notEmpty(),
  validator,
  (request: Request, response: Response) => {
    const email: string = request.query.email as string;
    const password: string = request.query.password as string;
    const id: number = parseInt(request.params.id);

    CompaniesModels.login(email, password)
      .then(async (companie: Companies | null): Promise<void> => {
        if (companie === null) {
          response.status(400).json({
            msg: "As credenciáis estão inválidas.",
          });
          return;
        }

        await VacanciesModels.getById(id).then(
          async (vacancie: Vacancies | null) => {
            if (vacancie === null) {
              response.status(400).json({
                msg: "Vaga não encontrada.",
              });
              return;
            }

            if (vacancie.companie === companie.id) {
              await VacanciesModels.delete(id)
                .then(() => {
                  response.status(200).json({
                    success: true,
                    vacancie,
                  });
                })
                .catch((e) => {
                  response.status(500).json({
                    msg: "Erro no servidor. Por favor tente novamente mais tarde.",
                  });
                });
              return;
            }

            response.status(400).json({
              msg: "A vaga não é da compania logada",
            });
          }
        );
      })
      .catch((e) => {
        response.status(500).json({
          msg: "Erro no servidor. Por favor tente novamente mais tarde.",
        });
      });
  }
);

export default router;
