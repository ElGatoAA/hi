import "dotenv/config";

export const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_super_seguro_cambialo_en_produccion";
export const PORT = process.env.PORT || 3000;