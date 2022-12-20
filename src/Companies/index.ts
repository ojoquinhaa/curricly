/* eslint-disable @typescript-eslint/no-misused-promises */
import { validator } from "@middleware/validator";
import { Companies } from "@prisma/client";
import { Router, Request, Response } from "express";
import { body, query } from "express-validator";
import CompaniesModels from "./Companies";

const router: Router = Router();

router.get("/", (request: Request, response: Response): void => {
  CompaniesModels.get()
    .then((companies: Array<{}> | null) => {
      if (companies?.length === 0) {
        response.status(200).json({
          message: "Nenhuma compania foi encontrado.",
        });
        return;
      }

      response.status(200).json({
        success: true,
        companies,
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

    CompaniesModels.login(email, password)
      .then((companie) => {
        if (companie === null) {
          response.status(400).json({
            msg: "As credenciáis estão inválidas.",
          });
          return;
        }

        response.status(200).json({
          success: true,
          companie,
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
  body("fantasy_name").isLength({ min: 5, max: 191 }),
  body("contact").isLength({ min: 5, max: 191 }),
  body("cnpj").isLength({ min: 18, max: 19 }),
  body("tel").isLength({ min: 15, max: 15 }),
  body("email").isLength({ min: 5, max: 255 }).isEmail(),
  body("address").isLength({ min: 5, max: 191 }),
  body("city").isLength({ min: 5, max: 191 }),
  body("uf").isLength({ min: 2, max: 2 }),
  body("password").isLength({ min: 5, max: 30 }),
  validator,
  async (request: Request, response: Response): Promise<void> => {
    const companieValues: Companies = request.body;
    await CompaniesModels.create(companieValues)
      .then((companie: Companies | null) => {
        if (companie === null) {
          response.status(400).json({
            msg: "Compania ja cadastrado, tente fazer login.",
          });
          return;
        }

        response.status(201).json({
          success: true,
          companie,
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
  async (request: Request, response: Response) => {
    const email: string = request.query.email as string;
    const password: string = request.query.password as string;

    await CompaniesModels.login(email, password).then(
      async (companie: Companies | null): Promise<void> => {
        if (companie === null) {
          response.status(400).json({
            msg: "As credenciáis estão inválidas.",
          });
          return;
        }

        await CompaniesModels.delete(companie.id).then(
          (companie: Companies | null): void => {
            response.status(200).json({
              msg: "Empresa deletado com sucesso",
              companie,
            });
          }
        );
      }
    );
  }
);

export default router;
