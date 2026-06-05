import { test } from "@playwright/test";

/**
 * Decorator that wraps a class method in a Playwright test.step.
 *
 * @example Static step name:
 * @step('Open login page')
 * async openLoginPage() { ... }
 *
 * @example Dynamic step name:
 * @step(username => `Login as user ${username}`)
 * async login(username: string) { ... }
 *
 * @remarks Default parameter values are not applied before the decorator runs.
 * Pass explicit values from the call site or handle defaults in the step message function.
 */
export function step(message?: string | ((...args: any[]) => string)) {
  return function (target: Function, context: ClassMethodDecoratorContext) {
    return async function (this: any, ...args: any[]) {
      const stepName =
        typeof message === "function" ? message(...args) : (message ?? String(context.name));

      return test.step(stepName, async () => target.apply(this, args));
    };
  };
}
