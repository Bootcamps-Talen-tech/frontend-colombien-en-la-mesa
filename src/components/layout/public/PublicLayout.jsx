import { Navigate, Outlet, useLocation } from "react-router-dom";
import { HeaderPub } from "./HeaderPub";
import { Footer } from "./Footer";
import { MainContent } from "./MainContent";
import { ButtonRegister } from "./ButtonRegister";
import useAuth from '../../../hooks/useAuth';

// Define y exporta el componente PublicLayout.
export const PublicLayout = () => {
  // Obtiene el objeto de autenticación del hook useAuth.
  const { auth } = useAuth();
  
  // Obtiene la ubicación actual de la ruta desde useLocation.
  const location = useLocation();

  // Define las rutas que deberían estar exentas de mostrar MainContent y ButtonRegister.
  const restrictedRoutes = ['/registro', '/login'];

  // Verifica si la ruta actual está en la lista de rutas restringidas.
  const isRestrictedPage = restrictedRoutes.includes(location.pathname);

  return (
    <>
      {/* Renderiza el componente HeaderPub en la parte superior de la página */}
      <HeaderPub />

      {/* Sección que contiene el contenido principal */}
      <section className="content-wrapper">
        {/* Si el usuario no está autenticado, muestra el contenido renderizado por Outlet */}
        {!auth._id ? (
          <Outlet />
        ) : (
          // Si el usuario está autenticado, redirige a la ruta "/colreceta".
          <Navigate to="/colreceta" />
        )}

        {/* Muestra MainContent y ButtonRegister solo si la ruta actual no está en las rutas restringidas */}
        {!isRestrictedPage && (
          <>
            <MainContent />
            <ButtonRegister />
          </>
        )}
      </section>

      {/* Renderiza el componente Footer en la parte inferior de la página */}
      <Footer />
    </>
  );
};