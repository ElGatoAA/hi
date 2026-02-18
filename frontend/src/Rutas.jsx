import { Routes, Route } from "react-router-dom";
import App from "./Pages/App";
import Capitulo from "./Pages/Capitulo";
import Serie from "./Pages/Serie";
import Directorio from "./Pages/Directorio";
import Auth from "./Pages/Auth";
import Perfil from "./Pages/Perfil";

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/capitulo/:id" element={<Capitulo />} />
      <Route path="/serie/:id" element={<Serie />} />
      <Route path="/directorio" element={<Directorio />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/perfil/:usuario" element={<Perfil />} />
    </Routes>
  );
}

export default Rutas;
