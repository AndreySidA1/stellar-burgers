import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { orderBurgerApi } from '../../utils/burger-api';
import type { TConstructorState, TIngredient, TOrder } from '../../utils/types';

type TConstructorFullState = TConstructorState & {
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TConstructorFullState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
};

export const orderBurger = createAsyncThunk(
  'constructor/orderBurger',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  }
);

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredient & { id: string }>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => {
        return {
          payload: {
            ...ingredient,
            id: uuidv4(),
          },
        };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<{ index: number; direction: 'up' | 'down' }>) => {
      const { index, direction } = action.payload;
      if (direction === 'up' && index > 0) {
        const item = state.ingredients.splice(index, 1)[0];
        state.ingredients.splice(index - 1, 0, item);
      } else if (direction === 'down' && index < state.ingredients.length - 1) {
        const item = state.ingredients.splice(index, 1)[0];
        state.ingredients.splice(index + 1, 0, item);
      }
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      });
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  setOrderRequest,
  setOrderModalData
} = constructorSlice.actions;

export default constructorSlice.reducer;
