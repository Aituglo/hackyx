"use client";
import React, { useEffect, useState } from "react";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  Configure,
  InstantSearch,
  Pagination,
  SearchBox,
} from "react-instantsearch";
import { Filters } from "@/components/filters";
import { Footer } from "@/components/footer";
import { CustomHits } from "@/components/hit";
import { EmptyQueryBoundary, NoResults, NoResultsBoundary } from "@/components/search-helpers";
import {
  MixerVerticalIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const Typesense = require("typesense");

import "./index.css";

const typesenseInfos = {
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY || "",
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || "",
      port: process.env.NEXT_PUBLIC_TYPESENSE_PORT || "",
      protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "",
    },
  ],
  connectionTimeoutSeconds: 2,
};

const typesenseClient = new Typesense.Client(typesenseInfos);

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  // @ts-ignore
  server: typesenseInfos,
  additionalSearchParameters: {
    query_by: "title, description, tags, content, cwe, program, source",
    numTypos: "0",
    typoTokensThreshold: 1,
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const future = { preserveSharedStateOnUnmount: true };

export default function App() {
  
  const [count, setCount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    typesenseClient
      .collections("contents")
      .retrieve()
      .then(function (collection: any) {
        setCount(collection.num_documents);
      })
      .catch(function (error: any) {
        console.log(error);
      });
  }, []);

  return (
    <div className="dark:bg-slate-900 bg-slate-100">
      <div className="min-h-screen flex flex-col justify-center">
        <div className="pt-12 md:p-12 p-1 w-full sm:mx-auto">
          <h1 className="text-center pb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-500 text-7xl font-black">
            Hackyx.
          </h1>
          <InstantSearch
            searchClient={searchClient}
            indexName="contents"
            future={future}
          >
            <Configure hitsPerPage={5} />
            <div className="flex">
              <div className="flex-auto justify-center">
                <div className="relative p-3 w-full">
                  <div className="relative group ">
                    <div className="absolute transitiona-all duration-1000 opacity-20 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-50 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                    <div className="overflow-hidden z-0 rounded-full relative p-3">
                      <SearchBox
                        classNames={{
                          root: "",
                          form: "relative flex z-50 bg-white rounded-full",
                          input:
                            "rounded-full flex-1 px-6 py-2 text-gray-700 focus:outline-none dark:bg-white",
                          reset: "pr-3",
                          loadingIndicator: "pr-3",
                        }}
                        placeholder="Search..."
                        submitIconComponent={() => (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="pr-4 hover:bg-transparent"
                            onClick={toggleDropdown}
                          >
                            <MixerVerticalIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:text-black" />
                          </Button>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <Filters isOpen={isOpen} setIsOpen={setIsOpen} />

                <div className="">
                  <EmptyQueryBoundary fallback={<></>}>
                    <NoResultsBoundary fallback={<NoResults />}>
                      <CustomHits />
                      <div className="pagination flex justify-center pt-5">
                        <Pagination
                          classNames={{
                            root: "flex",
                            list: "flex list-none",
                            item: "m-2 flex",
                            selectedItem: "underline font-bold",
                            disabledItem: "opacity-50 pointer-events-none",
                            link: "p-1",
                          }}
                        />
                      </div>
                    </NoResultsBoundary>
                  </EmptyQueryBoundary>
                </div>
              </div>
            </div>
          </InstantSearch>
        </div>
        <Footer count={count} />
      </div>
    </div>
  );
}
