// index.js
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const JWT_SECRET = "tu_secreto_super_seguro_cambialo_en_produccion"; // Cambiar en producción

// Configurar la ruta de destino para las fotos
const uploadPath = path.join(__dirname, '../src/assets/pf');

// Crear el directorio si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configurar multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'user-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif, webp)"));
  }
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

app.get("/portadas", async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
      c.id,
      c.img,
      c.number,
      s.name
      FROM caps c
      JOIN series s ON c.serie_id = s.id
      ORDER BY c.id DESC
      LIMIT 12;`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener portadas:", error);
    res.status(500).json({ error: "Error al obtener portadas" });
  }
});

app.get("/capitulo/:id", async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
      c.id,
      s.id AS serie_id,
      c.url,  
      c.number,
      s.name
      FROM caps c
      JOIN series s ON c.serie_id = s.id
      WHERE c.id = $1;`, [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener portadas:", error);
    res.status(500).json({ error: "Error al obtener portadas" });
  }
});

app.get("/capitulosSerie/:id", async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
      c.id, 
      c.number,
      s.name,
      c.img
      FROM caps c
      JOIN series s ON c.serie_id = s.id
      WHERE s.id = $1;`, [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener portadas:", error);
    res.status(500).json({ error: "Error al obtener portadas" });
  }
});

app.get("/series", async (req, res) => {
  try {
    const { orderBy } = req.query; // alfabetico, salida, favoritos, rating
    
    let orderClause = "ORDER BY s.name ASC"; // Por defecto alfabético
    
    if (orderBy === "salida") {
      orderClause = "ORDER BY s.year DESC";
    } else if (orderBy === "favoritos") {
      orderClause = "ORDER BY favoritos_count DESC";
    } else if (orderBy === "rating") {
      orderClause = "ORDER BY rating_promedio DESC NULLS LAST";
    }
    
    const result = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.img,
        s.year,
        COUNT(DISTINCT f.id) as favoritos_count,
        ROUND(AVG(r.rating)::numeric, 1) as rating_promedio
      FROM series s
      LEFT JOIN favoritos f ON s.id = f.serie_id
      LEFT JOIN ratings r ON s.id = r.serie_id
      GROUP BY s.id, s.name, s.img, s.year
      ${orderClause};`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener series:", error);
    res.status(500).json({ error: "Error al obtener series" });
  }
});

app.get("/serie/:id", async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
      id,
      name,
      year,
      description,
      img
      FROM series
      WHERE id = $1;`, [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener portadas:", error);
    res.status(500).json({ error: "Error al obtener portadas" });
  }
});

app.get("/generosDeSerie/:serieId", async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
      g.id,
      g.nombre
      FROM generos g
      JOIN series_generos sg ON g.id = sg.genero_id
      WHERE sg.serie_id = $1
      ORDER BY g.nombre ASC;`, [req.params.serieId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener géneros de la serie:", error);
    res.status(500).json({ error: "Error al obtener géneros de la serie" });
  }
});

