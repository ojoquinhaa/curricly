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
class CompaniesModels {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.companies.findMany({
                select: {
                    address: true,
                    city: true,
                    cnpj: false,
                    contact: true,
                    created_at: true,
                    email: true,
                    fantasy_name: true,
                    id: true,
                    password: false,
                    tel: true,
                    uf: true,
                },
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.companies.findUnique({
                where: {
                    id,
                },
                select: {
                    address: true,
                    city: true,
                    cnpj: false,
                    contact: true,
                    created_at: true,
                    email: true,
                    fantasy_name: true,
                    id: true,
                    password: false,
                    tel: true,
                    uf: true,
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
                        data.password = password;
                        resolve(yield conn_1.default.companies.create({
                            data,
                        }));
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
                conn_1.default.companies
                    .findFirst({
                    where: {
                        OR: [{ email: data.email }, { cnpj: data.cnpj }, { tel: data.tel }],
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
                conn_1.default.companies
                    .findFirst({
                    where: {
                        email,
                    },
                })
                    .then((companies) => __awaiter(this, void 0, void 0, function* () {
                    if (companies === null) {
                        resolve(null);
                        return;
                    }
                    yield bcrypt_1.default
                        .compare(password, companies.password)
                        .then((logged) => {
                        if (logged) {
                            resolve(companies);
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
            yield conn_1.default.vacancies.deleteMany({
                where: {
                    companie: id,
                },
            });
            return yield conn_1.default.companies.delete({
                where: {
                    id,
                },
            });
        });
    }
    update(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conn_1.default.companies.update({
                data,
                where: {
                    id,
                },
            });
        });
    }
    createMailCompanieHTML(companie) {
        return `
    <div align="center">
    <img
      alt="CRCGO logo"
      src="https://crcgo.org.br/novo/wp-content/themes/crc/images/logo.png"
    />
    <div style="text-align: center; margin-top: 10px">
      <h4>
        Bem vindo ao sistema currícular do CRCGO, segue abaixo as informações
        do cadastro da sua empresa
      </h4>
      <ul style="list-style: none; margin-top: 10px">
        <li>Nome da empresa: <strong>${companie.fantasy_name}</strong></li>
        <li>Email: <strong>${companie.email}</strong></li>
        <li>Cidade/Estado: <strong>${companie.city}/${companie.uf}</strong></li>
        <li>CNPJ: <strong>${companie.cnpj}</strong></li>
        <li>Contato: <strong>${companie.contact}</strong></li>
        <li>Telefone: <strong>${companie.tel}</strong></li>
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
exports.default = new CompaniesModels();
