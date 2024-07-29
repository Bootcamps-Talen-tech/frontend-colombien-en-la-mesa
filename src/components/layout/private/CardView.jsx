import React, { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';
import '../../../assets/css/RecipeCard.css';
import { Global } from '../../../helpers/Global';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import foto from '../../../assets/img/mesa.jpg';
import { useParams } from 'react-router-dom';

export const CardView = () => {
  const { Id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [userRating, setUserRating] = useState(0); // Estado para la calificación del usuario
  const [comment, setComment] = useState(''); // Estado para el comentario del usuario
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        console.log("Fetching recipe details for cardId:", Id);

        const headers = {
          'Authorization': token,
          'Content-Type': 'application/json'
        };

        // Obtener detalles de la receta
        const recipeResponse = await fetch(`${Global.url}recipes/show-recipe/${Id}`, {
          headers: headers
        });
        const recipeData = await recipeResponse.json();
        console.log("Recipe data:", recipeData);

        // Obtener comentarios de la receta
        const reviewsResponse = await fetch(`${Global.url}reviews/show-by-recipe/${Id}`, {
          headers: headers
        });
        const reviewsData = await reviewsResponse.json();
        console.log("Reviews data:", reviewsData);

        // Obtener la información del usuario que hizo el comentario
        const usersPromises = reviewsData.recipe_review.docs.map(review =>
          fetch(`${Global.url}user/profile/${review.user}`, { headers: headers })
            .then(response => response.json())
        );
        const usersData = await Promise.all(usersPromises);

        // Añadir la información del usuario a cada comentario
        const reviewsWithUserData = reviewsData.recipe_review.docs.map((review, index) => ({
          ...review,
          user: usersData[index].user
        }));

        if (recipeData.status === 'error' || reviewsData.status === 'error') {
          console.error('Error fetching data:', recipeData.message || reviewsData.message);
          return;
        }

        const averageRating = reviewsWithUserData.reduce((acc, review) => acc + review.rating, 0) / reviewsWithUserData.length || 0;

        const userReview = reviewsWithUserData.find(review => review.user._id === localStorage.getItem('userId'));

        setRecipe({
          ...recipeData.publication,
          averageRating,
          userRating: userReview ? userReview.rating : 0,
          reviews: reviewsWithUserData
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchRecipeDetails();
  }, [Id]);

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      const headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${Global.url}reviews/add/${Id}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          recipeId: Id,
          userId: userId,
          rating: userRating,
          comment: comment
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Fetch the user data for the new review
        const userResponse = await fetch(`${Global.url}user/profile/${result.review_to_save.user}`, { headers: headers });
        const userData = await userResponse.json();

        // Update the review with user data
        const updatedReview = {
          ...result.review_to_save,
          user: userData.user
        };

        // Actualiza los comentarios y la calificación
        setRecipe(prevState => ({
          ...prevState,
          reviews: [...prevState.reviews, updatedReview],
          userRating: updatedReview.rating,
          averageRating: (prevState.averageRating * prevState.reviews.length + updatedReview.rating) / (prevState.reviews.length + 1)
        }));
        setComment('');
        setUserRating(0);
        setShowModal(true); // Muestra el modal después de enviar el comentario
      } else {
        console.error('Error submitting review:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!recipe) return <div>Cargando...</div>;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="card-view">
      <div className='container-div'>
        <div className='tex'>
          <div>
            <h2>{recipe.title}</h2>
          </div>
          <hr />
          <div className='date-container'>
            <p>{recipe.author.name}</p>
            <p className='date'>Fecha: {formatDate(recipe.created_at)}</p>
          </div>
          <hr />
        </div>

        <section className="recipe-image-section">
          <img
            src={`${Global.url}recipes/media/${recipe.image}`}
            alt="Imagen de la receta"
            className="recipe-image"
          />
          {console.log(recipe)}
        </section>
        <hr />

        <section className="ingredients-section">
          <div className="ingredients-container">
            <h2>Ingredientes</h2>
            <ul>
              {recipe.ingredients ? recipe.ingredients.split(',').map((ingredient, index) => (
                <li className="fs-3" key={index}>{ingredient}</li>
              )) : "No hay ingredientes disponibles"}
            </ul>
          </div>
        </section>
        <hr />
        <section className="cooking-section">
          <div className="cooking-container">
            <h2>Instrucciones</h2>
            <p>{recipe.instructions}</p>
          </div>
        </section>
      </div>

      <div className='container-div'>
        <section className="reviews-section">
          <img
            src={foto}
            alt="Imagen de la receta"
            className="recipe-image"
          />
          <hr />
          <div className="cont-califi">
            <span className='fs-4'>Calificación: </span>
            <StarRatings
              rating={recipe.averageRating}
              starRatedColor="gold"
              numberOfStars={5}
              starDimension="20px"
              starSpacing="1px"
              name='averageRating'
              readOnly
            />
          </div>
          <hr />

          <h3>Comentarios:</h3>

          <div className='content-comment'>
            {recipe.reviews.length === 0 ? (
              <p>No hay comentarios disponibles</p>
            ) : (
              recipe.reviews.map((review, index) => (
                <div className='comment' key={index}>
                  <div>
                    <div className='d-flex align-items-center'>
                      <img src={`${Global.url}user/image/${review.user.image}`} alt={`${review.user.name}`} className="user-image" />
                      <p className='fs-2 m-2'>{review.user.name}</p>
                    </div>
                    <p className='fs-4 ps-3'>{review.comment}</p>
                  </div>

                  <StarRatings
                    rating={review.rating}
                    starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="15px"
                    starSpacing="2px"
                    name='userRating'
                  />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="comment-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group form-grupo-2">
              <textarea
                className="form-control-commet"
                rows="3"
                value={comment}
                onChange={handleCommentChange}
                placeholder="Escribe tu comentario aquí"
                required
              />
            </div>
            <div className="form-group m-2">
              <StarRatings
                rating={userRating}
                starRatedColor="gold"
                changeRating={handleRatingChange}
                numberOfStars={5}
                starDimension="30px"
                starSpacing="2px"
                name='userRating'
              />
            </div>
            <Button className="custom-button custom-button-3" type="submit">
              Enviar 
            </Button>
          </form>
        </section>
      </div>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Comentario Enviado</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tu comentario ha sido enviado exitosamente.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};