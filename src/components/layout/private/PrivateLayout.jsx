import { Navigate, Outlet } from "react-router-dom";
import { HeaderPriv } from "./HeaderPriv"
import useAuth from '../../../hooks/useAuth';
import { MainContentPriv } from "./MainContentPriv";
import { Footer } from "../public/Footer";

// Define y exporta el componente PrivateLayout.
export const PrivateLayout = () => {

  // Usa el hook useAuth para obtener la información de autenticación y el estado de carga.
  const { auth, loading } = useAuth();

  // Si está cargando, muestra un mensaje de carga.
  if (loading) {
    return <h1>Cargando...</h1>
  } else {
    return (
      <>
        {/* Muestra la información de autenticación en la consola. */}
        {console.log(auth)}

        {/* Cabecera y navegación */}
        <HeaderPriv />

        {/* Contenido Principal */}
        <div className='content-wrapper'>
          {/* Si el usuario está autenticado, muestra el contenido protegido (Outlet). */}
          {auth._id ?
            <Outlet />
            :
            // Si el usuario no está autenticado, redirige a la página de inicio de sesión.
            <Navigate to="/login" />
          }
          {/* Contenido principal adicional (MainContentPriv) */}
          <MainContentPriv />
        </div>
        
        {/* Pie de página */}
        <Footer />
      </>
    );
  }
}