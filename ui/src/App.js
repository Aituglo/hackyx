import React from 'react';
import {
  Configure,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  useInstantSearch,
} from 'react-instantsearch';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'test',
    nodes: [
      {
        host: 'localhost',
        port: 8108,
        protocol: 'http',
      },
    ],
  },
  additionalSearchParameters: {
    query_by: 'title, content',
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const future = { preserveSharedStateOnUnmount: true };

export function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <div class="relative p-12 w-full sm:max-w-2xl sm:mx-auto">
        <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">HACKYX</h1>

        <InstantSearch
          searchClient={searchClient}
          indexName="contents"
          future={future}
        >
          <Configure hitsPerPage={8} />
          <div className="search-panel">
            <div className="search-panel__results">
              <SearchBox
                classNames={{
                  root: 'overflow-hidden z-0 rounded-full relative p-3',
                  form: 'relative flex z-50 bg-white rounded-full',
                  input:
                    'rounded-full flex-1 px-10 py-4 text-gray-700 focus:outline-none',
                  submitIcon: 'hidden',
                }}
              />

              <EmptyQueryBoundary fallback={null}>
                <Hits hitComponent={Hit} />
                <div className="pagination">
                  <Pagination />
                </div>
              </EmptyQueryBoundary>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

function EmptyQueryBoundary({ children, fallback }) {
  const { indexUiState } = useInstantSearch();

  if (!indexUiState.query) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function Hit({ hit }) {
  return (
    <article>
      <div>
        <h1>
          <a href={hit.url} target='_blank' rel='noreferrer noopener' className="text-blue-500 hover:underline">
            {hit.title}
          </a>
        </h1>
      </div>
    </article>
  );
}
