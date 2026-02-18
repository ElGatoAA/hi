import { Router } from "express";
import { pool } from "../db.js";
import { verificarToken } from "../middleware/auth.js";

const router = Router();

router.get("/rating/:serieId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ROUND(AVG(rating)::numeric, 1) AS promedio, COUNT(*) AS total_ratings
      FROM ratings
      WHERE serie_id = $1
    `, [req.params.serieId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener rating" });
  }
});

router.get("/rating/:serieId/usuario", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT rating FROM ratings WHERE serie_id = $1 AND usuario_id = $2",
      [req.params.serieId, req.userId]
    );
    res.json({ rating: result.rows[0]?.rating ?? null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener rating del usuario" });
  }
});

router.post("/rating", verificarToken, async (req, res) => {
  try {
    const { serie_id, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "El rating debe ser entre 1 y 5" });
    }

    const result = await pool.query(`
      INSERT INTO ratings (usuario_id, serie_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (usuario_id, serie_id)
      DO UPDATE SET rating = $3, created_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [req.userId, serie_id, rating]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar rating" });
  }
});

export default router;