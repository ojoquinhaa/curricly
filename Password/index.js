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
const Password_1 = __importDefault(require("./Password"));
const router = (0, express_1.Router)();
router.post("/", Password_1.default.checkRequests, (0, express_validator_1.body)("email").isEmail().notEmpty().isLength({ min: 5, max: 255 }), (0, express_validator_1.body)("type")
    .notEmpty()
    .custom((value) => {
    if (value !== "curriculum" && value !== "companie") {
        return false;
    }
    return true;
}), validator_1.validator, 
// eslint-disable-next-line @typescript-eslint/no-misused-promises
(request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const email = request.body.email;
    const type = request.body.type;
    const passwordRequest = yield Password_1.default.createPasswordRequest(email, type);
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
}));
router.post("/:request", Password_1.default.checkRequests, (0, express_validator_1.body)("password").isLength({ min: 5, max: 30 }), validator_1.validator, (request, response) => {
    const req = request.params.request;
    const password = request.body.password;
    Password_1.default.changePassword(req, password)
        .then((values) => {
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
});
exports.default = router;
