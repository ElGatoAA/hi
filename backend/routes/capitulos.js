import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/capitulo/:id", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, s.id AS serie_id, c.url, c.number, s.name
      FROM caps c
      JOIN series s ON c.serie_id = s.id
      WHERE c.id = $1;
    `, [req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener capítulo" });
  }
});

router.get("/capitulosSerie/:id", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.number, s.name, c.img
      FROM caps c
      JOIN series s ON c.serie_id = s.id
      WHERE s.id = $1;
    `, [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener capítulos de la serie" });
  }
});

export default router;