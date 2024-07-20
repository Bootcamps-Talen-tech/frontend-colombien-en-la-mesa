import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Global } from '../../../helpers/Global';
import '../../../assets/css/mainContent.css';
import RecipeCard from './RecipeCard';
import { Link } from 'react-router-dom';

// Componente principal para mostrar el contenido privado
export const MainContentPriv = () => {

  // Declaración de estados usando useState
  const [recipes, setRecipes] = useState([]); // Estado para almacenar las recetas
  const [currentPage, setCurrentPage] = useState(1); // Estado para almacenar la página actual
  const [totalPages, setTotalPages] = useState(1); // Estado para almacenar el total de páginas

  // Función asíncrona para obtener recetas de la API
  const fetchRecipes = async (page = 1) => {
    try {
      const token = localStorage.getItem('token'); // Obtiene el token de autenticación del localStorage
      console.log('Token:', token);

      // Realiza la petición a la API para obtener las recetas
      const response = await fetch(Global.url + `recipes/show-all-recipes?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });
      console.log('Response status:', response.status);

      // Verifica si la respuesta es correcta
      if (!response.ok) {
        throw new Error('Error al obtener las recetas');
      }

      // Convierte la respuesta en JSON
      const data = await response.json();
      console.log('Data:', data);

      // Mapea cada receta para agregarle las reviews
      const recipesWithReviews = await Promise.all(
        data.recipes.map(async (recipe) => {
          // Realiza una petición para obtener las reviews de cada receta
          const reviewsResponse = await fetch(Global.url + `reviews/show-by-recipe/${recipe._id}`);
          const reviewsData = await reviewsResponse.json();
          console.log('Reviews Data:', reviewsData);

          // Calcula la calificación promedio de las reviews
          const averageRating = reviewsData.recipe_review.docs.reduce((acc, review) => acc + review.rating, 0) / reviewsData.recipe_review.docs.length;

          // Encuentra la review del usuario actual
          const userReview = reviewsData.recipe_review.docs.find(review => review.user === localStorage.getItem('userId'));

          // Añade las calificaciones a la receta
          recipe.averageRating = averageRating || 0;
          recipe.userRating = userReview ? userReview.rating : 0;
          return recipe;
        })
      );

      // Actualiza el estado con las recetas y las páginas
      setRecipes(recipesWithReviews);
      setCurrentPage(data.page);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Hook useEffect para obtener las recetas cuando cambia la página actual
  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage]);

  // Función para manejar el clic en el botón de página anterior
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para manejar el clic en el botón de página siguiente
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  // Render del componente
  return (
    <div>
      <div>
        <Carousel>
          {/* Primer elemento del carrusel */}
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://cdn.hellofresh.com/es/cms/SEO/recipes/albondigas-caseras-de-cerdo-con-salsa-barbacoa.jpeg"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <Link to="/rsocial/feed" >
                <span className='btn custom-button fs-3 btn-margin'>ver mas</span>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
          {/* Segundo elemento del carrusel */}
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://s3.abcstatics.com/media/gurmesevilla/2012/01/comida-rapida-casera.jpg"
              alt="Second slide"
            />
            <Carousel.Caption  >
              <h3>Second slide label</h3>
              <Link to="/rsocial/feed" >
                <span className='btn custom-button fs-3 btn-margin'>ver mas</span>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
          {/* Tercer elemento del carrusel */}
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://www.dzoom.org.es/wp-content/uploads/2019/04/fotografia-de-comida-platos7-810x540.jpg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <Link to="/rsocial/feed" >
                <span className='btn custom-button fs-3 btn-margin'>ver mas</span>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="container mt-4 mb-4">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {/* Mapea y renderiza cada receta usando el componente RecipeCard */}
          {recipes.map(recipe => (
            <div key={recipe._id} className="col">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </div>
      <div className="pagination-controls mt-4">
        {/* Botón para página anterior */}
        <button
          className="btn btn-secondary fs-4"
          onClick={handlePrevPage} // Manejar el clic en el botón "Anterior"
          disabled={currentPage === 1} // Deshabilitar el botón si está en la primera página
        >
          Anterior
        </button>
        <span className="fs-4">Página {currentPage} de {totalPages}</span>
        {/* Botón para página siguiente */}
        <button
          className="btn btn-secondary fs-4"
          onClick={handleNextPage} // Manejar el clic en el botón "Siguiente"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};