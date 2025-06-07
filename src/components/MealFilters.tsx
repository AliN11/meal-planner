import React from "react";
import { Button } from "./ui/button";
import {
  DifficultyFilterType,
  CategoryFilterType,
  MealCategory,
  MealDifficulty,
} from "../types/meal";

interface MealCounts {
  all: number;
  easy: number;
  medium: number;
  hard: number;
}

interface CategoryCounts {
  all: number;
  breakfast: number;
  lunch: number;
  dinner: number;
  snacks: number;
}

interface MealFiltersProps {
  activeDifficultyFilter: DifficultyFilterType;
  activeCategoryFilter: CategoryFilterType;
  onDifficultyFilterChange: (filter: DifficultyFilterType) => void;
  onCategoryFilterChange: (filter: CategoryFilterType) => void;
  mealCounts: MealCounts;
  categoryCounts: CategoryCounts;
}

const difficultyLabels: Record<DifficultyFilterType, string> = {
  all: "همه",
  easy: "آسان",
  medium: "متوسط",
  hard: "سخت",
};

const categoryLabels: Record<CategoryFilterType, string> = {
  all: "همه وعده‌ها",
  breakfast: "صبحانه",
  lunch: "ناهار",
  dinner: "شام",
  snacks: "میان‌وعده",
};

export const MealFilters: React.FC<MealFiltersProps> = ({
  activeDifficultyFilter,
  activeCategoryFilter,
  onDifficultyFilterChange,
  onCategoryFilterChange,
  mealCounts,
  categoryCounts,
}) => {
  const difficultyFilters: DifficultyFilterType[] = [
    "all",
    "easy",
    "medium",
    "hard",
  ];
  const categoryFilters: CategoryFilterType[] = [
    "all",
    "breakfast",
    "lunch",
    "dinner",
    "snacks",
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Difficulty Filters */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          فیلتر بر اساس سطح دشواری
        </h3>
        <div className="flex flex-wrap gap-2">
          {difficultyFilters.map((filter) => (
            <Button
              key={filter}
              variant={
                activeDifficultyFilter === filter ? "default" : "outline"
              }
              size="sm"
              onClick={() => onDifficultyFilterChange(filter)}
              className="flex items-center gap-2"
            >
              <span>{difficultyLabels[filter]}</span>
              <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-xs">
                {filter === "all"
                  ? mealCounts.all
                  : mealCounts[filter as MealDifficulty]}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          فیلتر بر اساس نوع وعده
        </h3>
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((filter) => (
            <Button
              key={filter}
              variant={activeCategoryFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryFilterChange(filter)}
              className="flex items-center gap-2"
            >
              <span>{categoryLabels[filter]}</span>
              <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-xs">
                {filter === "all"
                  ? categoryCounts.all
                  : categoryCounts[filter as MealCategory]}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
