import { test as base, APIRequestContext, request } from '@playwright/test';

export type ApiFixtures = {
  apiContext: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  apiContext: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: process.env.BASE_URL ?? 'https://playwright.dev',
    });
    await use(apiContext);
    await apiContext.dispose();
  },
});