app.get("/sugerencias/:serieId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT s.id, s.name, s.img, COUNT(sg2.genero_id) as generos_comunes
      FROM series s
      JOIN series_generos sg2 ON s.id = sg2.serie_id
      WHERE sg2.genero_id IN (
        SELECT genero_id 
        FROM series_generos 
        WHERE serie_id = $1
      )
      AND s.id != $1
      GROUP BY s.id, s.name, s.img
      ORDER BY generos_comunes DESC, s.name ASC
      LIMIT 9;`, [req.params.serieId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener sugerencias:", error);
    res.status(500).json({ error: "Error al obtener sugerencias" });
  }
});

// Registro de usuario
app.post("/registro", async (req, res) => {
  try {
    const { correo, usuario, contrasena } = req.body;

    // Validar que todos los campos estén presentes
    if (!correo || !usuario || !contrasena) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Verificar si el usuario o correo ya existen
    const userCheck = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1 OR usuario = $2",
      [correo, usuario]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "El usuario o correo ya existe" });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    // Insertar usuario
    const result = await pool.query(
      "INSERT INTO usuarios (correo, usuario, contrasena) VALUES ($1, $2, $3) RETURNING id, correo, usuario, imagen",
      [correo, usuario, hashedPassword]
    );

    const user = result.rows[0];

    // Generar JWT
    const token = jwt.sign({ id: user.id, usuario: user.usuario }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      token,
      user: {
        id: user.id,
        correo: user.correo,
        usuario: user.usuario,
        imagen: user.imagen
      }
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// Login de usuario
app.post("/login", async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
    }

    // Buscar usuario
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!validPassword) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Generar JWT
    const token = jwt.sign({ id: user.id, usuario: user.usuario }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      token,
      user: {
        id: user.id,
        correo: user.correo,
        usuario: user.usuario,
        imagen: user.imagen
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// Verificar token y obtener perfil
app.get("/perfil", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await pool.query(
      "SELECT id, correo, usuario, imagen, created_at FROM usuarios WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(401).json({ error: "Token inválido" });
  }
});

// Obtener perfil por nombre de usuario (público)
app.get("/perfil/:usuario", async (req, res) => {
  try {
    const { usuario } = req.params;

    const result = await pool.query(
      "SELECT id, usuario, imagen, created_at FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

// Obtener favoritos por nombre de usuario (público)
app.get("/favoritos/:usuario", async (req, res) => {
  try {
    const { usuario } = req.params;

    // Primero obtener el ID del usuario
    const userResult = await pool.query(
      "SELECT id FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario_id = userResult.rows[0].id;

    const result = await pool.query(`
      SELECT s.id, s.name, s.img, f.created_at
      FROM favoritos f
      JOIN series s ON f.serie_id = s.id
      WHERE f.usuario_id = $1
      ORDER BY f.created_at DESC
    `, [usuario_id]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// Middleware para verificar token
const verificarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Agregar serie a favoritos
app.post("/favoritos", verificarToken, async (req, res) => {
  try {
    const { serie_id } = req.body;
    const usuario_id = req.userId;

    const result = await pool.query(
      "INSERT INTO favoritos (usuario_id, serie_id) VALUES ($1, $2) RETURNING *",
      [usuario_id, serie_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Código de error para duplicados
      return res.status(400).json({ error: "La serie ya está en favoritos" });
    }
    console.error("Error al agregar favorito:", error);
    res.status(500).json({ error: "Error al agregar favorito" });
  }
});

// Eliminar serie de favoritos
app.delete("/favoritos/:serieId", verificarToken, async (req, res) => {
  try {
    const { serieId } = req.params;
    const usuario_id = req.userId;

    await pool.query(
      "DELETE FROM favoritos WHERE usuario_id = $1 AND serie_id = $2",
      [usuario_id, serieId]
    );

    res.json({ message: "Favorito eliminado" });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
});

// Obtener favoritos del usuario
app.get("/favoritos", verificarToken, async (req, res) => {
  try {
    const usuario_id = req.userId;

    const result = await pool.query(`
      SELECT s.id, s.name, s.img, f.created_at
      FROM favoritos f
      JOIN series s ON f.serie_id = s.id
      WHERE f.usuario_id = $1
      ORDER BY f.created_at DESC
    `, [usuario_id]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// Verificar si una serie está en favoritos
app.get("/favoritos/check/:serieId", verificarToken, async (req, res) => {
  try {
    const { serieId } = req.params;
    const usuario_id = req.userId;

    const result = await pool.query(
      "SELECT * FROM favoritos WHERE usuario_id = $1 AND serie_id = $2",
      [usuario_id, serieId]
    );

    res.json({ isFavorito: result.rows.length > 0 });
  } catch (error) {
    console.error("Error al verificar favorito:", error);
    res.status(500).json({ error: "Error al verificar favorito" });
  }
});

// Obtener comentarios de una serie
app.get("/comentarios/:serieId", async (req, res) => {
  try {
    const { serieId } = req.params;

    const result = await pool.query(`
      SELECT 
        c.id, 
        c.mensaje, 
        c.comentario_padre_id, 
        c.created_at,
        u.usuario,
        u.imagen,
        (SELECT usuario FROM usuarios WHERE id = (
          SELECT usuario_id FROM comentarios WHERE id = c.comentario_padre_id
        )) as usuario_respondido
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.serie_id = $1
      ORDER BY c.created_at ASC
    `, [serieId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

// Crear comentario
app.post("/comentarios", verificarToken, async (req, res) => {
  try {
    const { serie_id, mensaje, comentario_padre_id } = req.body;
    const usuario_id = req.userId;

    if (!mensaje || !mensaje.trim()) {
      return res.status(400).json({ error: "El mensaje no puede estar vacío" });
    }

    const result = await pool.query(`
      INSERT INTO comentarios (usuario_id, serie_id, mensaje, comentario_padre_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [usuario_id, serie_id, mensaje.trim(), comentario_padre_id || null]);

    // Obtener datos completos del comentario creado
    const comentarioCompleto = await pool.query(`
      SELECT 
        c.id, 
        c.mensaje, 
        c.comentario_padre_id, 
        c.created_at,
        u.usuario,
        u.imagen
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.id = $1
    `, [result.rows[0].id]);

    res.json(comentarioCompleto.rows[0]);
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ error: "Error al crear comentario" });
  }
});

// Eliminar comentario (solo el autor puede eliminarlo)
app.delete("/comentarios/:comentarioId", verificarToken, async (req, res) => {
  try {
    const { comentarioId } = req.params;
    const usuario_id = req.userId;

    // Verificar que el comentario pertenece al usuario
    const comentario = await pool.query(
      "SELECT * FROM comentarios WHERE id = $1 AND usuario_id = $2",
      [comentarioId, usuario_id]
    );

    if (comentario.rows.length === 0) {
      return res.status(403).json({ error: "No tienes permiso para eliminar este comentario" });
    }

    await pool.query("DELETE FROM comentarios WHERE id = $1", [comentarioId]);

    res.json({ message: "Comentario eliminado" });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ error: "Error al eliminar comentario" });
  }
});

