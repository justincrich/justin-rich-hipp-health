"use client";
import {
  DIETARY_PREFERENCE,
  DietaryPreference,
  INGREDIENTS,
  Ingredient,
  isDiateryPreference,
  isIngredient,
} from "@/constants";
import React from "react";
import { useImmerReducer } from "use-immer";

type State = {
  ingredient: Ingredient | null;
  dietaryPreference: DietaryPreference | null;
  servingCount: number | null;
  isLoading: boolean;
  error: Error | null;
  validationError: string[];
  recipe: string;
  lasRecipeInputs: Pick<
    State,
    "ingredient" | "dietaryPreference" | "servingCount"
  > | null;
};

const initialState: State = {
  isLoading: false,
  error: null,
  ingredient: null,
  dietaryPreference: null,
  servingCount: null,
  validationError: [],
  recipe: "",
  lasRecipeInputs: null,
};

enum Action {
  SET_VALUE = "SET_VALUE",
  SET_VALIDATION_ERROR = "SET_VALIDATION_ERROR",
  SUBMIT = "SUBMIT",
  ERROR = "ERROR",
  SET_RECIPE = "SET_RECIPE",
}

type ActionType<K extends Action, P = undefined> = {
  type: K;
  payload: P;
};

type Actions =
  | ActionType<
      Action.SET_VALUE,
      Partial<Pick<State, "dietaryPreference" | "ingredient" | "servingCount">>
    >
  | ActionType<Action.SET_VALIDATION_ERROR, string[]>
  | ActionType<Action.ERROR, Error>
  | ActionType<
      Action.SUBMIT,
      {
        ingredient: Ingredient;
        dietaryPreference: DietaryPreference;
        servingCount: number;
      }
    >
  | ActionType<Action.SET_RECIPE, string>;

