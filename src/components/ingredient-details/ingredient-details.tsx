import { Preloader, IngredientDetailsUI } from '@ui';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const ingredientData = ingredients.find((ing) => ing._id === id) || null;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
