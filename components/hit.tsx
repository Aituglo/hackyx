import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Hits,
  useRefinementList,
  useCurrentRefinements,
} from "react-instantsearch";

export const CustomHits = () => {
  const filters = {
    currentFilters: useCurrentRefinements().items,
    tags: useRefinementList({ attribute: "tags" }),
    cwe: useRefinementList({ attribute: "cwe" }),
    program: useRefinementList({ attribute: "program" }),
    source: useRefinementList({ attribute: "source" }),
  };

  const isRefined = (attribute: string, value: string) => {
    const currentAppliedFilters = filters.currentFilters.find(
      (item) => item.attribute === attribute,
    );

    if (currentAppliedFilters) {
      return currentAppliedFilters.refinements.some(
        (item) => item.value === value,
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

const Hit = ({
  hit,
  filters,
  isRefined,
}: {
  hit: any;
  filters: any;
  isRefined: any;
}) => {
  return (
    <Card className="mb-2 dark:bg-slate-700">
      <CardHeader>
        <CardTitle>
          <a href={hit.url} target="_blank">
            {hit.title}
          </a>
        </CardTitle>
        <CardDescription>{hit.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex gap-1">
          {hit.source && (
            <div
              onClick={() => filters.source.refine(hit.source)}
              className="px-1.5 py-0.5 text-xs font-medium text-center text-white bg-green-800 rounded-md cursor-pointer"
            >
              {isRefined("source", hit.source) && "x"} {hit.source}
            </div>
          )}
          {hit.program && (
            <div
              onClick={() => filters.program.refine(hit.program)}
              className="px-1.5 py-0.5 text-xs font-medium text-center text-white bg-sky-800 rounded-md cursor-pointer"
            >
              {isRefined("program", hit.program) && "x"} {hit.program}
            </div>
          )}
          {hit.tags &&
            hit.tags.map((tag: string) => (
              <div
                key={tag}
                onClick={() => filters.tags.refine(tag)}
                className="px-1.5 py-0.5 text-xs font-medium text-center text-white bg-black rounded-md cursor-pointer"
              >
                {isRefined("tags", tag) && "x"} {tag}
              </div>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
};
