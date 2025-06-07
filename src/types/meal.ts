export type MealDifficulty = "easy" | "medium" | "hard";

export interface Meal {
  id: string;
  name: string;
  description: string;
  difficulty: MealDifficulty;
  ingredients: string[];
  cookingTime: number; // in minutes (0 if not provided)
  servings: number; // (0 if not provided)
  createdAt: Date;
}

export interface MealFormData {
  name: string;
  description: string;
  difficulty: MealDifficulty;
  ingredients: string;
  cookingTime: string;
  servings: string;
}

export type FilterType = "all" | MealDifficulty;
