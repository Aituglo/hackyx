import React, { useEffect, useState } from 'react';
import {
  Configure,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  RefinementList,
  useInstantSearch,
  useRefinementList,
  useCurrentRefinements,
  useClearRefinements,
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
    query_by: 'title, description, tags, content, cwe, program, source',
    numTypos: 0,
    typoTokensThreshold: 1,
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const future = { preserveSharedStateOnUnmount: true };

export function App() {
  const [count, setCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
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
        <div className="p-12 w-full sm:mx-auto">
          <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            HACKYX
          </h1>
          <InstantSearch
            searchClient={searchClient}
            indexName="contents"
            future={future}
          >
            <Configure hitsPerPage={5} />
            <div className={!isMobile ? 'flex' : undefined}>
              {showFilters && <Filters isMobile={isMobile} setShowFilters={setShowFilters} />}

              <div className="flex-auto justify-center">
                <div className="grid grid-cols-12">
                  <SearchBox
                    classNames={{
                      root: 'col-span-11 overflow-hidden z-0 rounded-full relative ',
                      form: 'relative z-50 bg-white rounded-full',
                      input: 'rounded-full text-gray-700 focus:outline-none',
                      submitIcon: 'hidden',
                    }}
                  />

                  <div className="col-span-1 pl-2">
                    <button
                      type="button"
                      onClick={handleShowFilters}
                      className="text-white bg-black font-medium rounded-full text-m p-2.5 text-center inline-flex items-center me-2"
                    >
                      <i className="fa fa-filter"></i>
                    </button>
                  </div>
                </div>

                <div className="pt-5">
                  <EmptyQueryBoundary fallback={<Description />}>
                    <NoResultsBoundary fallback={<NoResults />}>
                      <CustomHits />
                      <div className="pagination flex justify-center pt-5">
                        <Pagination />
                      </div>
                    </NoResultsBoundary>
                  </EmptyQueryBoundary>
                </div>
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

function Filters({ isMobile, setShowFilters }) {
  return isMobile ? (
    <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow ">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
            <h3 className="text-xl font-semibold text-gray-900 ">Filters</h3>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <ClearFilters />

            <h2 className="pt-5 mb-4 font-extrabold leading-none tracking-tight text-gray-900">
              Tags
            </h2>
            <RefinementList
              attribute="tags"
              searchable={true}
              showMore={true}
              limit={5}
            />
            <h2 className="pt-5 mb-4 font-extrabold leading-none tracking-tight text-gray-900">
              CWE
            </h2>
            <RefinementList attribute="cwe" searchable={true} />
            <h2 className="pt-5 mb-4 font-extrabold leading-none tracking-tight text-gray-900">
              Program
            </h2>
            <RefinementList attribute="program" searchable={true} />
            <h2 className="pt-5 mb-4 font-extrabold leading-none tracking-tight text-gray-900">
              Source
            </h2>
            <RefinementList attribute="source" searchable={true} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="pr-10 flex-0.5">
      <ClearFilters />

      <h2 className="pt-5 mb-4 font-extrabold leading-none tracking-tight text-gray-900">
        Tags
      </h2>
      <RefinementList
        attribute="tags"
        searchable={true}
        showMore={true}
        limit={5}
      />
      <h2 className="pt-5 mb-4 font-extrabold leading-none tracking-tight text-gray-900">
        CWE
      </h2>
      <RefinementList attribute="cwe" searchable={true} />
      <h2 className="pt-5 mb-4 font-extrabold leading-none tracking-tight text-gray-900">
        Program
      </h2>
      <RefinementList attribute="program" searchable={true} />
      <h2 className="pt-5 mb-4 font-extrabold leading-none tracking-tight text-gray-900">
        Source
      </h2>
      <RefinementList attribute="source" searchable={true} />
    </div>
  );
}

function ClearFilters() {
  const { canRefine, refine } = useClearRefinements();

  return (
    canRefine && (
      <div className="text-center">
        <button
          type="button"
          onClick={refine}
          className="text-white bg-black font-medium rounded-full text-m p-2.5 text-center inline-flex items-center me-2"
        >
          Reset filters
        </button>
      </div>
    )
  );
}

function CustomHits() {
  const filters = {
    currentFilters: useCurrentRefinements().items,
    tags: useRefinementList({ attribute: 'tags' }),
    cwe: useRefinementList({ attribute: 'cwe' }),
    program: useRefinementList({ attribute: 'program' }),
    source: useRefinementList({ attribute: 'source' }),
  };

  const isRefined = (attribute, value) => {
    const currentAppliedFilters = filters.currentFilters.find(
      (item) => item.attribute === attribute
    );

    if (currentAppliedFilters) {
      return currentAppliedFilters.refinements.some(
        (item) => item.value === value
      );
    }
  };

  return (
    <Hits
      hitComponent={({ hit }) => (
        <Hit hit={hit} filters={filters} isRefined={isRefined} />
      )}
    />
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
      <p className="text-center">
        No results for <q>{indexUiState.query}</q>.
      </p>
    </div>
  );
}

function Hit({ hit, filters, isRefined }) {
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
            {hit.source && (
              <div
                onClick={() => filters.source.refine(hit.source)}
                className="px-1.5 py-0.5 text-xs font-medium text-center text-white bg-green-800 rounded-md cursor-pointer"
              >
                {isRefined('source', hit.source) && 'x'} {hit.source}
              </div>
            )}
            {hit.program && (
              <div
                onClick={() => filters.program.refine(hit.program)}
                className="px-1.5 py-0.5 text-xs font-medium text-center text-white bg-sky-800 rounded-md cursor-pointer"
              >
                {isRefined('program', hit.program) && 'x'} {hit.program}
              </div>
            )}
            {hit.tags &&
              hit.tags.map((tag) => (
                <div
                  key={tag}
                  onClick={() => filters.tags.refine(tag)}
                  className="px-1.5 py-0.5 text-xs font-medium text-center text-white bg-black rounded-md cursor-pointer"
                >
                  {isRefined('tags', tag) && 'x'} {tag}
                </div>
              ))}
          </div>
        </h1>
      </div>
    </article>
  );
}
