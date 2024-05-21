import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { RefinementList, useClearRefinements } from "react-instantsearch";

export const Filters = ({ isOpen, setIsOpen }) => {
  const { canRefine, refine } = useClearRefinements();

  return (
    <div className="relative pr-10">
      <div className="flex justify-end">
        {isOpen && (
          <div
            className="absolute right-0  w-72 rounded-md shadow-lg bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-4 px-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold">Filters</p>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Cross2Icon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:text-black" />
                </Button>
              </div>
              {canRefine && (
                <div className="flex justify-end mb-2">
                  <button onClick={refine} className="text-blue-600">
                    Clear
                  </button>
                  </div>
                )}

              <div className="border-t border-gray-200">
                <Accordion title="Tags">
                  <RefinementList
                    attribute="tags"
                    searchable={true}
                    searchablePlaceholder="Search tags..."
                    showMore={true}
                    showMoreLimit={10}
                    limit={5}
                    classNames={{
                      root: "",
                      list: "list-none",
                      searchBox: "refinement-search",
                      item: "my-2 flex items-center",
                      selectedItem: "text-blue-600",
                      label: "flex items-center cursor-pointer",
                      checkbox: "mr-2",
                      labelText: "flex-grow",
                      count: "ml-2 text-gray-600",
                      showMore: "text-blue-600",
                    }}
                  />
                </Accordion>
                <Accordion title="CWE">
                  <RefinementList
                    attribute="cwe"
                    searchable={true}
                    searchablePlaceholder="Search cwe..."
                    showMore={true}
                    showMoreLimit={10}
                    limit={5}
                    classNames={{
                      root: "",
                      list: "list-none",
                      searchBox: "refinement-search",
                      item: "my-2 flex items-center",
                      selectedItem: "text-blue-600",
                      label: "flex items-center cursor-pointer",
                      checkbox: "mr-2",
                      labelText: "flex-grow",
                      count: "ml-2 text-gray-600",
                      showMore: "text-blue-600",
                    }}
                  />
                </Accordion>
                <Accordion title="Program">
                  <RefinementList
                    attribute="program"
                    searchable={true}
                    searchablePlaceholder="Search program..."
                    showMore={true}
                    showMoreLimit={10}
                    limit={5}
                    classNames={{
                      root: "",
                      list: "list-none",
                      searchBox: "refinement-search",
                      item: "my-2 flex items-center",
                      selectedItem: "text-blue-600",
                      label: "flex items-center cursor-pointer",
                      checkbox: "mr-2",
                      labelText: "flex-grow",
                      count: "ml-2 text-gray-600",
                      showMore: "text-blue-600",
                    }}
                  />
                </Accordion>
                <Accordion title="Source">
                  <RefinementList
                    attribute="source"
                    searchable={true}
                    searchablePlaceholder="Search source..."
                    showMore={true}
                    showMoreLimit={10}
                    limit={5}
                    classNames={{
                      root: "",
                      list: "list-none",
                      searchBox: "refinement-search",
                      item: "my-2 flex items-center",
                      selectedItem: "text-blue-600",
                      label: "flex items-center cursor-pointer",
                      checkbox: "mr-2",
                      labelText: "flex-grow",
                      count: "ml-2 text-gray-600",
                      showMore: "text-blue-600",
                    }}
                  />
                </Accordion>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full px-4 py-2 text-left dark:text-white text-gray-700 focus:outline-none"
        onClick={toggleAccordion}
      >
        <span className="flex justify-between">
          {title}
          <span>{isOpen ? "-" : "+"}</span>
        </span>
      </button>
      {isOpen && <div className="px-2 py-2">{children}</div>}
    </div>
  );
};
