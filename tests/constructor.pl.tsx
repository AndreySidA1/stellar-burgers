import { test, expect, type Page } from '@playwright/test';

const bun = 'Тестовая булка';
const filling = 'Тестовая начинка';
const sauce = 'Тестовый соус';

async function add(page: Page, id: string) {
  await page.getByTestId(`ingredient-${id}`).getByRole('button', { name: 'Добавить' }).click();
}

async function assemble(page: Page) {
  await add(page, 'test-bun-1');
  await add(page, 'test-main-1');
  await add(page, 'test-sauce-1');
}

test.beforeEach(async ({ page, context }) => {
  // Any unmatched API call fails locally rather than reaching the real backend.
  await page.route('**/api/**', (route) => route.abort('blockedbyclient'));
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients', notFound: 'abort', update: false
  });
  await page.routeFromHAR('tests/hars/user.har', {
    url: '**/api/auth/user', notFound: 'abort', update: false
  });
  await page.routeFromHAR('tests/hars/order.har', {
    url: '**/api/orders', notFound: 'abort', update: false
  });
  await context.addCookies([{
    name: 'accessToken', value: 'mock-access-token',
    url: 'http://localhost:4000'
  }]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
  await page.goto('/');
  await expect(page.getByTestId('ingredient-test-bun-1')).toBeVisible();
});

test.describe('Конструктор бургера', () => {
  test('добавление булки отображает верх и низ, повторное добавление заменяет булку', async ({ page }) => {
    await add(page, 'test-bun-1');
    await expect(page.getByTestId('constructor-bun-1')).toContainText(`${bun} (верх)`);
    await expect(page.getByTestId('constructor-bun-2')).toContainText(`${bun} (низ)`);
    await add(page, 'test-bun-2');
    await expect(page.getByTestId('constructor-bun-1')).toContainText('Вторая булка (верх)');
    await expect(page.getByTestId('constructor-bun-2')).toContainText('Вторая булка (низ)');
  });

  test('добавление начинок и соусов', async ({ page }) => {
    await assemble(page);
    await expect(page.getByTestId('constructor-ingredients')).toContainText(filling);
    await expect(page.getByTestId('constructor-ingredients')).toContainText(sauce);
  });
});

test.describe('Модальное окно ингредиента', () => {
  test('показывает данные выбранного ингредиента и закрывается крестиком', async ({ page }) => {
    await page.getByTestId('ingredient-test-bun-1').getByRole('link').click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(bun);
    await expect(modal.getByRole('img', { name: 'изображение ингредиента.' })).toBeVisible();
    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal).toHaveCount(0);
    await expect(page.getByTestId('ingredient-test-bun-1')).toBeVisible();
  });

  test('показывает выбранную начинку и закрывается по оверлею', async ({ page }) => {
    await page.getByTestId('ingredient-test-main-1').getByRole('link').click();
    await expect(page.getByTestId('modal')).toContainText(filling);
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId('modal')).toHaveCount(0);
    await expect(page.getByTestId('ingredient-test-main-1')).toBeVisible();
  });
});

test.describe('Оформление заказа', () => {
  test('показывает номер заказа, очищает конструктор и закрывает окно', async ({ page }) => {
    await assemble(page);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText('12345');
    await expect(page.getByTestId('constructor-bun-1')).toHaveCount(0);
    await expect(page.getByTestId('constructor-bun-2')).toHaveCount(0);
    await expect(page.getByTestId('constructor-ingredients')).toContainText('Выберите начинку');
    await page.getByTestId('modal').getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByTestId('modal')).toHaveCount(0);
  });
});
