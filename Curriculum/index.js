"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../middleware/validator");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Curriculum_1 = __importDefault(require("./Curriculum"));
const Mailer_1 = __importDefault(require("../Mailer/Mailer"));
const router = (0, express_1.Router)();
router.get("/", (request, response) => {
    const field = request.query.field;
    const formation = request.query.formation;
    Curriculum_1.default.get(formation, field)
        .then((curriculuns) => {
        if ((curriculuns === null || curriculuns === void 0 ? void 0 : curriculuns.length) === 0 || curriculuns === null) {
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
        .catch((error) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde.",
        error,
    }));
});
router.get("/id/:id", (0, express_validator_1.param)("id").notEmpty().isNumeric(), validator_1.validator, (request, response) => {
    const id = parseInt(request.params.id);
    Curriculum_1.default.getById(id)
        .then((curriculum) => {
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
        .catch((error) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde.",
        error,
    }));
});
router.post("/login", (0, express_validator_1.body)("email").notEmpty(), (0, express_validator_1.body)("password").notEmpty(), validator_1.validator, (request, response) => {
    const email = request.body.email;
    const password = request.body.password;
    Curriculum_1.default.login(email, password)
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
        .catch((error) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde.",
        error,
    }));
});
router.post("/", (0, express_validator_1.body)("name").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("birthdate").isDate(), (0, express_validator_1.body)("cpf").isLength({ min: 14, max: 14 }), (0, express_validator_1.body)("tel").isLength({ min: 19, max: 19 }), (0, express_validator_1.body)("email").isLength({ min: 5, max: 255 }).isEmail(), (0, express_validator_1.body)("address").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("city").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("uf").isLength({ min: 2, max: 2 }), (0, express_validator_1.body)("fields").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("formation").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("conclusion").notEmpty(), (0, express_validator_1.body)("password").isLength({ min: 5, max: 30 }), validator_1.validator, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
(request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const curriculumValues = request.body;
    yield Curriculum_1.default.create(curriculumValues)
        .then((curriculum) => __awaiter(void 0, void 0, void 0, function* () {
        if (curriculum === null) {
            response.status(400).json({
                msg: "Usuário ja cadastrado, tente fazer login.",
            });
            return;
        }
        const mailOptions = Mailer_1.default.createMailOptions(curriculum.email, "Sucesso ao adicionar seu currículo ao sistema currícular do CRCGO", Curriculum_1.default.createMailCurriculumHTML(curriculum));
        const mail = yield Mailer_1.default.send(mailOptions);
        response.status(201).json({
            success: true,
            curriculum,
            mail,
        });
    }))
        .catch((error) => response.status(500).json(error));
}));
router.delete("/", (0, express_validator_1.query)("email").notEmpty().isEmail(), (0, express_validator_1.query)("password").notEmpty(), validator_1.validator, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
(request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const email = request.query.email;
    const password = request.query.password;
    yield Curriculum_1.default.login(email, password).then((curriculum) => __awaiter(void 0, void 0, void 0, function* () {
        if (curriculum === null) {
            response.status(400).json({
                msg: "As credenciáis estão inválidas.",
            });
            return;
        }
        yield Curriculum_1.default.delete(curriculum.id).then((curriculum) => {
            response.status(200).json({
                success: true,
                curriculum,
            });
        });
    }));
}));
router.patch("/", (0, express_validator_1.body)("name").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("birthdate").isDate(), (0, express_validator_1.body)("tel").isLength({ min: 19, max: 19 }), (0, express_validator_1.body)("address").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("city").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("uf").isLength({ min: 2, max: 2 }), (0, express_validator_1.body)("fields").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("formation").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("conclusion").notEmpty(), (0, express_validator_1.query)("email").notEmpty(), (0, express_validator_1.query)("password").notEmpty(), validator_1.validator, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
(request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const email = request.query.email;
    const password = request.query.password;
    const curriculumValues = request.body;
    yield Curriculum_1.default.update(curriculumValues, email, password)
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
        .catch((error) => response.status(500).json(error));
}));
exports.default = router;
