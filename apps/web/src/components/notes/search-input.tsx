"use client";

import { useSignalValue } from "@lexical/react/useExtensionSignalValue";
import { SearchIcon, XIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { searchQuery } from "@/lib/search-query";

export function SearchInput() {
  const query = useSignalValue(searchQuery);

  return (
    <InputGroup>
      <InputGroupInput
        type="text"
        role="searchbox"
        aria-label="Search notes"
        placeholder="Search notes"
        value={query}
        onChange={(event) => {
          searchQuery.value = event.target.value;
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && query !== "") {
            event.preventDefault();
            searchQuery.value = "";
          }
        }}
      />
      <InputGroupAddon align={"inline-start"}>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align={"inline-end"}>
        {query === "" ? null : (
          <InputGroupButton
            aria-label="Clear search"
            size="icon-xs"
            onClick={() => {
              searchQuery.value = "";
            }}
          >
            <XIcon />
          </InputGroupButton>
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}
