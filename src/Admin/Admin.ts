import conn from "../config/conn";
import { Admin } from "@prisma/client";

class AdminModels {
  async login(user: string, password: string): Promise<Admin | null> {
    return await conn.admin.findFirst({
      where: {
        user,
        password,
      },
    });
  }
}

export default new AdminModels();
