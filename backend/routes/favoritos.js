import { Router } from "express";
import { pool } from "../db.js";
import { verificarToken } from "../middleware/auth.js";

const router = Router();

// Favoritos del usuario autenticado
router.get("/favoritos", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.name, s.img, f.created_at
      FROM favoritos f
      JOIN series s ON f.serie_id = s.id
      WHERE f.usuario_id = $1
      ORDER BY f.created_at DESC
    `, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// Favoritos públicos por nombre de usuario
router.get("/favoritos/:usuario", async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT id FROM usuarios WHERE usuario = $1",
      [req.params.usuario]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const result = await pool.query(`
      SELECT s.id, s.name, s.img, f.created_at
      FROM favoritos f
      JOIN series s ON f.serie_id = s.id
      WHERE f.usuario_id = $1
      ORDER BY f.created_at DESC
    `, [userResult.rows[0].id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// Verificar si una serie está en favoritos
router.get("/favoritos/check/:serieId", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM favoritos WHERE usuario_id = $1 AND serie_id = $2",
      [req.userId, req.params.serieId]
    );
    res.json({ isFavorito: result.rows.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al verificar favorito" });
  }
});

// Agregar a favoritos
router.post("/favoritos", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO favoritos (usuario_id, serie_id) VALUES ($1, $2) RETURNING *",
      [req.userId, req.body.serie_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "La serie ya está en favoritos" });
    }
    console.error(error);
    res.status(500).json({ error: "Error al agregar favorito" });
  }
});

// Eliminar de favoritos
router.delete("/favoritos/:serieId", verificarToken, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM favoritos WHERE usuario_id = $1 AND serie_id = $2",
      [req.userId, req.params.serieId]
    );
    res.json({ message: "Favorito eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
});

export default router;