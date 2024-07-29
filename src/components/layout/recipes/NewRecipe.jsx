import React, { useState, useEffect } from 'react';
import { Global } from '../../../helpers/Global';
import '../../../assets/css/recipes/NewRecipe.css';
import { Link } from 'react-router-dom';
import RecipeCard from '../private/RecipeCard';  // Asegúrate de importar RecipeCard correctamente

export const NewRecipe = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    image: null,
  });
  const [feedback, setFeedback] = useState('');
  const [preview, setPreview] = useState(null); // Vista previa de la imagen
  const [recipes, setRecipes] = useState([]);

  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!userId || !token) {
          setFeedback('Usuario no autenticado o token faltante.');
          return;
        }

        const response = await fetch(`${Global.url}recipes/recipe-user/${userId}`, {
          headers: {
            'Authorization': token
          }
        });

        const data = await response.json();
        if (data.status === 'success') {
          // Obtener las recetas y agregar calificación promedio
          const recipesWithRatings = await Promise.all(data.recipes.map(async (recipe) => {
            // Obtener las reseñas para cada receta
            const reviewsResponse = await fetch(`${Global.url}reviews/show-by-recipe/${recipe._id}`);
            const reviewsData = await reviewsResponse.json();

            // Calcular la calificación promedio
            const averageRating = reviewsData.recipe_review.docs.length > 0 ?
              reviewsData.recipe_review.docs.reduce((acc, review) => acc + review.rating, 0) / reviewsData.recipe_review.docs.length
              : 0;

            return {
              ...recipe,
              averageRating
            };
          }));
          setRecipes(recipesWithRatings);
        } else {
          setFeedback('No se pudieron cargar las recetas.');
        }
      } catch (error) {
        setFeedback(`Error al cargar las recetas: ${error.message}`);
      }
    };

    if (userId) {
      fetchRecipes();
    } else {
      setFeedback('Usuario no encontrado.');
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setForm({
        ...form,
        [name]: file,
      });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const saveRecipe = async (e) => {
    e.preventDefault();
    setFeedback('');
    const token = localStorage.getItem('token');

    try {
      const recipeResponse = await fetch(`${Global.url}recipes/recipe`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          'Authorization': token
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          ingredients: form.ingredients,
          instructions: form.instructions,
        }),
      });

      if (!recipeResponse.ok) throw new Error('Error en la creación de la receta');

      const recipeData = await recipeResponse.json();
      if (recipeData.status === 'success') {
        setFeedback('Receta creada exitosamente');

        if (form.image) {
          const formData = new FormData();
          formData.append('file0', form.image);

          const uploadResponse = await fetch(`${Global.url}recipes/upload-media/${recipeData.recipeStored._id}`, {
            method: 'POST',
            body: formData,
            headers: {
              "Authorization": token,
            }
          });

          if (!uploadResponse.ok) throw new Error('Error en la carga de la imagen');

          const uploadData = await uploadResponse.json();
          if (uploadData.status === "success") {
            setFeedback('Imagen subida exitosamente');
          } else {
            setFeedback(`Error al subir la imagen: ${uploadData.message}`);
          }
        }

        // Actualiza la lista de recetas
        setRecipes(prevRecipes => [recipeData.recipeStored, ...prevRecipes]);
      } else {
        setFeedback(`Error al crear la receta: ${recipeData.message}`);
      }
    } catch (error) {
      setFeedback(`Error al enviar la petición: ${error.message}`);
    }
  };

  useEffect(() => {
    // Limpieza de la URL de vista previa al desmontar el componente
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className='new-piblic'>
      <div className='subNav'>Hola, bienvenido. Publica una nueva receta</div>

      <div className='o'>
        <div>
          <h3 className='fs-1'>Nueva Receta</h3>
          <p>Llena los siguientes campos para agregar una nueva receta a tu colección. Asegúrate de incluir todos los detalles necesarios para que otros puedan seguir tu receta fácilmente.</p>
        </div>
        <hr />
        <form onSubmit={saveRecipe}>
          <div className="l">
            <label className="form-label fs-5" htmlFor="title">Nombre de la Receta</label>
            <input type="text" name="title" className="input-from" placeholder="Ej. Tarta de Manzana" required onChange={handleChange} />
          </div>

          <div className="">
            <label className="form-label fs-5" htmlFor="description">Descripción</label>
            <input type="text" name="description" className="input-from" placeholder="Ej. Una deliciosa tarta de manzana con un toque de canela." required onChange={handleChange} />
          </div>

          <div className="">
            <label className="form-label fs-5" htmlFor="ingredients">Ingredientes</label>
            <textarea name="ingredients" className="input-from" placeholder="Ej. 2 manzanas, 1 taza de azúcar..." required onChange={handleChange}></textarea>
          </div>

          <div className="">
            <label className="form-label fs-5" htmlFor="instructions">Instrucciones</label>
            <textarea name="instructions" className="input-from" placeholder="Ej. Precalienta el horno a 180°C, mezcla los ingredientes..." required onChange={handleChange}></textarea>
          </div>

          <div className='cont-img'>
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Vista previa de la imagen" />
              </div>
            )}
            <div className="">
              <input type="file" name="image" className="input-from" onChange={handleChange} />
            </div>
          </div>

          <div className='container-btn-submit'>
            <button className='btn-submit' type="submit">Guardar Receta</button>
          </div>
        </form>
      </div>

      <div className='conten-recetas'>
        <div className='title-my-recipe m-4'><h2>Mis Recetas</h2></div>
        <div className=''>
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
        </div>
        <div className='ver-mas'>
          <Link to="/colreceta/profile" className="btn btn-dark custom-btn">
            ver todas mis recetas
          </Link>
        </div>
      </div>
    </div>
  );
};