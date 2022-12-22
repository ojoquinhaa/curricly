import app from "./config/app";
import dotenv from "dotenv";
import curriculumRouter from "./Curriculum/index";
import companieRouter from "./Companies/index";
import vacancieRouter from "./Vacancies/index";

dotenv.config();

app.use("/curriculum", curriculumRouter);
app.use("/companie", companieRouter);
app.use("/vacancie", vacancieRouter);

const port: number | undefined | string = process.env.PORT ?? 4000;
app.listen(port);
