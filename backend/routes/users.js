import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import { pool } from "../db.js";
import { verificarToken } from "../middleware/auth.js";
import { upload } from "../config/multer.js";
import { JWT_SECRET } from "../config/env.js";

const router = Router();

// ── Auth ──────────────────────────────────────────────────────────────────────

router.post("/registro", async (req, res) => {
  try {
    const { correo, usuario, contrasena } = req.body;

    if (!correo || !usuario || !contrasena) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const userCheck = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1 OR usuario = $2",
      [correo, usuario]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "El usuario o correo ya existe" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (correo, usuario, contrasena) VALUES ($1, $2, $3) RETURNING id, correo, usuario, imagen",
      [correo, usuario, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, usuario: user.usuario }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user.id, correo: user.correo, usuario: user.usuario, imagen: user.imagen } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
    }

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuario]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign({ id: user.id, usuario: user.usuario }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user.id, correo: user.correo, usuario: user.usuario, imagen: user.imagen } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// ── Perfil ────────────────────────────────────────────────────────────────────

router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, correo, usuario, imagen, created_at FROM usuarios WHERE id = $1",
      [req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

router.get("/perfil/:usuario", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, usuario, imagen, created_at FROM usuarios WHERE usuario = $1",
      [req.params.usuario]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

// ── Foto de perfil ────────────────────────────────────────────────────────────

router.post("/subir-foto-perfil", verificarToken, (req, res) => {
  upload.single("foto")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "El archivo es demasiado grande (máximo 5MB)" });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });

      // Obtener foto anterior
      const userActual = await pool.query(
        "SELECT imagen FROM usuarios WHERE id = $1",
        [req.userId]
      );
      const fotoAnterior = userActual.rows[0]?.imagen;

      // Actualizar en base de datos
      const result = await pool.query(
        "UPDATE usuarios SET imagen = $1 WHERE id = $2 RETURNING id, usuario, imagen",
        [req.file.filename, req.userId]
      );

      // Borrar foto anterior del disco si no es la default
      if (fotoAnterior && fotoAnterior !== "dev.png") {
        const rutaAnterior = path.join(process.cwd(), "../frontend/src/assets/pf", fotoAnterior);
        fs.unlink(rutaAnterior, (err) => {
          if (err) console.error("No se pudo borrar la foto anterior:", err.message);
        });
      }

      res.json({ message: "Foto subida exitosamente", imagen: result.rows[0].imagen });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al subir foto: " + error.message });
    }
  });
});

export default router;