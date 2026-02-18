import { Router } from "express";
import { pool } from "../db.js";
import { verificarToken } from "../middleware/auth.js";

const router = Router();

router.get("/comentarios/:serieId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id, c.mensaje, c.comentario_padre_id, c.created_at,
        u.usuario, u.imagen,
        (SELECT usuario FROM usuarios WHERE id = (
          SELECT usuario_id FROM comentarios WHERE id = c.comentario_padre_id
        )) AS usuario_respondido
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.serie_id = $1
      ORDER BY c.created_at ASC
    `, [req.params.serieId]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

router.post("/comentarios", verificarToken, async (req, res) => {
  try {
    const { serie_id, mensaje, comentario_padre_id } = req.body;

    if (!mensaje?.trim()) {
      return res.status(400).json({ error: "El mensaje no puede estar vacío" });
    }

    const result = await pool.query(`
      INSERT INTO comentarios (usuario_id, serie_id, mensaje, comentario_padre_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [req.userId, serie_id, mensaje.trim(), comentario_padre_id || null]);

    const comentario = await pool.query(`
      SELECT c.id, c.mensaje, c.comentario_padre_id, c.created_at, u.usuario, u.imagen
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.id = $1
    `, [result.rows[0].id]);

    res.json(comentario.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear comentario" });
  }
});

router.delete("/comentarios/:comentarioId", verificarToken, async (req, res) => {
  try {
    const comentario = await pool.query(
      "SELECT * FROM comentarios WHERE id = $1 AND usuario_id = $2",
      [req.params.comentarioId, req.userId]
    );
    if (comentario.rows.length === 0) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este comentario" });
    }

    await pool.query("DELETE FROM comentarios WHERE id = $1", [req.params.comentarioId]);
    res.json({ message: "Comentario eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar comentario" });
  }
});

export default router;