"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./config/app"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./Curriculum/index"));
const index_2 = __importDefault(require("./Companies/index"));
const index_3 = __importDefault(require("./Vacancies/index"));
dotenv_1.default.config();
app_1.default.use("/curriculum", index_1.default);
app_1.default.use("/companie", index_2.default);
app_1.default.use("/vacancie", index_3.default);
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000;
app_1.default.listen(port);
