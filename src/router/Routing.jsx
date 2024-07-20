import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/public/PublicLayout';
import { PrivateLayout } from '../components/layout/private/PrivateLayout';
import { Register } from '../components/layout/user/Register';
import { AuthProvider } from '../context/AuthProvider';
import { Login } from '../components/layout/user/Login';
import { Logout } from '../components/layout/user/Logout';


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

          {/* Cargamos los componentes de la ruta privada  en rutas anidadas*/}
          <Route path="/colreceta" element={<PrivateLayout />}>
            <Route path='logout' element={<Logout />} />
          </Route>
        </Routes>

        {/* Configuramos la ruta para el error 404 */}

      </AuthProvider>
    </BrowserRouter>
  )
}