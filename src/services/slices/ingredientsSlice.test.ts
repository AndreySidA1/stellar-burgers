import reducer, { fetchIngredients } from './ingredientsSlice';
import type { TIngredient } from '../../utils/types';

const ingredient: TIngredient = { _id: '1', name: 'Булка', type: 'bun', proteins: 1, fat: 2, carbohydrates: 3, calories: 4, price: 100, image: '', image_large: '', image_mobile: '' };
const initial = { ingredients: [], loading: false, error: null };

describe('ingredients reducer', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initial);
  });
  it('pending включает загрузку и очищает ошибку', () => {
    expect(reducer({ ...initial, error: 'old' }, fetchIngredients.pending('request'))).toEqual({ ...initial, loading: true });
  });
  it('fulfilled сохраняет ингредиенты и завершает загрузку', () => {
    expect(reducer({ ...initial, loading: true }, fetchIngredients.fulfilled([ingredient], 'request'))).toEqual({ ...initial, ingredients: [ingredient] });
  });
  it('rejected завершает загрузку и сохраняет ошибку', () => {
    const action = fetchIngredients.rejected(new Error('Сбой'), 'request');
    expect(reducer({ ...initial, loading: true }, action)).toEqual({ ...initial, error: 'Сбой' });
  });
});
