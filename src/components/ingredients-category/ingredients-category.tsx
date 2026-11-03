import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';
import { useSelector } from '../../services/store';

import type { TIngredientsCategoryProps } from './type';
import type { TConstructorState, TIngredient } from '@utils-types';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  const burgerConstructor: TConstructorState = useSelector((state) => ({
    bun: state.burgerConstructor.bun,
    ingredients: state.burgerConstructor.ingredients,
  }));

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: constructorIngredients } = burgerConstructor;
    const counters: Record<string, number> = {};

    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
