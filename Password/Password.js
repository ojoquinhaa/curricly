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
const conn_1 = __importDefault(require("../config/conn"));
const crypto_1 = require("crypto");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Mailer_1 = __importDefault(require("../Mailer/Mailer"));
class Password {
    createPasswordRequest(email, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                if (type === "companie") {
                    conn_1.default.companies
                        .findFirst({
                        where: {
                            email,
                        },
                    })
                        .then((companie) => __awaiter(this, void 0, void 0, function* () {
                        if (companie === null) {
                            resolve(null);
                            return;
                        }
                        const uuid = (0, crypto_1.randomUUID)();
                        const html = this.createRequestPasswordHTML(uuid);
                        const mailOptions = Mailer_1.default.createMailOptions(email, "Esqueceu a sua senha?", html);
                        Mailer_1.default.send(mailOptions)
                            .then((mailer) => __awaiter(this, void 0, void 0, function* () {
                            const query = yield conn_1.default.requestPassword.create({
                                data: {
                                    request: uuid,
                                    id: companie.id,
                                    type,
                                },
                            });
                            resolve([query, mailer]);
                        }))
                            .catch((e) => reject(e));
                    }))
                        .catch((e) => reject(e));
                }
                else if (type === "curriculum") {
                    conn_1.default.curriculum
                        .findFirst({
                        where: {
                            email,
                        },
                    })
                        .then((curriculum) => __awaiter(this, void 0, void 0, function* () {
                        if (curriculum === null) {
                            resolve(null);
                            return;
                        }
                        const uuid = (0, crypto_1.randomUUID)();
                        const html = this.createRequestPasswordHTML(uuid);
                        const mailOptions = Mailer_1.default.createMailOptions(email, "Esqueceu sua senha?", html);
                        Mailer_1.default.send(mailOptions)
                            .then((mailer) => __awaiter(this, void 0, void 0, function* () {
                            const query = yield conn_1.default.requestPassword.create({
                                data: {
                                    request: uuid,
                                    id: curriculum.id,
                                    type,
                                },
                            });
                            resolve([query, mailer]);
                        }))
                            .catch((e) => reject(e));
                    }))
                        .catch((e) => reject(e));
                }
            });
        });
    }
    checkRequests(req, res, next) {
        conn_1.default.requestPassword
            .findMany()
            .then((requests) => {
            if (requests === null) {
                next();
                return;
            }
            requests.forEach((request) => __awaiter(this, void 0, void 0, function* () {
                const today = new Date();
                const requestDate = new Date(request.create_at);
                const expiresRequestDate = new Date(requestDate.getTime() + 24 * 60 * 60 * 1000 * 20);
                if (today > expiresRequestDate) {
                    yield conn_1.default.requestPassword.delete({
                        where: {
                            request: request.request,
                        },
                    });
                }
            }));
            next();
        })
            .catch((e) => next(e));
    }
    changePassword(request, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = yield conn_1.default.requestPassword.findFirst({
                where: {
                    request,
                },
            });
            if (req === null) {
                return null;
            }
            const password = yield this.encrypt(newPassword);
            if (req.type === "companie") {
                const companie = yield conn_1.default.companies.update({
                    where: {
                        id: req.id,
                    },
                    data: {
                        password,
                    },
                });
                yield conn_1.default.requestPassword.delete({
                    where: {
                        request,
                    },
                });
                return companie;
            }
            if (req.type === "curriculum") {
                const curriculum = yield conn_1.default.curriculum.update({
                    where: {
                        id: req.id,
                    },
                    data: {
                        password,
                    },
                });
                yield conn_1.default.requestPassword.delete({
                    where: {
                        request,
                    },
                });
                return curriculum;
            }
            return null;
        });
    }
    createRequestPasswordHTML(request) {
        return `<div style="text-align: center">
  <div style="text-align: center">
    <img
      class="img-fluid col-md-12 rounded"
      alt="CRCGO logo"
      src="https://crcgo.org.br/novo/wp-content/themes/crc/images/logo.png"
    />
  </div>
  <h1>Esqueci minha senha</h1>
  <p>Aqui está o seu codigo de requisição: <strong>${request}</strong></p>
</div>
    `;
    }
    encrypt(password, rounds = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                bcrypt_1.default
                    .genSalt(rounds)
                    .then((salt) => {
                    bcrypt_1.default
                        .hash(password, salt)
                        .then((epassword) => {
                        resolve(epassword);
                    })
                        .catch((e) => reject(e));
                })
                    .catch((e) => reject(e));
            });
        });
    }
}
exports.default = new Password();
