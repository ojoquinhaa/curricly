import express from "express";
import cors from "cors";
import helmet from "helmet";

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(helmet());

export default app;
