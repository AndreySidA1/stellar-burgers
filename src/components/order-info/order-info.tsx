import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchOrderByNumber } from '../../services/slices/feedSlice';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const orderData = useSelector((state) => state.feed.currentOrder);
  const ingredients: TIngredient[] = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (number && (!orderData || orderData.number !== Number(number))) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [number, dispatch, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
