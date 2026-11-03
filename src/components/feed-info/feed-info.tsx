import { FeedInfoUI } from '@ui';
import { useSelector } from '../../services/store';

import type { TFeedState, TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const feed: TFeedState = useSelector((state) => ({
    orders: state.feed.orders,
    total: state.feed.total,
    totalToday: state.feed.totalToday,
    isLoading: state.feed.isLoading,
    error: state.feed.error,
  }));

  const orders: TOrder[] = useSelector((state) => state.feed.orders);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />;
};
