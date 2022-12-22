/* eslint-disable @typescript-eslint/no-misused-promises */
import { validator } from "../middleware/validator";
import { Curriculum } from "@prisma/client";
import { Router, Request, Response } from "express";
import { body, query } from "express-validator";
import CurriculumModels from "./Curriculum";

const router: Router = Router();

router.get("/", (request: Request, response: Response): void => {
  CurriculumModels.get()
    .then((curriculuns: Array<{}> | null) => {
      if (curriculuns?.length === 0) {
        response.status(200).json({
          message: "Nenhum curriculo foi encontrado.",
        });
        return;
      }

      response.status(200).json({
        success: true,
        curriculuns,
      });
    })
    .catch((error) =>
      response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde.",
        error,
      })
    );
});

router.post(
  "/login",
  body("email").isLength({ min: 5, max: 255 }),
  body("password").isLength({ min: 5, max: 30 }),
  validator,
  (request: Request, response: Response): void => {
    const email: string = request.body.email;
    const password: string = request.body.password;

    CurriculumModels.login(email, password)
      .then((curriculum) => {
        if (curriculum === null) {
          response.status(400).json({
            msg: "As credenciáis estão inválidas.",
          });
          return;
        }

        response.status(200).json({
          success: true,
          curriculum,
        });
      })
      .catch((error) =>
        response.status(500).json({
          msg: "Erro no servidor, tente novamente mais tarde.",
          error,
        })
      );
  }
);

router.post(
  "/",
  body("name").isLength({ min: 5, max: 191 }),
  body("birthdate").isDate(),
  body("cpf").isLength({ min: 14, max: 14 }),
  body("tel").isLength({ min: 15, max: 15 }),
  body("email").isLength({ min: 5, max: 255 }).isEmail(),
  body("address").isLength({ min: 5, max: 191 }),
  body("city").isLength({ min: 5, max: 191 }),
  body("uf").isLength({ min: 2, max: 2 }),
  body("fields").isLength({ min: 5, max: 191 }),
  body("formation").isLength({ min: 5, max: 191 }),
  body("conclusion").isDate(),
  body("personal_references").notEmpty(),
  body("general_info").notEmpty(),
  body("password").isLength({ min: 5, max: 30 }),
  validator,
  async (request: Request, response: Response): Promise<void> => {
    const curriculumValues: Curriculum = request.body;
    await CurriculumModels.create(curriculumValues)
      .then((curriculum: Curriculum | null) => {
        if (curriculum === null) {
          response.status(400).json({
            msg: "Usuário ja cadastrado, tente fazer login.",
          });
        }

        response.status(201).json({
          success: true,
          curriculum,
        });
      })
      .catch((error) => {
        response.status(500).json({
          msg: "Erro no servidor, tente novamente mais tarde.",
          error,
        });
      });
  }
);

router.delete(
  "/",
  query("email").notEmpty().isEmail(),
  query("password").notEmpty(),
  validator,
  async (request: Request, response: Response) => {
    const email: string = request.query.email as string;
    const password: string = request.query.password as string;

    await CurriculumModels.login(email, password).then(
      async (curriculum: Curriculum | null): Promise<void> => {
        if (curriculum === null) {
          response.status(400).json({
            msg: "As credenciáis estão inválidas.",
          });
          return;
        }

        await CurriculumModels.delete(curriculum.id).then(
          (curriculum: Curriculum | null): void => {
            response.status(200).json({
              msg: "Curriculo deletado com sucesso",
              curriculum,
            });
          }
        );
      }
    );
  }
);

export default router;
