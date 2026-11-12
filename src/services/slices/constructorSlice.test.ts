import reducer, { addIngredient, removeIngredient, moveIngredient, resetConstructor, setOrderRequest, setOrderModalData, orderBurger } from './constructorSlice';
import type { TIngredient, TOrder } from '../../utils/types';

const bun: TIngredient = { _id: 'bun', name: 'Булка', type: 'bun', proteins: 1, fat: 2, carbohydrates: 3, calories: 4, price: 100, image: '', image_large: '', image_mobile: '' };
const filling: TIngredient = { ...bun, _id: 'main', name: 'Начинка', type: 'main' };
const sauce: TIngredient = { ...bun, _id: 'sauce', name: 'Соус', type: 'sauce' };
const first = { ...filling, id: 'first' };
const second = { ...sauce, id: 'second' };
const initial = { bun: null, ingredients: [], orderRequest: false, orderModalData: null };
const populated = { ...initial, bun: { ...bun, id: 'bun-id' }, ingredients: [first, second] };
const order: TOrder = { _id: 'order', number: 12345, name: 'Заказ', status: 'done', ingredients: ['bun'], createdAt: '', updatedAt: '' };

describe('burgerConstructor reducer', () => {
  it('неизвестный экшен возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initial);
  });
  it('добавляет булку', () => {
    expect(reducer(initial, addIngredient(bun)).bun).toEqual(expect.objectContaining(bun));
  });
  it('заменяет булку при повторном добавлении', () => {
    expect(reducer(populated, addIngredient({ ...bun, name: 'Новая булка' })).bun?.name).toBe('Новая булка');
  });
  it('добавляет начинку с уникальным id', () => {
    const firstState = reducer(initial, addIngredient(filling));
    const secondState = reducer(firstState, addIngredient(filling));
    expect(secondState.ingredients).toHaveLength(2);
    expect(secondState.ingredients[0]).toEqual(expect.objectContaining(filling));
    expect(secondState.ingredients[1]).toEqual(expect.objectContaining(filling));
    expect(secondState.ingredients[0].id).toEqual(expect.any(String));
    expect(secondState.ingredients[1].id).toEqual(expect.any(String));
    expect(secondState.ingredients[0].id).not.toBe(secondState.ingredients[1].id);
  });
  it('удаляет начинку по id', () => {
    expect(reducer(populated, removeIngredient('first')).ingredients).toEqual([second]);
  });
  it('перемещает начинку вверх', () => {
    expect(reducer(populated, moveIngredient({ index: 1, direction: 'up' })).ingredients).toEqual([second, first]);
  });
  it('перемещает начинку вниз', () => {
    expect(reducer(populated, moveIngredient({ index: 0, direction: 'down' })).ingredients).toEqual([second, first]);
  });
  it('не перемещает ингредиенты за границы массива', () => {
    const third = { ...filling, id: 'third' };
    const state = { ...populated, ingredients: [first, second, third] };
    expect(reducer(state, moveIngredient({ index: 0, direction: 'up' })).ingredients).toEqual([first, second, third]);
    expect(reducer(state, moveIngredient({ index: 2, direction: 'down' })).ingredients).toEqual([first, second, third]);
  });
  it('очищает конструктор', () => {
    expect(reducer(populated, resetConstructor())).toEqual(initial);
  });
  it('устанавливает состояние запроса', () => {
    expect(reducer(initial, setOrderRequest(true)).orderRequest).toBe(true);
  });
  it('устанавливает и очищает данные модального окна', () => {
    expect(reducer(initial, setOrderModalData(order)).orderModalData).toEqual(order);
    expect(reducer({ ...initial, orderModalData: order }, setOrderModalData(null)).orderModalData).toBeNull();
  });
  it('pending включает индикатор заказа', () => {
    expect(reducer(initial, orderBurger.pending('request', ['bun'])).orderRequest).toBe(true);
  });
  it('fulfilled сохраняет заказ и очищает конструктор', () => {
    expect(reducer({ ...populated, orderRequest: true }, orderBurger.fulfilled(order, 'request', ['bun']))).toEqual({ ...initial, orderModalData: order });
  });
  it('rejected завершает запрос без очистки конструктора', () => {
    expect(reducer({ ...populated, orderRequest: true }, orderBurger.rejected(new Error('Ошибка'), 'request', ['bun']))).toEqual(populated);
  });
});
