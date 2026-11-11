import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/feedSlice';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector((state) => state.feed.userOrders);
  const isLoading = useSelector((state) => state.feed.userOrdersLoading);

  useEffect(() => {
    void dispatch(fetchUserOrders());

  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
