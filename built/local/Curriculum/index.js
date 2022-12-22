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
/* eslint-disable @typescript-eslint/no-misused-promises */
const validator_1 = require("../middleware/validator");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Curriculum_1 = __importDefault(require("./Curriculum"));
const router = (0, express_1.Router)();
router.get("/", (request, response) => {
    Curriculum_1.default.get()
        .then((curriculuns) => {
        if ((curriculuns === null || curriculuns === void 0 ? void 0 : curriculuns.length) === 0) {
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
        .catch((error) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde.",
        error,
    }));
});
router.post("/login", (0, express_validator_1.body)("email").isLength({ min: 5, max: 255 }), (0, express_validator_1.body)("password").isLength({ min: 5, max: 30 }), validator_1.validator, (request, response) => {
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
router.post("/", (0, express_validator_1.body)("name").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("birthdate").isDate(), (0, express_validator_1.body)("cpf").isLength({ min: 14, max: 14 }), (0, express_validator_1.body)("tel").isLength({ min: 15, max: 15 }), (0, express_validator_1.body)("email").isLength({ min: 5, max: 255 }).isEmail(), (0, express_validator_1.body)("address").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("city").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("uf").isLength({ min: 2, max: 2 }), (0, express_validator_1.body)("fields").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("formation").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("conclusion").isDate(), (0, express_validator_1.body)("personal_references").notEmpty(), (0, express_validator_1.body)("general_info").notEmpty(), (0, express_validator_1.body)("password").isLength({ min: 5, max: 30 }), validator_1.validator, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const curriculumValues = request.body;
    yield Curriculum_1.default.create(curriculumValues)
        .then((curriculum) => {
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
}));
router.delete("/", (0, express_validator_1.query)("email").notEmpty().isEmail(), (0, express_validator_1.query)("password").notEmpty(), validator_1.validator, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
                msg: "Curriculo deletado com sucesso",
                curriculum,
            });
        });
    }));
}));
exports.default = router;
