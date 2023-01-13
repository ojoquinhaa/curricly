"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../middleware/validator");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Admin_1 = __importDefault(require("./Admin"));
const Curriculum_1 = __importDefault(require("../Curriculum/Curriculum"));
const Companies_1 = __importDefault(require("../Companies/Companies"));
const Vacancie_1 = __importDefault(require("../Vacancies/Vacancie"));
const router = (0, express_1.Router)();
router.post("/", (0, express_validator_1.body)("user").notEmpty(), (0, express_validator_1.body)("password").notEmpty(), validator_1.validator, (request, response) => {
    const user = request.body.user;
    const password = request.body.password;
    Admin_1.default.login(user, password)
        .then((login) => {
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
        .catch((e) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde",
        e,
    }));
});
router.delete("/curriculum/:id", (0, express_validator_1.param)("id").isNumeric(), (0, express_validator_1.query)("user").notEmpty(), (0, express_validator_1.query)("password").notEmpty(), validator_1.validator, (request, response) => {
    const id = parseInt(request.params.id);
    const user = request.query.user;
    const password = request.query.password;
    Admin_1.default.login(user, password)
        .then((login) => {
        if (login === null) {
            response.status(400).json({
                msg: "As Credenciáis estão inválidas.",
            });
            return;
        }
        Curriculum_1.default.delete(id)
            .then((curriculum) => {
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
            .catch((e) => response.status(500).json({
            msg: "Erro no servidor, tente novamente mais tarde",
            e,
        }));
    })
        .catch((e) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde",
        e,
    }));
});
router.delete("/companie/:id", (0, express_validator_1.param)("id").isNumeric(), (0, express_validator_1.query)("user").notEmpty(), (0, express_validator_1.query)("password").notEmpty(), validator_1.validator, (request, response) => {
    const id = parseInt(request.params.id);
    const user = request.query.user;
    const password = request.query.password;
    Admin_1.default.login(user, password)
        .then((login) => {
        if (login === null) {
            response.status(400).json({
                msg: "As Credenciáis estão inválidas.",
            });
            return;
        }
        Companies_1.default.delete(id)
            .then((companie) => {
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
            .catch((e) => response.status(500).json({
            msg: "Erro no servidor, tente novamente mais tarde",
            e,
        }));
    })
        .catch((e) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde",
        e,
    }));
});
router.delete("/vacancie/:id", (0, express_validator_1.param)("id").isNumeric(), (0, express_validator_1.query)("user").notEmpty(), (0, express_validator_1.query)("password").notEmpty(), validator_1.validator, (request, response) => {
    const id = parseInt(request.params.id);
    const user = request.query.user;
    const password = request.query.password;
    Admin_1.default.login(user, password)
        .then((login) => {
        if (login === null) {
            response.status(400).json({
                msg: "As Credenciáis estão inválidas.",
            });
            return;
        }
        Vacancie_1.default.delete(id)
            .then((vacancie) => {
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
            .catch((e) => response.status(500).json({
            msg: "Erro no servidor, tente novamente mais tarde",
            e,
        }));
    })
        .catch((e) => response.status(500).json({
        msg: "Erro no servidor, tente novamente mais tarde",
        e,
    }));
});
exports.default = router;
