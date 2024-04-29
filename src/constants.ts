export const INGREDIENTS = [
  "Flour",
  "Sugar",
  "Eggs",
  "Butter",
  "Salt",
  "Baking powder",
  "Vanilla extract",
  "Milk",
  "Cinnamon",
  "Cocoa powder",
] as const;

export const isIngredient = (value: unknown): value is Ingredient => {
  if (typeof value !== "string") return false;
  return [...(INGREDIENTS as readonly string[])].includes(value);
};

export type Ingredient = (typeof INGREDIENTS)[number];

export const DIETARY_PREFERENCE = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Low-Carb",
  "Paleo",
  "Keto",
  "Lactose-Free",
  "Pescatarian",
  "Halal",
  "Kosher",
] as const;

export type DietaryPreference = (typeof DIETARY_PREFERENCE)[number];

export const isDiateryPreference = (
  value: unknown
): value is DietaryPreference => {
  if (typeof value !== "string") return false;
  return [...(DIETARY_PREFERENCE as readonly string[])].includes(value);
};
