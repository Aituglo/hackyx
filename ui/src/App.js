import React, { useEffect, useState } from 'react';
import {
  Configure,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  useInstantSearch,
} from 'react-instantsearch';
const Typesense = require('typesense');
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const typesenseInfos = {
  apiKey: process.env.TYPESENSE_SEARCH_API_KEY,
  nodes: [
    {
      host: process.env.TYPESENSE_HOST,
      port: process.env.TYPESENSE_PORT,
      protocol: process.env.TYPESENSE_PROTOCOL,
    },
  ],
  connectionTimeoutSeconds: 2,
};

const typesenseClient = new Typesense.Client(typesenseInfos);

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: typesenseInfos,
  additionalSearchParameters: {
    query_by: 'title, description, tags, content',
    numTypos: 0,
    typoTokensThreshold: 1,
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const future = { preserveSharedStateOnUnmount: true };

export function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    typesenseClient
      .collections('contents')
      .retrieve()
      .then(function (collection) {
        setCount(collection.num_documents);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
        <div className="p-12 w-full sm:max-w-2xl sm:mx-auto">
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
                  <NoResultsBoundary fallback={<NoResults />}>
                    <Hits hitComponent={Hit} />
                    <div className="pagination flex justify-center pt-5">
                      <Pagination />
                    </div>
                  </NoResultsBoundary>
                </EmptyQueryBoundary>
              </div>
            </div>
          </InstantSearch>
        </div>
        <div className="footer-social-icons mt-auto pb-5">
          {count > 0 && (
            <h4 className="text-center">{count} contents indexed</h4>
          )}
          <h4 className="text-center">
            <a
              className="underline cursor-pointer"
              href="https://github.com/aituglo/hackyx"
              target="_blank"
            >
              Add a content
            </a>
          </h4>
          <ul className="social-icons text-center ">
            <li>
              <a
                href="https://x.com/aituglo"
                target="_blank"
                className="social-icon"
              >
                <i className="fa fa-twitter"></i>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/aituglo/hackyx"
                target="_blank"
                className="social-icon"
              >
                <i className="fa fa-github"></i>
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
      <br />
      <p>
        The aim of this project is to easily find any resource related to IT
        security like CTF writeups, articles or Bug Bounty reports.
      </p>
      <br />
      <p>
        Feel free to contribute on{' '}
        <a
          className="underline cursor-pointer"
          target="_blank"
          href="https://github.com/aituglo/hackyx"
        >
          Github
        </a>
        .
      </p>
    </div>
  );
}

function NoResultsBoundary({ children, fallback }) {
  const { results } = useInstantSearch();

  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <div>
      <p>
        No results for <q>{indexUiState.query}</q>.
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
                <div
                  key={tag}
                  className="px-1.5 py-0.5 text-xs font-medium text-center text-white bg-black rounded-md"
                >
                  {tag}
                </div>
              ))}
          </div>
        </h1>
      </div>
    </article>
  );
}
