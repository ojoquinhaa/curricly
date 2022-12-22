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
const Companies_1 = __importDefault(require("./Companies"));
const router = (0, express_1.Router)();
router.get("/", (request, response) => {
    Companies_1.default.get()
        .then((companies) => {
        if ((companies === null || companies === void 0 ? void 0 : companies.length) === 0) {
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
        .catch((error) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde.",
        error,
    }));
});
router.post("/login", (0, express_validator_1.body)("email").isLength({ min: 5, max: 255 }), (0, express_validator_1.body)("password").isLength({ min: 5, max: 30 }), validator_1.validator, (request, response) => {
    const email = request.body.email;
    const password = request.body.password;
    Companies_1.default.login(email, password)
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
        .catch((error) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde.",
        error,
    }));
});
router.post("/", (0, express_validator_1.body)("fantasy_name").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("contact").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("cnpj").isLength({ min: 18, max: 19 }), (0, express_validator_1.body)("tel").isLength({ min: 15, max: 15 }), (0, express_validator_1.body)("email").isLength({ min: 5, max: 255 }).isEmail(), (0, express_validator_1.body)("address").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("city").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("uf").isLength({ min: 2, max: 2 }), (0, express_validator_1.body)("password").isLength({ min: 5, max: 30 }), validator_1.validator, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const companieValues = request.body;
    yield Companies_1.default.create(companieValues)
        .then((companie) => {
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
}));
router.delete("/", (0, express_validator_1.query)("email").notEmpty().isEmail(), (0, express_validator_1.query)("password").notEmpty(), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const email = request.query.email;
    const password = request.query.password;
    yield Companies_1.default.login(email, password).then((companie) => __awaiter(void 0, void 0, void 0, function* () {
        if (companie === null) {
            response.status(400).json({
                msg: "As credenciáis estão inválidas.",
            });
            return;
        }
        yield Companies_1.default.delete(companie.id).then((companie) => {
            response.status(200).json({
                msg: "Empresa deletado com sucesso",
                companie,
            });
        });
    }));
}));
exports.default = router;
