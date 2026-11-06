import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '../../utils/burger-api';
import type { TOrder, TOrdersData } from '../../utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  wsConnected: boolean;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  currentOrder: null,
  wsConnected: false,
  userOrders: [],
  userOrdersLoading: false,
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const data = await getFeedsApi();
  return data;
});

export const fetchOrderByNumber = createAsyncThunk('feed/fetchOrder', async (number: number) => {
  const data = await getOrderByNumberApi(number);
  return data.orders[0];
});

export const fetchUserOrders = createAsyncThunk('feed/fetchUserOrders', async () => {
  const data = await getOrdersApi();
  return data;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnect: (_state, _action: { payload: string }) => {
    },
    wsDisconnect: (_state) => {
      _state.wsConnected = false;
    },
    wsMessage: (state, action: { payload: TOrdersData }) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(fetchUserOrders.pending, (state) => { state.userOrdersLoading = true; })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.userOrdersLoading = false;
      });
  },
});

export const { wsConnect, wsDisconnect, wsMessage, clearCurrentOrder } = feedSlice.actions;
export default feedSlice.reducer;
