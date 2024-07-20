import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Global } from '../../../helpers/Global';
import '../../../assets/css/mainContent.css';
import RecipeCard from './RecipeCard';

export const MainContent = () => {
  // Estado para almacenar las recetas
  const [recipes, setRecipes] = useState([]);

  // useEffect se ejecuta una vez después del primer renderizado del componente
  useEffect(() => {
    // Función asincrónica para obtener las recetas desde el servidor
    const fetchRecipes = async () => {
      try {
        // Realiza una solicitud para obtener las recetas
        const response = await fetch(Global.url + "recipes/preview-Recipes");
        if (!response.ok) {
          throw new Error('Error al obtener las recetas');
        }
        const data = await response.json();

        // Para cada receta, obtiene las reseñas y calcula la calificación promedio
        const recipesWithReviews = await Promise.all(
          data.previews.map(async (recipe) => {
            // Realiza una solicitud para obtener las reseñas de la receta
            const reviewsResponse = await fetch(Global.url + `reviews/show-by-recipe/${recipe._id}`);
            const reviewsData = await reviewsResponse.json();

            // Calcula la calificación promedio
            const averageRating = reviewsData.recipe_review.docs.reduce((acc, review) => acc + review.rating, 0) / reviewsData.recipe_review.docs.length;

            // Busca la calificación del usuario actual
            const userReview = reviewsData.recipe_review.docs.find(review => review.user === localStorage.getItem('userId'));

            // Añade las calificaciones a la receta
            recipe.averageRating = averageRating || 0;
            recipe.userRating = userReview ? userReview.rating : 0;
            return recipe;
          })
        );

        // Actualiza el estado con las recetas y sus calificaciones
        setRecipes(recipesWithReviews);
      } catch (error) {
        console.error(error);
      }
    };

    // Llama a la función para obtener las recetas
    fetchRecipes();
  }, []); // El array vacío asegura que useEffect se ejecute solo una vez

  return (
    <div>
      <div>
        {/* Componente de carrusel para mostrar imágenes */}
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://cdn.hellofresh.com/es/cms/SEO/recipes/albondigas-caseras-de-cerdo-con-salsa-barbacoa.jpeg"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://s3.abcstatics.com/media/gurmesevilla/2012/01/comida-rapida-casera.jpg"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://www.dzoom.org.es/wp-content/uploads/2019/04/fotografia-de-comida-platos7-810x540.jpg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="container mt-4 mb-4">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {/* Mapea y muestra las recetas utilizando el componente RecipeCard */}
          {recipes.map(recipe => (
            <div key={recipe._id} className="col">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};