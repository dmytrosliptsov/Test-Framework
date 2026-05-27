import { test, expect } from '../../src/fixtures';

test.describe('Playwright site HTTP @api', () => {
  test('homepage responds with 200 @api', async ({ apiContext }) => {
    await test.step('send GET request to /', async () => {
      const response = await apiContext.get('/');
      await test.step('verify status code is 200', async () => {
        expect(response.status()).toBe(200);
      });
    });
  });

  test('docs intro page responds with 200 @api', async ({ apiContext }) => {
    await test.step('send GET request to /docs/intro', async () => {
      const response = await apiContext.get('/docs/intro');
      await test.step('verify status code is 200', async () => {
        expect(response.status()).toBe(200);
      });
    });
  });
});
