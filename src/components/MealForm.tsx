import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select";
import { MealFormData, MealDifficulty, MealCategory } from "../types/meal";

interface MealFormProps {
  onSubmit: (meal: MealFormData) => void;
  onCancel: () => void;
}

const initialFormData: MealFormData = {
  name: "",
  description: "",
  difficulty: "easy",
  categories: ["lunch"],
  ingredients: "",
  cookingTime: "",
  servings: "",
};

const categoryLabels: Record<MealCategory, string> = {
  breakfast: "صبحانه",
  lunch: "ناهار",
  dinner: "شام",
  snacks: "میان‌وعده",
};

export const MealForm: React.FC<MealFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<MealFormData>(initialFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MealFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MealFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام غذا الزامی است";
    }
    if (formData.categories.length === 0) {
      newErrors.categories = "حداقل یک نوع وعده باید انتخاب شود";
    }
    if (
      formData.cookingTime &&
      (isNaN(Number(formData.cookingTime)) || Number(formData.cookingTime) <= 0)
    ) {
      newErrors.cookingTime = "زمان پخت باید عدد مثبت باشد";
    }
    if (
      formData.servings &&
      (isNaN(Number(formData.servings)) || Number(formData.servings) <= 0)
    ) {
      newErrors.servings = "تعداد پرس باید عدد مثبت باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData(initialFormData);
    }
  };

  const handleInputChange = (field: keyof MealFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCategoryChange = (category: MealCategory, checked: boolean) => {
    setFormData((prev) => {
      const newCategories = checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category);

      return { ...prev, categories: newCategories };
    });

    // Clear category error if at least one category is selected
    if (errors.categories && (checked || formData.categories.length > 1)) {
      setErrors((prev) => ({ ...prev, categories: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">
          افزودن غذای جدید
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              نام غذا *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-destructive" : ""}
              placeholder="نام غذا را وارد کنید"
            />
            {errors.name && (
              <p className="text-destructive text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              توضیحات
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-destructive" : ""}
              placeholder="توضیحات غذا..."
              rows={3}
            />
            {errors.description && (
              <p className="text-destructive text-xs mt-1">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium mb-1"
            >
              سطح دشواری
            </label>
            <Select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) =>
                handleInputChange(
                  "difficulty",
                  e.target.value as MealDifficulty
                )
              }
            >
              <option value="easy">آسان</option>
              <option value="medium">متوسط</option>
              <option value="hard">سخت</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              نوع وعده غذایی *
            </label>
            <div className="space-y-2">
              {(Object.keys(categoryLabels) as MealCategory[]).map(
                (category) => (
                  <div key={category} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={formData.categories.includes(category)}
                      onChange={(e) =>
                        handleCategoryChange(category, e.target.checked)
                      }
                      className="w-4 h-4 text-primary border-2 border-input rounded focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {categoryLabels[category]}
                    </label>
                  </div>
                )
              )}
            </div>
            {errors.categories && (
              <p className="text-destructive text-xs mt-1">
                {errors.categories}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ingredients"
              className="block text-sm font-medium mb-1"
            >
              مواد لازم
            </label>
            <Textarea
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => handleInputChange("ingredients", e.target.value)}
              className={errors.ingredients ? "border-destructive" : ""}
              placeholder="مواد لازم را وارد کنید (با کاما جدا کنید)"
              rows={3}
            />
            {errors.ingredients && (
              <p className="text-destructive text-xs mt-1">
                {errors.ingredients}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              مواد لازم را با کاما جدا کنید (مثال: مرغ، برنج، سبزیجات)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cookingTime"
                className="block text-sm font-medium mb-1"
              >
                زمان پخت (دقیقه)
              </label>
              <Input
                id="cookingTime"
                type="number"
                value={formData.cookingTime}
                onChange={(e) =>
                  handleInputChange("cookingTime", e.target.value)
                }
                className={errors.cookingTime ? "border-destructive" : ""}
                placeholder="30"
                min="1"
              />
              {errors.cookingTime && (
                <p className="text-destructive text-xs mt-1">
                  {errors.cookingTime}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="servings"
                className="block text-sm font-medium mb-1"
              >
                تعداد پرس
              </label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => handleInputChange("servings", e.target.value)}
                className={errors.servings ? "border-destructive" : ""}
                placeholder="4"
                min="1"
              />
              {errors.servings && (
                <p className="text-destructive text-xs mt-1">
                  {errors.servings}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 ml-2" />
              افزودن غذا
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              لغو
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
