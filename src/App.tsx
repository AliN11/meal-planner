import React, { useState, useMemo, useEffect } from "react";
import { Plus, ChefHat } from "lucide-react";
import { Button } from "./components/ui/button";
import { MealCard } from "./components/MealCard";
import { MealForm } from "./components/MealForm";
import { FilterButtons } from "./components/FilterButtons";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Meal, MealFormData, FilterType } from "./types/meal";

function App() {
  const [meals, setMeals] = useLocalStorage<Meal[]>("meals", []);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Generate unique ID for new meals
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Add new meal
  const handleAddMeal = (formData: MealFormData) => {
    const newMeal: Meal = {
      id: generateId(),
      name: formData.name,
      description: formData.description || "",
      difficulty: formData.difficulty,
      ingredients: formData.ingredients
        ? formData.ingredients
            .split(",")
            .map((ingredient) => ingredient.trim())
            .filter((ingredient) => ingredient.length > 0)
        : [],
      cookingTime: formData.cookingTime ? parseInt(formData.cookingTime) : 0,
      servings: formData.servings ? parseInt(formData.servings) : 0,
      createdAt: new Date(),
    };

    setMeals((prevMeals) => [newMeal, ...prevMeals]);
    setShowForm(false);
  };

  // Delete meal
  const handleDeleteMeal = (id: string) => {
    setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id));
  };

  // Filter meals based on active filter
  const filteredMeals = useMemo(() => {
    if (activeFilter === "all") {
      return meals;
    }
    return meals.filter((meal) => meal.difficulty === activeFilter);
  }, [meals, activeFilter]);

  // Calculate meal counts for filter buttons
  const mealCounts = useMemo(() => {
    const counts = {
      all: meals.length,
      easy: 0,
      medium: 0,
      hard: 0,
    };

    meals.forEach((meal) => {
      counts[meal.difficulty]++;
    });

    return counts;
  }, [meals]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  مدیریت غذاها
                </h1>
                <p className="text-sm text-muted-foreground">
                  غذاهای خود را بر اساس سطح دشواری سازماندهی کنید
                  {!isOnline && (
                    <span className="mr-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      حالت آفلاین
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} disabled={showForm}>
              <Plus className="h-4 w-4 ml-2" />
              افزودن غذا
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {showForm && (
          <div className="mb-8">
            <MealForm
              onSubmit={handleAddMeal}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {meals.length > 0 && (
          <FilterButtons
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            mealCounts={mealCounts}
          />
        )}

        {/* Meals Grid */}
        {filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onDelete={handleDeleteMeal} />
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              هنوز غذایی اضافه نکرده‌اید
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              شروع به ساختن مجموعه غذاهای خود کنید. آنها را بر اساس سطح دشواری
              دسته‌بندی کنید تا برنامه‌ریزی غذا آسان‌تر شود!
            </p>
            <Button onClick={() => setShowForm(true)} size="lg">
              <Plus className="h-5 w-5 ml-2" />
              اولین غذای خود را اضافه کنید
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              هیچ غذای{" "}
              {activeFilter === "easy"
                ? "آسان"
                : activeFilter === "medium"
                ? "متوسط"
                : activeFilter === "hard"
                ? "سخت"
                : ""}{" "}
              یافت نشد
            </h2>
            <p className="text-muted-foreground mb-6">
              فیلتر دشواری متفاوتی انتخاب کنید یا غذاهای بیشتری اضافه کنید.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setActiveFilter("all")} variant="outline">
                نمایش همه غذاها
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 ml-2" />
                افزودن غذا
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              مدیریت غذاها - سازمان‌دهنده شخصی دستور پخت شما
              {!isOnline && (
                <span className="block mt-1 text-yellow-600">
                  کار در حالت آفلاین - تمام تغییرات به‌صورت محلی ذخیره می‌شود
                </span>
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
