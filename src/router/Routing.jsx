import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/public/PublicLayout';
import { PrivateLayout } from '../components/layout/private/PrivateLayout';
import { Register } from '../components/layout/user/Register';
import { AuthProvider } from '../context/AuthProvider';
import { Login } from '../components/layout/user/Login';
import { Logout } from '../components/layout/user/Logout';
import { CardView } from '../components/layout/private/CardView';
import { NewRecipe } from '../components/layout/recipes/NewRecipe';
import { Profile } from '../components/layout/user/Profile';
import EditRecipe from '../components/layout/user/EditRecipe';
import AboutUs from '../components/layout/private/AboutUs';
import UserList from '../components/layout/user/UserList';
export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Cargar los componentes de la ruta pública */}
          <Route path="/" element={<PublicLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Register />} />
          </Route>

          {/* Cargamos los componentes de la ruta privada en rutas anidadas */}
          <Route path="/colreceta" element={<PrivateLayout />}>
            <Route path="logout" element={<Logout />} />
            <Route path="p/:Id" element={<CardView />} />
            <Route path="new" element={<NewRecipe />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edit-recipe/:id" element={<EditRecipe />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="users" element={<UserList />} />
          </Route>

          {/* Configuramos la ruta para el error 404 */}
          <Route path="*" element={<div>Página no encontrada - 404</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}