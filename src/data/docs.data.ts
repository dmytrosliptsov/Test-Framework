export type DocsPageExpectations = {
  headingPattern: RegExp;
  urlPattern: RegExp;
  nextPageUrlPattern: RegExp;
};

export type SearchData = {
  query: string;
  resultPattern: RegExp;
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
