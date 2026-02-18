import express from "express";
import cors from "cors";
import "dotenv/config";

import seriesRouter     from "./routes/series.js";
import capitulosRouter  from "./routes/capitulos.js";
import usersRouter      from "./routes/users.js";
import favoritosRouter  from "./routes/favoritos.js";
import comentariosRouter from "./routes/comentarios.js";
import ratingsRouter    from "./routes/ratings.js";
import { PORT } from "./config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "API funcionando" }));

app.use(seriesRouter);
app.use(capitulosRouter);
app.use(usersRouter);
app.use(favoritosRouter);
app.use(comentariosRouter);
app.use(ratingsRouter);

app.listen(PORT, () => {
  console.log(`Backend en http://localhost:${PORT}`);
});