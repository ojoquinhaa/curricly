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
const Vacancie_1 = __importDefault(require("./Vacancie"));
const Companies_1 = __importDefault(require("../Companies/Companies"));
const router = (0, express_1.Router)();
router.get("/", (request, response) => {
    const companie = request.query.companie;
    const fields = request.query.fields;
    Vacancie_1.default.get(companie, fields)
        .then((vacancies) => {
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
        .catch((e) => {
        response.status(500).json({
            msg: "Erro no servidor tente novamente mais tarde",
            e,
        });
    });
});
router.get("/id/:id", (0, express_validator_1.param)("id").isNumeric(), validator_1.validator, (request, response) => {
    const id = parseInt(request.params.id);
    Vacancie_1.default.getById(id)
        .then((vacancie) => {
        if (vacancie === null) {
            response.status(400).json({
                msg: "Não foi encontrado nenhuma vaga",
            });
            return;
        }
        response.status(200).json({
            success: true,
            vacancie,
        });
    })
        .catch((e) => {
        response.status(500).json({
            msg: "Erro no servidor tente novamente mais tarde",
            e,
        });
    });
});
router.get("/companie/:id", (0, express_validator_1.param)("id").isNumeric(), validator_1.validator, (request, response) => {
    const id = parseInt(request.params.id);
    Vacancie_1.default.getByCompanie(id)
        .then((vacancies) => {
        if (vacancies === null || vacancies.length === 0) {
            response.status(400).json({
                msg: "Não foi encontrada nenhuma vaga.",
                id,
            });
            return;
        }
        response.status(200).json({
            success: true,
            vacancies,
        });
    })
        .catch((e) => response.status(500).json(e));
});
router.post("/", (0, express_validator_1.body)("title").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("description").notEmpty(), (0, express_validator_1.body)("fields").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("tel").isLength({ min: 19, max: 19 }), (0, express_validator_1.body)("contact").isLength({ min: 5, max: 255 }).isEmail(), (0, express_validator_1.body)("requirements").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("city").isLength({ min: 5, max: 191 }), (0, express_validator_1.body)("uf").isLength({ min: 2, max: 2 }), (0, express_validator_1.body)("salary").isNumeric().notEmpty(), (0, express_validator_1.query)("email").notEmpty(), (0, express_validator_1.query)("password").notEmpty(), validator_1.validator, (request, response) => {
    const email = request.query.email;
    const password = request.query.password;
    Companies_1.default.login(email, password)
        .then((companie) => {
        if (companie === null) {
            response.status(400).json({
                msg: "As credenciáis estão inválidas.",
            });
            return;
        }
        request.body.salary = parseInt(request.body.salary);
        const vacancieValues = request.body;
        vacancieValues.companie = companie.id;
        Vacancie_1.default.create(vacancieValues)
            .then((vacancie) => {
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
            .catch((error) => {
            response.status(500).json({
                msg: "Erro no servidor, tente novamente mais tarde.",
                error,
            });
        });
    })
        .catch((e) => {
        response.status(500).json({
            msg: "Erro no servidor. Por favor tente novamente mais tarde",
            e,
        });
    });
});
router.post("/sendCurriculumTo/:id", (0, express_validator_1.param)("id").isNumeric().notEmpty(), (0, express_validator_1.body)("email").notEmpty().isEmail(), (0, express_validator_1.body)("password").notEmpty(), validator_1.validator, (request, response) => {
    const id = parseInt(request.params.id);
    const email = request.body.email;
    const password = request.body.password;
    Vacancie_1.default.sendCurriculum(id, email, password)
        .then((mail) => {
        if (mail === null) {
            response.status(400).json({
                msg: "As credenciáis estão inválidas.",
            });
            return;
        }
        response.status(200).json({
            success: true,
            mail,
        });
    })
        .catch((e) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde.",
        e,
    }));
});
router.delete("/:id", (0, express_validator_1.query)("email").notEmpty().isEmail(), (0, express_validator_1.query)("password").notEmpty(), (0, express_validator_1.param)("id").isNumeric().notEmpty(), validator_1.validator, (request, response) => {
    const email = request.query.email;
    const password = request.query.password;
    const id = parseInt(request.params.id);
    Companies_1.default.login(email, password)
        .then((companie) => __awaiter(void 0, void 0, void 0, function* () {
        if (companie === null) {
            response.status(400).json({
                msg: "As credenciáis estão inválidas.",
            });
            return;
        }
        yield Vacancie_1.default.getById(id).then((vacancie) => __awaiter(void 0, void 0, void 0, function* () {
            if (vacancie === null) {
                response.status(400).json({
                    msg: "Vaga não encontrada.",
                });
                return;
            }
            if (vacancie.companie === companie.id) {
                yield Vacancie_1.default.delete(id)
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
        }));
    }))
        .catch((e) => {
        response.status(500).json({
            msg: "Erro no servidor. Por favor tente novamente mais tarde.",
        });
    });
});
exports.default = router;
