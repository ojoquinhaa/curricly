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
class VacanciesModels {
    get() {
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
                    vacancies.forEach((vacancie) => {
                        const vdate = new Date(vacancie.created_at);
                        const vexpires = new Date(vdate.getTime() + 24 * 60 * 60 * 1000 * 20);
                        const today = new Date();
                        if (today > vexpires) {
                            return;
                        }
                        vacancieList.push(vacancie);
                    });
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
