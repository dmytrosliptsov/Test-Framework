export type HomePageExpectations = {
  titlePattern: RegExp;
  getStartedUrlPattern: RegExp;
};

export function createHomePageExpectations(): HomePageExpectations {
  return {
    titlePattern: /Playwright/,
    getStartedUrlPattern: /intro/,
  };
}
