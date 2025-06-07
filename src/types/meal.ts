export type MealDifficulty = "easy" | "medium" | "hard";
export type MealCategory = "breakfast" | "lunch" | "dinner" | "snacks";

export interface Meal {
  id: string;
  name: string;
  description: string;
  difficulty: MealDifficulty;
  categories: MealCategory[];
  ingredients: string[];
  cookingTime: number; // in minutes (0 if not provided)
  servings: number; // (0 if not provided)
  createdAt: Date;
}

export interface MealFormData {
  name: string;
  description: string;
  difficulty: MealDifficulty;
  categories: MealCategory[];
  ingredients: string;
  cookingTime: string;
  servings: string;
}

export type DifficultyFilterType = "all" | MealDifficulty;
export type CategoryFilterType = "all" | MealCategory;
