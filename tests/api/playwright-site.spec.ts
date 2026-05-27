import { test, expect } from '../../src/fixtures';

test.describe('Playwright site HTTP @api', () => {
  test('homepage responds with 200 @api', async ({ apiContext }) => {
    const response = await apiContext.get('/');
    expect(response.status()).toBe(200);
  });

  test('docs intro page responds with 200 @api', async ({ apiContext }) => {
    const response = await apiContext.get('/docs/intro');
    expect(response.status()).toBe(200);
  });
});
