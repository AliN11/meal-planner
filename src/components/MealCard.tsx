import React from "react";
import { Trash2, Clock, Users, ChefHat } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Meal, MealDifficulty, MealCategory } from "../types/meal";

interface MealCardProps {
  meal: Meal;
  onDelete: (id: string) => void;
}

const difficultyColors: Record<MealDifficulty, string> = {
  easy: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  hard: "bg-red-100 text-red-800 border-red-200",
};

const difficultyLabels: Record<MealDifficulty, string> = {
  easy: "آسان",
  medium: "متوسط",
  hard: "سخت",
};

const difficultyIcons: Record<MealDifficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

const categoryColors: Record<MealCategory, string> = {
  breakfast: "bg-orange-100 text-orange-800 border-orange-200",
  lunch: "bg-blue-100 text-blue-800 border-blue-200",
  dinner: "bg-purple-100 text-purple-800 border-purple-200",
  snacks: "bg-pink-100 text-pink-800 border-pink-200",
};

const categoryLabels: Record<MealCategory, string> = {
  breakfast: "صبحانه",
  lunch: "ناهار",
  dinner: "شام",
  snacks: "میان‌وعده",
};

export const MealCard: React.FC<MealCardProps> = ({ meal, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderDifficultyStars = (difficulty: MealDifficulty) => {
    const stars = difficultyIcons[difficulty];
    return (
      <div className="flex items-center">
        {Array.from({ length: 3 }, (_, i) => (
          <ChefHat
            key={i}
            className={`w-4 h-4 ${
              i < stars ? "text-orange-500 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {meal.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              اضافه شده در {formatDate(meal.createdAt)}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(meal.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 mr-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {meal.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {meal.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                difficultyColors[meal.difficulty]
              }`}
            >
              {difficultyLabels[meal.difficulty]}
            </div>
            {meal.categories &&
              meal.categories.map((category) => (
                <div
                  key={category}
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[category]}`}
                >
                  {categoryLabels[category]}
                </div>
              ))}
          </div>
          {renderDifficultyStars(meal.difficulty)}
        </div>

        {(meal.cookingTime > 0 || meal.servings > 0) && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {meal.cookingTime > 0 && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 ml-1" />
                {meal.cookingTime} دقیقه
              </div>
            )}
            {meal.servings > 0 && (
              <div className="flex items-center">
                <Users className="w-4 h-4 ml-1" />
                {meal.servings} پرس
              </div>
            )}
          </div>
        )}

        {meal.ingredients.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">مواد لازم:</p>
            <div className="flex flex-wrap gap-1">
              {meal.ingredients.slice(0, 3).map((ingredient, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-sm text-xs"
                >
                  {ingredient}
                </span>
              ))}
              {meal.ingredients.length > 3 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground rounded-sm text-xs">
                  {meal.ingredients.length - 3}+ مورد دیگر
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
