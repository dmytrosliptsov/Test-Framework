export type HomePageExpectations = {
  titlePattern: RegExp;
  heroHeadingPattern: RegExp;
  getStartedUrlPattern: RegExp;
};

export function createHomePageExpectations(): HomePageExpectations {
  return {
    titlePattern: /Playwright/,
    heroHeadingPattern: /Playwright enables reliable/,
    getStartedUrlPattern: /intro/,
  };
}
