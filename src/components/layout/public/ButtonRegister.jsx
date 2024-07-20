import { Link } from "react-router-dom"

// Define y exporta el componente ButtonRegister.
export const ButtonRegister = () => {
  return (
    // Contenedor de los botones con clases para el diseño de Bootstrap.
    <div className="d-grid gap-2 col-3">
      {/* Enlace a la página de inicio de sesión */}
      <Link to="/login" className="btn btn-dark custom-btn">
        Inicia sesión
      </Link>
      {/* Enlace a la página de registro */}
      <Link to="/registro" className="btn btn-dark custom-btn">
        Regístrate
      </Link>
    </div>
  );
};