import { useInstantSearch } from "react-instantsearch";

export const EmptyQueryBoundary = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) => {
  const { indexUiState } = useInstantSearch();

  if (!indexUiState.query && !indexUiState.refinementList) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

export const NoResultsBoundary = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) => {
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

export const NoResults = () => {
  const { indexUiState } = useInstantSearch();

  return (
    <div>
      <p className="text-center">
        No results for <q>{indexUiState.query}</q>.
      </p>
    </div>
  );
}
