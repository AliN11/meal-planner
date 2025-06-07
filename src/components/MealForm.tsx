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
  category: "lunch",
  ingredients: "",
  cookingTime: "",
  servings: "",
};

export const MealForm: React.FC<MealFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<MealFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<MealFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<MealFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام غذا الزامی است";
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
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              نوع وعده غذایی
            </label>
            <Select
              id="category"
              value={formData.category}
              onChange={(e) =>
                handleInputChange("category", e.target.value as MealCategory)
              }
            >
              <option value="breakfast">صبحانه</option>
              <option value="lunch">ناهار</option>
              <option value="dinner">شام</option>
              <option value="snacks">میان‌وعده</option>
            </Select>
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
