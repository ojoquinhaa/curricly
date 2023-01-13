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
const Mailer_1 = __importDefault(require("../Mailer/Mailer"));
const conn_1 = __importDefault(require("../config/conn"));
const Curriculum_1 = __importDefault(require("../Curriculum/Curriculum"));
class VacanciesModels {
    get(companie, field) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                conn_1.default.vacancies
                    .findMany()
                    .then((vacancies) => {
                    if (vacancies === null || vacancies.length === 0) {
                        resolve(null);
                        return;
                    }
                    const vacancieList = [];
                    vacancies.forEach((vacancie, i) => {
                        const vdate = new Date(vacancie.created_at);
                        const vexpires = new Date(vdate.getTime() + 24 * 60 * 60 * 1000 * 20);
                        const today = new Date();
                        if (today > vexpires) {
                            return;
                        }
                        if ((field === undefined || field === "") &&
                            (companie === undefined || companie === "")) {
                            vacancieList.push(vacancie);
                            return;
                        }
                        if (field === undefined || field === "") {
                            if (vacancie.companie !== parseInt(companie)) {
                                return;
                            }
                        }
                        if (companie === undefined || companie === "") {
                            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                            if (!String(vacancie.fields).match(field)) {
                                return;
                            }
                        }
                        if (field !== undefined &&
                            companie !== undefined &&
                            field !== "" &&
                            companie !== "") {
                            if (
                            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                            !String(vacancie.fields).match(field) ||
                                vacancie.companie !== parseInt(companie)) {
                                return;
                            }
                        }
                        vacancieList.push(vacancie);
                    });
                    if (vacancieList === null || vacancieList.length === 0) {
                        resolve(null);
                        return;
                    }
                    resolve(vacancieList);
                })
                    .catch((e) => reject(e));
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.vacancies.findFirst({
                where: {
                    id,
                },
            });
        });
    }
    getByCompanie(companie) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.vacancies.findMany({
                where: {
                    companie,
                },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.vacancies.create({
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.vacancies.delete({
                where: {
                    id,
                },
            });
        });
    }
    sendCurriculum(id, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                conn_1.default.vacancies
                    .findUnique({
                    where: {
                        id,
                    },
                })
                    .then((vacancie) => __awaiter(this, void 0, void 0, function* () {
                    if (vacancie === null) {
                        resolve(null);
                        return;
                    }
                    const curriculum = yield Curriculum_1.default.login(email, password);
                    if (curriculum === null) {
                        resolve(null);
                        return;
                    }
                    const companie = yield conn_1.default.companies.findUnique({
                        where: {
                            id: vacancie.companie,
                        },
                    });
                    if (companie === null) {
                        resolve(null);
                        return;
                    }
                    const mailOptions = Mailer_1.default.createMailOptions(companie.email, "Você recebeu um currículo para concorrer a uma das suas vagas!", this.createVacancieEmailHTML(vacancie, curriculum));
                    const mail = yield Mailer_1.default.send(mailOptions);
                    resolve(mail);
                }))
                    .catch((e) => reject(e));
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
    createVacancieEmailHTML(vacancie, curriculum) {
        const birthdate = this.formatDate(curriculum.birthdate);
        const conclusion = `${(() => {
            if (curriculum.conclusion.getMonth() > 9) {
                return String(curriculum.conclusion.getMonth());
            }
            else {
                return `0${curriculum.conclusion.getMonth()}`;
            }
        })()}/${String(curriculum.conclusion.getFullYear())}
    `;
        return `
    <div align="center">
    <img
      alt="CRCGO logo"
      src="https://crcgo.org.br/novo/wp-content/themes/crc/images/logo.png"
    />
    <div style="text-align: center; margin-top: 10px">
      <h4>
        Uma currículo foi enviado para concorrer a seguinte vaga da sua
        empresa:
      </h4>
      <div
        style="
          width: 450px;
          border: 1px blue solid;
          padding: 25px;
          margin: auto;
        "
      >
        <ul style="list-style: none; width: auto; margin: 0">
          <li>Título: <strong>${vacancie.title}</strong></li>
          <li>Descrição: <strong>${vacancie.description}</strong></li>
          <li>Requerimentos: <strong>${vacancie.requirements}</strong></li>
          <li>Áreas: <strong>${vacancie.fields}</strong></li>
          <li>Salário: <strong>${vacancie.salary}</strong></li>
        </ul>
      </div>
      <hr />
      <div style="width: 500px; margin: auto">
        <h5 style="text-align: left; margin-left: 23px">
          <strong>Currículo: </strong>
        </h5>
        <div
          style="
            width: 90%;
            border: 1px blue solid;
            padding: 5%;
            margin: auto;
          "
        >
          <ul style="list-style: none; width: auto; margin: 0">
            <li>Nome: <strong>${curriculum.name}</strong></li>
            <li>Data de nascimento: <strong>${birthdate}</strong></li>
            <li>Telefone: <strong>${curriculum.tel}</strong></li>
            <li>E-mail: <strong>${curriculum.email}</strong></li>
            <li>Endereço completo: <strong>${curriculum.address}</strong></li>
            <li>Cidade/UF: <strong>${curriculum.city}/${curriculum.uf}</strong></li>
            <li>Aréas: <strong>${curriculum.fields}</strong></li>
            <li>Formação: <strong>${curriculum.formation}</strong></li>
            <li>Data de conclusão: <strong>${conclusion}</strong></li>
            <li>Informações gerais: <strong>${curriculum.general_info}</strong></li>
            <li>Referencias pessoais: <strong>${curriculum.personal_references}</strong></li>
          </ul>
        </div>
      </div>
      <hr />
      <small style="color: gray"
        >Entre em contato com o dono do currículo pelo seu telefone ou
        e-mail.</small
      >
    </div>
  </div>
    `;
    }
    update(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.vacancies.update({
                data,
                where: {
                    id,
                },
            });
        });
    }
}
exports.default = new VacanciesModels();
