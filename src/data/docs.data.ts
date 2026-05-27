export type DocsPageExpectations = {
  headingPattern: RegExp;
  urlPattern: RegExp;
  nextPageUrlPattern: RegExp;
};

export type SearchData = {
  query: string;
  resultPattern: RegExp;
};

export type NavigationExpectations = {
  docsUrl: RegExp;
  apiUrl: RegExp;
  mcpUrl: RegExp;
  homeUrl: RegExp;
  writingTestsUrl: RegExp;
};

export function createDocsPageExpectations(): DocsPageExpectations {
  return {
    headingPattern: /Installation/,
    urlPattern: /docs\/intro/,
    nextPageUrlPattern: /writing-tests/,
  };
}

export function createSearchData(): SearchData {
  return {
    query: 'page object',
    resultPattern: /page/i,
  };
}

export function createNavigationExpectations(): NavigationExpectations {
  return {
    docsUrl: /docs\/intro/,
    apiUrl: /docs\/api\/class-playwright/,
    mcpUrl: /mcp\/introduction/,
    homeUrl: /playwright\.dev\/?$/,
    writingTestsUrl: /writing-tests/,
  };
}
