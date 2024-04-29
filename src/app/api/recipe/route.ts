import { model } from "@/ai/models";
import { isDiateryPreference, isIngredient } from "@/constants";
import { extractTagContents } from "@/xml";
import { NextResponse } from "next/server";
function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}
export const POST = async (request: Request) => {
  const body = await request.json();
  const { ingredient, dietaryPreference, servingCount, lastRecipe = "" } = body;

  if (
    !isIngredient(ingredient) ||
    (!!dietaryPreference && !isDiateryPreference(dietaryPreference)) ||
    isNullOrUndefined(servingCount) ||
    servingCount < 1
  ) {
    console.log(
      "Invalid input" +
        JSON.stringify({ ingredient, dietaryPreference, servingCount }, null, 2)
    );
    return new Response("Invalid input", { status: 400 });
  }

  try {
    const content = `Generate a new recipe ${
      lastRecipe
        ? "different than the recipe listed below the title LAST_RECIPE."
        : "."
    } The recipe must include the following ingredient:
    "${ingredient}"
    ${
      dietaryPreference
        ? `The recipe must also take into consideration the following dietary restriction:
    "${dietaryPreference}"`
        : ""
    }
  
    Your recipe must allow for a exactly ${servingCount} servings, be sure to list the serving size as well as amount per serving in your recipe.
    
    Your recipe must be formatted in HTML tags for readability. Use standard tailwind css styles for spacing, positioning, and font size/weight styling. Do not include any images in your HTML or color styling. The title of your recipe should be 2xl in size. If provided a previous recipe, use the same styles on the new recipe.
    
    Wrap your recipe output in the XML tags <output></output>
    
    ${lastRecipe ? `LAST_RECIPE: ${lastRecipe}` : ""}
    
    `;
    const response = await model.chat.completions.create({
      messages: [{ role: "user", content }],
      model: "gpt-3.5-turbo",
    });
    const [choice] = response.choices;
    const { content: nextAIMessage } = choice?.message || {};
    const [nextRecipe = ""] = await extractTagContents(
      nextAIMessage ?? "",
      "output"
    );
    return NextResponse.json({
      recipe: nextRecipe,
    });
  } catch (e) {
    console.error(e);
    return new Response("Error generating recipe", { status: 500 });
  }
};
