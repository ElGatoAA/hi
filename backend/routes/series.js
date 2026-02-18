import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/portadas", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.img, c.number, s.name
      FROM caps c
      JOIN series s ON c.serie_id = s.id
      ORDER BY c.id DESC
      LIMIT 12;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener portadas" });
  }
});

router.get("/series", async (req, res) => {
  try {
    const { orderBy } = req.query;

    const orderMap = {
      salida:    "ORDER BY s.year DESC",
      favoritos: "ORDER BY favoritos_count DESC",
      rating:    "ORDER BY rating_promedio DESC NULLS LAST",
    };
    const orderClause = orderMap[orderBy] || "ORDER BY s.name ASC";

    const result = await pool.query(`
      SELECT
        s.id, s.name, s.img, s.year,
        COUNT(DISTINCT f.id) AS favoritos_count,
        ROUND(AVG(r.rating)::numeric, 1) AS rating_promedio
      FROM series s
      LEFT JOIN favoritos f ON s.id = f.serie_id
      LEFT JOIN ratings r ON s.id = r.serie_id
      GROUP BY s.id, s.name, s.img, s.year
      ${orderClause};
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener series" });
  }
});

router.get("/serie/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, year, description, img FROM series WHERE id = $1;",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener serie" });
  }
});

router.get("/seriesPorGenero/:generoId", async (req, res) => {
  try {
    const { orderBy } = req.query;

    const orderMap = {
      salida:    "ORDER BY s.year DESC",
      favoritos: "ORDER BY favoritos_count DESC",
      rating:    "ORDER BY rating_promedio DESC NULLS LAST",
    };
    const orderClause = orderMap[orderBy] || "ORDER BY s.name ASC";

    const result = await pool.query(`
      SELECT DISTINCT
        s.id, s.name, s.img, s.year,
        COUNT(DISTINCT f.id) AS favoritos_count,
        ROUND(AVG(r.rating)::numeric, 1) AS rating_promedio
      FROM series s
      JOIN series_generos sg ON s.id = sg.serie_id
      LEFT JOIN favoritos f ON s.id = f.serie_id
      LEFT JOIN ratings r ON s.id = r.serie_id
      WHERE sg.genero_id = $1
      GROUP BY s.id, s.name, s.img, s.year
      ${orderClause};
    `, [req.params.generoId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener series por género" });
  }
});

router.get("/sugerencias/:serieId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT s.id, s.name, s.img, COUNT(sg2.genero_id) AS generos_comunes
      FROM series s
      JOIN series_generos sg2 ON s.id = sg2.serie_id
      WHERE sg2.genero_id IN (
        SELECT genero_id FROM series_generos WHERE serie_id = $1
      )
      AND s.id != $1
      GROUP BY s.id, s.name, s.img
      ORDER BY generos_comunes DESC, s.name ASC
      LIMIT 9;
    `, [req.params.serieId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener sugerencias" });
  }
});

router.get("/generos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre FROM generos ORDER BY nombre ASC;"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener géneros" });
  }
});

router.get("/genero/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre FROM generos WHERE id = $1;",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener género" });
  }
});

router.get("/generosDeSerie/:serieId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT g.id, g.nombre
      FROM generos g
      JOIN series_generos sg ON g.id = sg.genero_id
      WHERE sg.serie_id = $1
      ORDER BY g.nombre ASC;
    `, [req.params.serieId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener géneros de la serie" });
  }
});

export default router;