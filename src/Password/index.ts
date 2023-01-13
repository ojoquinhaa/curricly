import { validator } from "../middleware/validator";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import PasswordModels from "./Password";
import { Companies, Curriculum } from "@prisma/client";

const router: Router = Router();

router.post(
  "/",
  PasswordModels.checkRequests,
  body("email").isEmail().notEmpty().isLength({ min: 5, max: 255 }),
  body("type")
    .notEmpty()
    .custom((value: string) => {
      if (value !== "curriculum" && value !== "companie") {
        return false;
      }

      return true;
    }),
  validator,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (request: Request, response: Response): Promise<void> => {
    const email: string = request.body.email as string;
    const type: string = request.body.type as string;

    const passwordRequest = await PasswordModels.createPasswordRequest(
      email,
      type
    );

    if (passwordRequest === null) {
      response.status(400).json({
        msg: "Endereço de email não encontrado.",
      });
      return;
    }

    response.status(200).json({
      success: true,
      request: passwordRequest[0],
      email: passwordRequest[1],
    });
  }
);

router.post(
  "/:request",
  PasswordModels.checkRequests,
  body("password").isLength({ min: 5, max: 30 }),
  validator,
  (request: Request, response: Response): void => {
    const req: string = request.params.request;
    const password: string = request.body.password;

    PasswordModels.changePassword(req, password)
      .then((values: null | Companies | Curriculum) => {
        if (values === null) {
          response.status(400).json({
            msg: "O token não existe ou se expirou. Tente novamente com outro token",
          });
          return;
        }

        response.status(200).json({
          success: true,
          values,
        });
      })
      .catch((e) => response.status(500).json(e));
  }
);

export default router;
