import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { orderBurger, setOrderModalData } from '../../services/slices/constructorSlice';
import type { TConstructorState } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems: TConstructorState = useSelector((state) => ({
    bun: state.burgerConstructor.bun,
    ingredients: state.burgerConstructor.ingredients,
  }));
  const orderRequest = useSelector((state) => state.burgerConstructor.orderRequest);
  const orderModalData = useSelector((state) => state.burgerConstructor.orderModalData);
  const user = useSelector((state) => state.user.user);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    dispatch(orderBurger(ingredientsIds));
  };

  const closeOrderModal = (): void => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((s, v) => s + v.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
