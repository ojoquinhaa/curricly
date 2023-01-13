import app from "./config/app";
import dotenv from "dotenv";

import curriculumRouter from "./Curriculum/index";
import companieRouter from "./Companies/index";
import vacancieRouter from "./Vacancies/index";
import adminRouter from "./Admin/index";
import forgetPasswordRouter from "./Password/index";

dotenv.config();

app.use("/api/curriculum", curriculumRouter);
app.use("/api/companies", companieRouter);
app.use("/api/vacancies", vacancieRouter);
app.use("/api/admin", adminRouter);
app.use("/api/forgetPassword", forgetPasswordRouter);

const port: number | undefined | string = process.env.PORT ?? 4000;
app.listen(port);
