# Justin Rich's AI-Powered Recipe Generator

This web application generates unique recipes based on user-selected ingredients and dietary preferences. By leveraging OpenAI's powerful language model, the app creates personalized and creative recipe instructions tailored to the user's input.

## Features

- Simple and intuitive user interface
- Select ingredients from a predefined list or enter custom ingredients
- Specify dietary preferences (vegetarian, gluten-free, low-carb)
- Enter the desired number of servings
- Generate unique recipes with a single click
- "Generate New Recipe" button for requesting a new recipe without resubmitting the form
- Error handling for API failures with appropriate error messages

## Tech Stack

- Next.js
- React
- Tailwind CSS
- OpenAI API for recipe generation

## Quick Start

1. Clone the repository:
   git clone https://github.com/yourusername/ai-powered-recipe-generator.git
1. Install the dependencies:

```
yarn install
```

1. Set up the OpenAI API key:

- Create a `.env.local` file in the project root
- Add the following line to the `.env.local` file:
  ```
  OPENAI_API_KEY=your_api_key_here
  ```

1. Start the development server:
   `yarn dev`
2. Open your browser and navigate to `http://localhost:3000` to access the AI-Powered Recipe Generator.

## Usage Instructions

- Select your ingredient, dietary restriction (optional), and serving size
  - Note if you do not provide a ingredient or serving size you will be notified by the system to select a value. If you provide 0 for serving size you will also get a validation error.
- Click "Generate Recipe"
- Notice your recipe below
- To get another options for your previous selections click "Generate Again" and you will get a new recipie suggestion
  - NOTE: the "Generate Again" button will display your last submitted selections that will be used in generating a new recipe. You can change selections in the form above and your previous submission values will be cached for additional regeneration requests. Only when you submit newly selected values will the regeneration parameters change.

## Assumptions

- Only one ingredient, dietary restriction, and serving size is accepted at a time
- All input constraints must be respected at the same time (AND not OR logic)
- We want recipe "regenerations" to have awareness of the last recipe provided

## Limitations

- AI is only aware of 1 previous recipe, we could instead feed it a list of all previous recipe titles to prevent duplication
- Recipe's provided are not audited to see if ingredients match the ingredient, dietary restriction and serving size requested. I would recommend as an improvement making a second call to the LLM to check if these rules have been followed.
- Styling for the recipe currently relies on the LLM to generate an HTML doc. This looks good enough for POC, but a fast follow would be to have the AI return a recipe in a structured format (i.e. JSON) and then conditionally render UI components based on data.

## AI Tools Used

This project was developed with the assistance of the following AI tools:

- [OpenAI-Node](https://www.npmjs.com/package/openai)
