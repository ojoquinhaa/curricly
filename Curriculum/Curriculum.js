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
    get(formation, field) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                conn_1.default.curriculum
                    .findMany()
                    .then((curriculuns) => {
                    if (curriculuns === null || curriculuns.length === 0) {
                        resolve(null);
                        return;
                    }
                    const curriculumList = [];
                    curriculuns.forEach((curriculum) => {
                        if ((formation === undefined || formation === "") &&
                            (field === undefined || field === "")) {
                            delete curriculum.password;
                            curriculumList.push(curriculum);
                            return;
                        }
                        if (field === undefined || field === "") {
                            if (curriculum.formation !== formation) {
                                return;
                            }
                        }
                        if (formation === undefined || formation === "") {
                            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                            if (!String(curriculum.fields).match(field)) {
                                return;
                            }
                        }
                        if (field !== undefined &&
                            formation !== undefined &&
                            field !== "" &&
                            formation !== "") {
                            if (
                            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                            !String(curriculum.fields).match(field) ||
                                curriculum.formation !== formation) {
                                return;
                            }
                        }
                        delete curriculum.password;
                        curriculumList.push(curriculum);
                    });
                    if (curriculumList === null || curriculumList.length === 0) {
                        resolve(null);
                        return;
                    }
                    resolve(curriculumList);
                })
                    .catch((e) => reject(e));
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.curriculum.findUnique({
                where: {
                    id,
                },
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
    formatDate(date) {
        return `${(() => {
            if (date.getDay() > 9) {
                return String(date.getDay());
            }
            else {
                return `0${date.getDay()}`;
            }
        })()}/${(() => {
            if (date.getMonth() > 9) {
                return String(date.getMonth());
            }
            else {
                return `0${date.getMonth()}`;
            }
        })()}/${String(date.getFullYear())}
    `;
    }
    update(data, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.login(email, password)
                    .then((login) => __awaiter(this, void 0, void 0, function* () {
                    if (login === null) {
                        resolve(null);
                        return;
                    }
                    const birthdate = new Date(data.birthdate);
                    const conclusion = new Date(data.conclusion);
                    data.birthdate = birthdate;
                    data.conclusion = conclusion;
                    const result = yield conn_1.default.curriculum.update({
                        data,
                        where: {
                            id: login.id,
                        },
                    });
                    resolve(result);
                }))
                    .catch((e) => reject(e));
            });
        });
    }
    createMailCurriculumHTML(curriculum) {
        const birthdate = this.formatDate(curriculum.birthdate);
        return `
    <div align="center">
      <img
        alt="CRCGO logo"
        src="https://crcgo.org.br/novo/wp-content/themes/crc/images/logo.png"
      />
      <div style="text-align: center; margin-top: 10px">
        <h4>
          Bem vindo ao sistema currícular do CRCGO, segue abaixo as informações
          do seu currículo:
        </h4>
        <ul style="list-style: none; margin-top: 10px">
          <li>Nome: <strong>${curriculum.name}</strong></li>
          <li>Email: <strong>${curriculum.email}</strong></li>
          <li>Cidade/Estado: <strong>${curriculum.city}/${curriculum.uf}</strong></li>
          <li>CPF: <strong>${curriculum.cpf}</strong></li>
          <li>Data de nascimento: <strong>${birthdate}</strong></li>
          <li>Referencias pessoais: <strong>${curriculum.personal_references}</strong></li>
          <li>Informações gerais: <strong>${curriculum.general_info}</strong></li>
        </ul>
        <hr />
        <small style="color: gray"
          >Faça login com sua senha de acesso para poder alterar essas
          informações.</small
        >
      </div>
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
exports.default = new CurriculumModels();
