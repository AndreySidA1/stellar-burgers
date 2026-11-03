import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/feedSlice';
import { getCookie } from '../../utils/cookie';

import type { TOrder } from '@utils-types';

interface IWSMessage {
  success: boolean;
}

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector((state) => state.feed.userOrders);
  const isLoading = useSelector((state) => state.feed.userOrdersLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());

    const token = getCookie('accessToken');
    if (token) {
      const ws = new WebSocket(`wss://norma.nomoreparties.space/orders?token=${token}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data) as IWSMessage;
        if (data.success) {
          dispatch(fetchUserOrders());
        }
      };

      return () => {
        ws.close();
      };
    }
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
