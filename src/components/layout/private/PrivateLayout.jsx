import { Navigate, Outlet, useLocation, matchPath } from "react-router-dom";
import { HeaderPriv } from "./HeaderPriv";
import useAuth from '../../../hooks/useAuth';
import { MainContentPriv } from "./MainContentPriv";
import { Footer } from "../public/Footer";

export const PrivateLayout = () => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  // Define las rutas restringidas con coincidencia de ruta dinámica
  const restrictedRoutes = [
    { path: '/colreceta/p/:Id' },
    { path: '/colreceta/logout' },
    {path:'/colreceta/new'},
    {path:'/colreceta/profile' },
    {path: '/colreceta/edit-recipe/:id'},
    {path: '/colreceta/aboutus'},
    {path: '/colreceta/users'}
  ];

  // Verifica si la ubicación actual coincide con alguna ruta restringida
  const isRestrictedPage = restrictedRoutes.some(route =>
    matchPath(route.path, location.pathname)
  );

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (!auth._id) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <HeaderPriv />
      <div className='content-wrapper'>
        {isRestrictedPage ? <Outlet /> : <MainContentPriv />}
      </div>
      <Footer />
    </>
  );
};
