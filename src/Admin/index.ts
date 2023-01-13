import { validator } from "../middleware/validator";
import { Router, Response, Request } from "express";
import { query, param, body } from "express-validator";
import AdminModels from "./Admin";
import CurriculumModels from "../Curriculum/Curriculum";
import { Curriculum, Companies, Vacancies, Admin } from "@prisma/client";
import CompaniesModels from "../Companies/Companies";
import VacanciesModels from "../Vacancies/Vacancie";

const router: Router = Router();

router.post(
  "/",
  body("user").notEmpty(),
  body("password").notEmpty(),
  validator,
  (request: Request, response: Response) => {
    const user: string = request.body.user as string;
    const password: string = request.body.password as string;

    AdminModels.login(user, password)
      .then((login: Admin | null) => {
        if (login === null) {
          response.status(400).json({
            msg: "As Credenciáis estão inválidas.",
          });
          return;
        }

        response.status(200).json({
          success: true,
        });
      })
      .catch((e) =>
        response.status(500).json({
          msg: "Erro no servidor, tente novamente mais tarde",
          e,
        })
      );
  }
);

router.delete(
  "/curriculum/:id",
  param("id").isNumeric(),
  query("user").notEmpty(),
  query("password").notEmpty(),
  validator,
  (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id);
    const user: string = request.query.user as string;
    const password: string = request.query.password as string;

    AdminModels.login(user, password)
      .then((login) => {
        if (login === null) {
          response.status(400).json({
            msg: "As Credenciáis estão inválidas.",
          });
          return;
        }

        CurriculumModels.delete(id)
          .then((curriculum: Curriculum | null) => {
            if (curriculum === null) {
              response.status(400).json({
                msg: "Falha ao deletar o curriculo, provavelmente o id está errado.",
              });
              return;
            }

            response.status(200).json({
              msg: "O curriculo foi deletado com sucesso!",
            });
          })
          .catch((e) =>
            response.status(500).json({
              msg: "Erro no servidor, tente novamente mais tarde",
              e,
            })
          );
      })
      .catch((e) =>
        response.status(500).json({
          msg: "Erro no servidor, tente novamente mais tarde",
          e,
        })
      );
  }
);

router.delete(
  "/companie/:id",
  param("id").isNumeric(),
  query("user").notEmpty(),
  query("password").notEmpty(),
  validator,
  (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id);
    const user: string = request.query.user as string;
    const password: string = request.query.password as string;

    AdminModels.login(user, password)
      .then((login) => {
        if (login === null) {
          response.status(400).json({
            msg: "As Credenciáis estão inválidas.",
          });
          return;
        }

        CompaniesModels.delete(id)
          .then((companie: Companies | null) => {
            if (companie === null) {
              response.status(400).json({
                msg: "Falha ao deletar a empresa, provavelmente o id está errado.",
              });
              return;
            }

            response.status(200).json({
              msg: "A empresa foi deletado com sucesso!",
            });
          })
          .catch((e) =>
            response.status(500).json({
              msg: "Erro no servidor, tente novamente mais tarde",
              e,
            })
          );
      })
      .catch((e) =>
        response.status(500).json({
          msg: "Erro no servidor, tente novamente mais tarde",
          e,
        })
      );
  }
);

router.delete(
  "/vacancie/:id",
  param("id").isNumeric(),
  query("user").notEmpty(),
  query("password").notEmpty(),
  validator,
  (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id);
    const user: string = request.query.user as string;
    const password: string = request.query.password as string;

    AdminModels.login(user, password)
      .then((login) => {
        if (login === null) {
          response.status(400).json({
            msg: "As Credenciáis estão inválidas.",
          });
          return;
        }

        VacanciesModels.delete(id)
          .then((vacancie: Vacancies | null) => {
            if (vacancie === null) {
              response.status(400).json({
                msg: "Falha ao deletar a vaga, provavelmente o id está errado.",
              });
              return;
            }

            response.status(200).json({
              msg: "A vaga foi deletada com sucesso!",
            });
          })
          .catch((e) =>
            response.status(500).json({
              msg: "Erro no servidor, tente novamente mais tarde",
              e,
            })
          );
      })
      .catch((e) =>
        response.status(500).json({
          msg: "Erro no servidor, tente novamente mais tarde",
          e,
        })
      );
  }
);

export default router;
