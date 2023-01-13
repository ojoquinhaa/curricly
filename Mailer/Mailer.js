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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const user = (_a = process.env.MAILER_USER) !== null && _a !== void 0 ? _a : "email@email.com";
const pass = (_b = process.env.MAILER_PASSWORD) !== null && _b !== void 0 ? _b : "123123";
const copyEmail = (_c = process.env.MAILER_COPY) !== null && _c !== void 0 ? _c : "copy@copy.com";
class Mailer {
    constructor(user, password) {
        this.user = user;
        this.password = password;
        this.transport = (0, nodemailer_1.createTransport)({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 587,
            auth: {
                user: this.user,
                pass: this.password,
            },
        });
    }
    send(mailOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            mailOptions.from = "CRCGO";
            const copyOptions = Object.assign({}, mailOptions);
            copyOptions.to = copyEmail;
            yield this.transport.sendMail(copyOptions);
            return yield this.transport.sendMail(mailOptions);
        });
    }
    createMailOptions(to, subject, html) {
        return {
            to,
            subject,
            html,
        };
    }
}
exports.default = new Mailer(user, pass);