export default function Home() {
  const [state, dispatch] = useImmerReducer<State, Actions>((draft, action) => {
    switch (action.type) {
      case Action.SET_VALUE:
        Object.assign(draft, action.payload);
        break;
      case Action.SET_VALIDATION_ERROR:
        draft.validationError = action.payload;
        break;
      case Action.ERROR:
        draft.error = action.payload;
        draft.isLoading = false;
        break;
      case Action.SUBMIT:
        draft.error = null;
        draft.isLoading = true;
        draft.lasRecipeInputs = action.payload;
        break;
      case Action.SET_RECIPE:
        draft.isLoading = false;
        draft.error = null;
        draft.recipe = action.payload;
        break;
      default:
        break;
    }
  }, initialState);

  const validateFormValues = (): string[] => {
    const INPUT_KEYS = ["ingredient", "dietaryPreference", "servingCount"];
    const INVALID_KEYS: string[] = [];
    Object.entries(state).forEach(([key, value]) => {
      if (!INPUT_KEYS.includes(key)) return;
      if (value === null || value === 0) {
        INVALID_KEYS.push(key);
        return;
      }
    });
    dispatch({
      type: Action.SET_VALIDATION_ERROR,
      payload: INVALID_KEYS,
    });
    return INVALID_KEYS;
  };

  const fetchRecipe = async (recipeArgs: {
    ingredient: Ingredient;
    dietaryPreference: DietaryPreference;
    servingCount: number;
    lastRecipe?: string;
  }): Promise<void> => {
    dispatch({
      type: Action.SUBMIT,
      payload: recipeArgs,
    });
    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeArgs),
      });
      const data = await res.json();
      const { recipe = "" } = data || {};
      dispatch({ type: Action.SET_RECIPE, payload: recipe });
    } catch (e: any) {
      dispatch({ type: Action.ERROR, payload: e });
    }
  };
  const handleSubmitRecipe = async (): Promise<void> => {
    console.log("generate recipe");
    const { servingCount, dietaryPreference, ingredient, recipe = "" } = state;
    const INVALID_KEYS = validateFormValues();
    if (
      INVALID_KEYS.length > 0 ||
      !ingredient ||
      !dietaryPreference ||
      !servingCount
    )
      return;
    const recipeArgs = {
      ingredient,
      dietaryPreference,
      servingCount,
      lastRecipe: recipe,
    };
    return fetchRecipe(recipeArgs);
  };
  const handleRegenerateRecipe = async (): Promise<void> => {
    const { servingCount, dietaryPreference, ingredient } =
      state.lasRecipeInputs ?? {};
    if (!ingredient || !servingCount || !dietaryPreference) return;
    return fetchRecipe({
      ingredient,
      dietaryPreference,
      servingCount,
    });
  };
  return (
    <main className="relative flex min-h-screen flex-col items-start p-24">
      <h1 className="text-4xl pb-8">Justin&apos;s Recipe Generator</h1>
      <div className="grid gap-2 grid-cols-1 w-full">
        <div className="flex flex-col">
          <span>Ingredient</span>
          <select
            className={STYLES.INPUT_STYLES}
            name="ingredient"
            onChange={(e) => {
              if (!isIngredient(e.target.value)) return;
              dispatch({
                type: Action.SET_VALUE,
                payload: {
                  ingredient: e.target.value,
                },
              });
            }}
            value={state.ingredient ?? ""}
          >
            {["", ...INGREDIENTS].map((ingredient) => (
              <option key={ingredient} value={ingredient}>
                {ingredient}
              </option>
            ))}
          </select>
          {state.validationError.includes("ingredient") ? (
            <span className={STYLES.ERROR_TEXT}>required</span>
          ) : null}
        </div>
        <div className="flex flex-col">
          <span>Dietary Preference</span>
          <select
            className={STYLES.INPUT_STYLES}
            onChange={(e) => {
              if (!isDiateryPreference(e.target.value)) return;
              dispatch({
                type: Action.SET_VALUE,
                payload: {
                  dietaryPreference: e.target.value,
                },
              });
            }}
            value={state.dietaryPreference ?? "Select preference"}
          >
            {["", ...DIETARY_PREFERENCE].map((dietaryPreference) => (
              <option key={dietaryPreference} value={dietaryPreference}>
                {dietaryPreference}
              </option>
            ))}
          </select>
          {state.validationError.includes("dietaryPreference") ? (
            <span className={STYLES.ERROR_TEXT}>required</span>
          ) : null}
        </div>
        <div className="flex flex-col">
          <span>Serving Count</span>
          <input
            type="number"
            className={STYLES.INPUT_STYLES}
            onChange={(e) => {
              if (isNaN(Number(e.target.value))) return;
              dispatch({
                type: Action.SET_VALUE,
                payload: {
                  servingCount: Number(e.target.value),
                },
              });
            }}
            value={state.servingCount ?? ""}
          />
          {state.validationError.includes("servingCount") ? (
            <span className={STYLES.ERROR_TEXT}>
              Must have value greater than 0
            </span>
          ) : null}
        </div>
        <button
          type="submit"
          className={
            STYLES.BUTTON_STYLES +
            ` mt-8 ${state.isLoading ? STYLES.DISABLED : ""}`
          }
          onClick={handleSubmitRecipe}
          disabled={state.isLoading}
        >
          Generate Recipe
        </button>
        {state.isLoading ? (
          <div className="rounded border-2 p-8 text-2xl z-10 absolute flex flex-col mt-8 w-200 h-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90">
            Loading...
          </div>
        ) : null}
        {state.recipe ? (
          <div className="flex flex-col mt-8 w-full">
            <div className="flex flex-row w-full justify-between">
              <h1 className="text-4xl my-2">Recipe</h1>
              <button
                className={
                  STYLES.BUTTON_STYLES +
                  ` ${state.isLoading ? STYLES.DISABLED : ""}`
                }
                onClick={handleRegenerateRecipe}
                disabled={state.isLoading}
              >
                Generate Again
              </button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: state.recipe }} />
          </div>
        ) : null}
      </div>
    </main>
  );
}

const STYLES = {
  ERROR_TEXT: "text-red-400",
  INPUT_STYLES: "border border-gray-300 rounded-md p-2 w-64",
  BUTTON_STYLES:
    "border border-gray-300 rounded-md p-2 w-64 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
  DISABLED: `opacity-50 cursor-not-allowed`,
};
