import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);
  const isLoading = useSelector((state) => state.feed.isLoading);
  const error = useSelector((state) => state.feed.error);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className="text text_type_main-medium mt-10" style={{ textAlign: 'center', color: 'red' }}>
        Не удалось загрузить ленту заказов.<br/>
        Ошибка: {error}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text text_type_main-medium mt-10" style={{ textAlign: 'center' }}>
        Лента заказов пуста
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />;
};
