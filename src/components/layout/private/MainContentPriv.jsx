import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Global } from '../../../helpers/Global';
import '../../../assets/css/mainContent.css';
import RecipeCard from './RecipeCard';
import { Link } from 'react-router-dom';

export const MainContentPriv = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [randomRecipes, setRandomRecipes] = useState([]);

  const fetchRecipes = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(Global.url + `recipes/show-all-recipes?page=${page}`, {
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
      selectRandomRecipes(recipesWithReviews);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const selectRandomRecipes = (recipes) => {
    // Selecciona 3 recetas aleatorias (o menos si hay menos de 3 recetas disponibles)
    const randomSelections = [];
    const availableRecipes = [...recipes];

    while (randomSelections.length < 3 && availableRecipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableRecipes.length);
      randomSelections.push(availableRecipes.splice(randomIndex, 1)[0]);
    }

    setRandomRecipes(randomSelections);
  };

  useEffect(() => {
    fetchRecipes(currentPage);
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

  const handleReviewUpdated = (recipeId) => {
    fetchRecipes(currentPage); // Refetch recipes on review update
  };

  return (
    <div>
      <div>
        <Carousel>
          {randomRecipes.map((recipe, index) => (
            <Carousel.Item key={recipe._id}>
              {console.log(recipe)}
              <img
                className="d-block w-100"
                src={`${Global.url}recipes/media/${recipe.image}`} // Usa una imagen de marcador de posición si no hay imagen
                alt={`Slide ${index + 1}`}
              />
              <Carousel.Caption>
                <h3>{recipe.title}</h3>
                <Link to={`/colreceta/p/${recipe._id}`}>
                  <span className='btn custom-button fs-3 m-auto'>ver mas</span>
                </Link>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div className="container mt-4 mb-4">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {recipes.map(recipe => (
            <div key={recipe._id} className="col">
              <RecipeCard recipe={recipe} onReviewUpdated={handleReviewUpdated} />
            </div>
          ))}
        </div>
      </div>
      <div className="pagination-controls mt-4">
        <button
          className="btn btn-secondary fs-4"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="fs-4">Página {currentPage} de {totalPages}</span>
        <button
          className="btn btn-secondary fs-4"
          onClick={handleNextPage}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
