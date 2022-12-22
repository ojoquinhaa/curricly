"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const conn = new client_1.PrismaClient();
exports.default = conn;
