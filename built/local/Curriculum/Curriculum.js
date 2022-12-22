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
const bcrypt_1 = __importDefault(require("bcrypt"));
class CurriculumModels {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.curriculum.findMany({
                select: {
                    password: false,
                    id: true,
                    name: true,
                    birthdate: true,
                    cpf: true,
                    tel: true,
                    email: true,
                    address: true,
                    city: true,
                    uf: true,
                    fields: true,
                    formation: true,
                    conclusion: true,
                    general_info: true,
                    personal_references: true,
                    created_at: true,
                },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.alreadySingup(data)
                    .then((isSingup) => {
                    if (isSingup) {
                        resolve(null);
                        return;
                    }
                    this.encrypt(data.password)
                        .then((password) => __awaiter(this, void 0, void 0, function* () {
                        const birthdate = new Date(data.birthdate);
                        const conclusion = new Date(data.conclusion);
                        data.birthdate = birthdate;
                        data.conclusion = conclusion;
                        data.password = password;
                        const result = yield conn_1.default.curriculum.create({
                            data,
                        });
                        resolve(result);
                    }))
                        .catch((e) => reject(e));
                })
                    .catch((e) => reject(e));
            });
        });
    }
    alreadySingup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                conn_1.default.curriculum
                    .findFirst({
                    where: {
                        OR: [{ email: data.email }, { cpf: data.cpf }, { tel: data.tel }],
                    },
                })
                    .then((isSingup) => {
                    if (isSingup === null) {
                        resolve(false);
                        return;
                    }
                    resolve(true);
                })
                    .catch((e) => reject(e));
            });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
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
                    yield bcrypt_1.default
                        .compare(password, curriculum.password)
                        .then((logged) => {
                        if (logged) {
                            resolve(curriculum);
                            return;
                        }
                        resolve(null);
                    })
                        .catch((e) => reject(e));
                }))
                    .catch((e) => reject(e));
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.curriculum.delete({
                where: {
                    id,
                },
            });
        });
    }
    update(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.curriculum.update({
                data,
                where: {
                    id,
                },
            });
        });
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
exports.default = new CurriculumModels();