// Obtener rating de una serie
app.get("/rating/:serieId", async (req, res) => {
  try {
    const { serieId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        ROUND(AVG(rating)::numeric, 1) as promedio,
        COUNT(*) as total_ratings
      FROM ratings
      WHERE serie_id = $1
    `, [serieId]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener rating:", error);
    res.status(500).json({ error: "Error al obtener rating" });
  }
});

// Obtener rating del usuario para una serie
app.get("/rating/:serieId/usuario", verificarToken, async (req, res) => {
  try {
    const { serieId } = req.params;
    const usuario_id = req.userId;
    
    const result = await pool.query(
      "SELECT rating FROM ratings WHERE serie_id = $1 AND usuario_id = $2",
      [serieId, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.json({ rating: null });
    }

    res.json({ rating: result.rows[0].rating });
  } catch (error) {
    console.error("Error al obtener rating del usuario:", error);
    res.status(500).json({ error: "Error al obtener rating del usuario" });
  }
});

// Crear o actualizar rating
app.post("/rating", verificarToken, async (req, res) => {
  try {
    const { serie_id, rating } = req.body;
    const usuario_id = req.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "El rating debe ser entre 1 y 5" });
    }

    // Usar UPSERT (INSERT ... ON CONFLICT)
    const result = await pool.query(`
      INSERT INTO ratings (usuario_id, serie_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (usuario_id, serie_id)
      DO UPDATE SET rating = $3, created_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [usuario_id, serie_id, rating]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al guardar rating:", error);
    res.status(500).json({ error: "Error al guardar rating" });
  }
});

// Subir foto personalizada
app.post("/subir-foto-perfil", verificarToken, (req, res) => {
  upload.single('foto')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "El archivo es demasiado grande (máximo 5MB)" });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No se subió ningún archivo" });
      }

      const usuario_id = req.userId;
      const filename = req.file.filename;

      console.log("Archivo subido:", filename);
      console.log("Ruta completa:", req.file.path);

      // Actualizar la foto del usuario directamente
      const result = await pool.query(
        "UPDATE usuarios SET imagen = $1 WHERE id = $2 RETURNING id, usuario, imagen",
        [filename, usuario_id]
      );

      res.json({ 
        message: "Foto subida exitosamente",
        imagen: result.rows[0].imagen
      });
    } catch (error) {
      console.error("Error al subir foto:", error);
      res.status(500).json({ error: "Error al subir foto: " + error.message });
    }
  });
});

// Usar foto por defecto
app.put("/usar-foto-default", verificarToken, async (req, res) => {
  try {
    const usuario_id = req.userId;

    const result = await pool.query(
      "UPDATE usuarios SET imagen = 'dev.png' WHERE id = $1 RETURNING id, usuario, imagen",
      [usuario_id]
    );

    res.json({ 
      message: "Foto restablecida a la predeterminada",
      imagen: result.rows[0].imagen
    });
  } catch (error) {
    console.error("Error al usar foto default:", error);
    res.status(500).json({ error: "Error al usar foto default" });
  }
});

app.get("/generos", async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
      id,
      nombre
      FROM generos ORDER BY nombre ASC;`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener géneros:", error);
    res.status(500).json({ error: "Error al obtener géneros" });
  }
});

app.get("/genero/:id", async (req, res) => {
  try {
    const result = await pool.query(`SELECT 
      id,
      nombre
      FROM generos
      WHERE id = $1;`, [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener género:", error);
    res.status(500).json({ error: "Error al obtener género" });
  }
});

app.get("/seriesPorGenero/:generoId", async (req, res) => {
  try {
    const { orderBy } = req.query;
    
    let orderClause = "ORDER BY s.name ASC";
    
    if (orderBy === "salida") {
      orderClause = "ORDER BY s.year DESC";
    } else if (orderBy === "favoritos") {
      orderClause = "ORDER BY favoritos_count DESC";
    } else if (orderBy === "rating") {
      orderClause = "ORDER BY rating_promedio DESC NULLS LAST";
    }
    
    const result = await pool.query(`
      SELECT DISTINCT 
        s.id,
        s.name,
        s.img,
        s.year,
        COUNT(DISTINCT f.id) as favoritos_count,
        ROUND(AVG(r.rating)::numeric, 1) as rating_promedio
      FROM series s
      JOIN series_generos sg ON s.id = sg.serie_id
      LEFT JOIN favoritos f ON s.id = f.serie_id
      LEFT JOIN ratings r ON s.id = r.serie_id
      WHERE sg.genero_id = $1
      GROUP BY s.id, s.name, s.img, s.year
      ${orderClause};`, [req.params.generoId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener series por género:", error);
    res.status(500).json({ error: "Error al obtener series por género" });
  }
});

app.listen(3000, () => {
  console.log("Backend en http://localhost:3000");
});