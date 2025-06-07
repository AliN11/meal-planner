import React from "react";
import { Button } from "./ui/button";
import { FilterType } from "../types/meal";

interface FilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  mealCounts: Record<FilterType, number>;
}

const filterLabels: Record<FilterType, string> = {
  all: "همه",
  easy: "آسان",
  medium: "متوسط",
  hard: "سخت",
};

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilter,
  onFilterChange,
  mealCounts,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter)}
          className="flex items-center gap-2"
        >
          {filterLabels[filter]}
          <span className="text-xs bg-background text-foreground rounded-full px-2 py-0.5 min-w-[20px]">
            {mealCounts[filter]}
          </span>
        </Button>
      ))}
    </div>
  );
};
