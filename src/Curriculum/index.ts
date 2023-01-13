import { MailOptions } from "nodemailer/lib/smtp-transport";
import { validator } from "../middleware/validator";
import { Curriculum } from "@prisma/client";
import { Router, Request, Response } from "express";
import { body, param, query } from "express-validator";
import CurriculumModels from "./Curriculum";
import Mailer from "../Mailer/Mailer";

const router: Router = Router();

router.get("/", (request: Request, response: Response): void => {
  const field = request.query.field as string;
  const formation = request.query.formation as string;

  CurriculumModels.get(formation, field)
    .then((curriculuns: Array<{}> | null) => {
      if (curriculuns?.length === 0 || curriculuns === null) {
        response.status(400).json({
          msg: "Nenhum curriculo foi encontrado.",
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

router.get(
  "/id/:id",
  param("id").notEmpty().isNumeric(),
  validator,
  (request: Request, response: Response): void => {
    const id: number = parseInt(request.params.id);

    CurriculumModels.getById(id)
      .then((curriculum: {} | null) => {
        if (curriculum === null) {
          response.status(400).json({
            msg: "Nenhum curriculo foi encontrado.",
            id,
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
  "/login",
  body("email").notEmpty(),
  body("password").notEmpty(),
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
  body("tel").isLength({ min: 19, max: 19 }),
  body("email").isLength({ min: 5, max: 255 }).isEmail(),
  body("address").isLength({ min: 5, max: 191 }),
  body("city").isLength({ min: 5, max: 191 }),
  body("uf").isLength({ min: 2, max: 2 }),
  body("fields").isLength({ min: 5, max: 191 }),
  body("formation").isLength({ min: 5, max: 191 }),
  body("conclusion").notEmpty(),
  body("password").isLength({ min: 5, max: 30 }),
  validator,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (request: Request, response: Response): Promise<void> => {
    const curriculumValues: Curriculum = request.body;
    await CurriculumModels.create(curriculumValues)
      .then(async (curriculum: Curriculum | null) => {
        if (curriculum === null) {
          response.status(400).json({
            msg: "Usuário ja cadastrado, tente fazer login.",
          });
          return;
        }

        const mailOptions: MailOptions = Mailer.createMailOptions(
          curriculum.email,
          "Sucesso ao adicionar seu currículo ao sistema currícular do CRCGO",
          CurriculumModels.createMailCurriculumHTML(curriculum)
        );

        const mail = await Mailer.send(mailOptions);

        response.status(201).json({
          success: true,
          curriculum,
          mail,
        });
      })
      .catch((error) => response.status(500).json(error));
  }
);

router.delete(
  "/",
  query("email").notEmpty().isEmail(),
  query("password").notEmpty(),
  validator,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
              success: true,
              curriculum,
            });
          }
        );
      }
    );
  }
);

router.patch(
  "/",
  body("name").isLength({ min: 5, max: 191 }),
  body("birthdate").isDate(),
  body("tel").isLength({ min: 19, max: 19 }),
  body("address").isLength({ min: 5, max: 191 }),
  body("city").isLength({ min: 5, max: 191 }),
  body("uf").isLength({ min: 2, max: 2 }),
  body("fields").isLength({ min: 5, max: 191 }),
  body("formation").isLength({ min: 5, max: 191 }),
  body("conclusion").notEmpty(),
  query("email").notEmpty(),
  query("password").notEmpty(),
  validator,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (request: Request, response: Response): Promise<void> => {
    const email: string = request.query.email as string;
    const password: string = request.query.password as string;
    const curriculumValues: Curriculum = request.body;
    await CurriculumModels.update(curriculumValues, email, password)
      .then((curriculum: Curriculum | null) => {
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
      .catch((error) => response.status(500).json(error));
  }
);

export default router;
