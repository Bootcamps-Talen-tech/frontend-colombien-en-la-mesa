import '../../../assets/css/user/profile.css';
import React, { useEffect, useState } from 'react';
import { Global } from '../../../helpers/Global';
import RecipeCard from '../private/RecipeCard';
import { Link } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa'; // Asegúrate de instalar react-icons

export const Profile = () => {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [recipes, setRecipes] = useState([]); // Estado para almacenar las recetas
  const [currentPage, setCurrentPage] = useState(1); // Estado para almacenar la página actual
  const [totalPages, setTotalPages] = useState(1); // Estado para almacenar el total de páginas
  const [editMode, setEditMode] = useState(false); // Estado para gestionar el modo de edición
  const [file, setFile] = useState(null); // Estado para almacenar el archivo de imagen seleccionado
  const [uploading, setUploading] = useState(false); // Estado para gestionar el estado de carga

  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  // Función para obtener el perfil del usuario
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtiene el token de autenticación del localStorage

      const response = await fetch(`${Global.url}user/profile/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el perfil del usuario');
      }

      const data = await response.json();
      setUser(data.user); // Guarda los datos del usuario en el estado
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función asíncrona para obtener recetas de la API
  const fetchRecipes = async (page = 1) => {
    try {
      const token = localStorage.getItem('token'); // Obtiene el token de autenticación del localStorage

      const response = await fetch(`${Global.url}recipes/recipe-user/${userId}/${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las recetas');
      }

      const data = await response.json();

      const recipesWithReviews = await Promise.all(
        data.recipes.map(async (recipe) => {
          const reviewsResponse = await fetch(Global.url + `reviews/show-by-recipe/${recipe._id}`);
          const reviewsData = await reviewsResponse.json();

          const averageRating = reviewsData.recipe_review.docs.reduce((acc, review) => acc + review.rating, 0) / reviewsData.recipe_review.docs.length;

          const userReview = reviewsData.recipe_review.docs.find(review => review.user === localStorage.getItem('userId'));

          recipe.averageRating = averageRating || 0;
          recipe.userRating = userReview ? userReview.rating : 0;
          return recipe;
        })
      );

      setRecipes(recipesWithReviews);
      setCurrentPage(data.page);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Llama a la función para obtener el perfil del usuario
    fetchRecipes(currentPage); // Llama a la función para obtener las recetas cuando cambia la página actual
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleEditMode = () => {
    setEditMode(prevMode => !prevMode);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploading(true);
    const formData = new FormData();
    formData.append('file0', selectedFile); // Asegúrate de usar el mismo nombre que en el backend

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${Global.url}user/upload-image/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: token
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      // Actualiza la imagen del perfil después de subirla
      await fetchUserProfile();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div>
      <div>
        <div className="profile-containerr">
          <div className="profile-header">
            <div className="profile-pic-container">
              <img src={`${Global.url}user/image/${user?.image}`} alt="Profile" className="profile-pic" />
              <div className="camera-icon" onClick={() => document.getElementById('file-input').click()}>
                <FaCamera />
              </div>
              <input
                id="file-input"
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange} // Subida automática de imagen
              />
            </div>
            <h2 className="profile-name">@{user?.name}</h2>
          </div>
          <div className='sub-nav'>
            <ul>
              <Link className="decoration-link" to="/colreceta/new"><li>Nueva receta</li></Link>
              <li>Mis Recetas</li>
              <li onClick={toggleEditMode} style={{ cursor: 'pointer' }}>Editar</li>
            </ul>
          </div>
        </div>

        <div className='title-receta'>
          <p className='fs-1'>Mis recetas</p>
        </div>

        <div className="container mt-4 mb-4">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {recipes.map(recipe => (
              <div key={recipe._id} className="col">
                <RecipeCard recipe={recipe} editMode={editMode} />
              </div>
            ))}
          </div>
        </div>

        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Siguiente</button>
        </div>
      </div>
    </div>
  );
};