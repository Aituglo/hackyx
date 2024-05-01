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
    <div>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
        <div class="p-12 w-full sm:max-w-2xl sm:mx-auto">
          <h1 className="text-center pt-20 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            HACKYX
          </h1>

          <InstantSearch
            searchClient={searchClient}
            indexName="contents"
            future={future}
          >
            <Configure hitsPerPage={5} />
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

                <EmptyQueryBoundary fallback={<Description />}>
                  <Hits hitComponent={Hit} />
                  <div className="pagination flex justify-center pt-5">
                    <Pagination />
                  </div>
                </EmptyQueryBoundary>
              </div>
            </div>
          </InstantSearch>
        </div>
        <div class="footer-social-icons mt-auto pb-5">
          <h4 class="text-center">
            <a
              className="underline cursor-pointer"
              href="https://forms.gle/WmPKmbA2M1XE7x2S9"
              target="_blank"
            >
              Add a content
            </a>
          </h4>
          <ul class="social-icons text-center ">
            <li>
              <a
                href="https://x.com/aituglo"
                target="_blank"
                class="social-icon"
              >
                <i class="fa fa-twitter"></i>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/aituglo/hackyx"
                target="_blank"
                class="social-icon"
              >
                <i class="fa fa-github"></i>
              </a>
            </li>
          </ul>
        </div>
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

function Description() {
  return (
    <div className="text-center pt-5">
      <p>Hackyx is a search engine for cybersecurity.</p>
      <p>
        It is built for the community so anyone can add a new content to it.
      </p>
      <br />
      <p>
        The aim of this project is to easily find any resource related to IT
        security like CTF writeup, article or Bug Bounty reports.
      </p>
      <br />
      <p>
        Feel free to contribute on the project on{' '}
        <a
          className="underline cursor-pointer"
          target="_blank"
          href="https://github.com/aituglo/hackyx"
        >
          Github
        </a>{' '}
        or by adding a new content{' '}
        <a
          className="underline cursor-pointer"
          target="_blank"
          href="https://forms.gle/WmPKmbA2M1XE7x2S9"
        >
          here
        </a>
      </p>
    </div>
  );
}

function Hit({ hit }) {
  return (
    <article>
      <div>
        <h1>
          <a
            href={hit.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-blue-500 hover:underline"
          >
            {hit.title}
          </a>
          {hit.description && <p>{hit.description}</p>}
          <div className="flex gap-0.5">
            {hit.tags &&
              hit.tags.map((tag) => (
                <div className="px-1.5 py-0.5 text-xs font-medium text-center text-white bg-black rounded-md">
                  {tag}
                </div>
              ))}
          </div>
        </h1>
      </div>
    </article>
  );
}
