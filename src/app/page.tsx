"use client";
import React, { useState } from "react";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import Markdown from "react-markdown";

const gemini = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
});

export default function Home() {
  const [recipe, setRecipe] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");

  function handleIngredientSubmission(event?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) {
    if (event) event.preventDefault();
    if (ingredientInput.trim() === "") return;
    setIngredients((prev) => [...prev, ingredientInput.trim()]);
    setIngredientInput("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ingredientList = ingredients.join(", ");

    const configs = {
      maxOutputTokens: 500,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    };

    const prompt = `Create a recipe using ONLY the following ingredients: ${ingredientList}. Include the name of the recipe, the ingredients, and the instructions. Using a simple language and emojis, use markdown format for the recipe. The recipe should be easy to follow and suitable for a beginner cook.
    
    Use this template:
    Template to fill in with your specified ingredients:

Recipe Name: [Recipe Name Here]

Ingredients:

[Ingredient 1]
[Ingredient 2]
[Ingredient 3]
[Ingredient 4]
[etc.]
Instructions:

[Step 1]
[Step 2]
[Step 3]
[Step 4]
[etc.]
`;
    if (ingredients.length === 0) {
      setRecipe("Please add at least one ingredient before creating a recipe.");
      return;
    }

    const response = await gemini.models.generateContent({
      contents: prompt,
      model: "gemini-2.0-flash",
      config: configs,
    });

    const recipeText =
      response.text ||
      (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) ||
      "";

    setRecipe(recipeText);
    }

  return (
    <main className="flex grow flex-col items-center justify-between p-10 lg:p-25">
      <ul id="ingredientList" className="w-full lg:max-w-[60%] mb-4 flex justify-center">
        <li className="w-full flex flex-col gap-2 py-2 px-4 rounded-4xl">
          {ingredients.map((ingredient, idx) => (
            <div
              key={idx}
              className="py-1 px-3 border-b border-gray-700 last:border-b-0 flex items-center justify-between"
            >
              <span>{ingredient}</span>
              <button
                type="button"
                className="ml-3 text-red-500 hover:text-white hover:bg-red-500 rounded-full p-1 transition duration-200"
                aria-label={`Delete ${ingredient}`}
                onClick={() => {
                  setIngredients(prev => prev.filter((_, i) => i !== idx));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </li>
      </ul>
      <form
        className="flex py-10 px-7.5 w-full lg:max-w-[60%] items-center justify-center gap-5 flex-col md:flex-row"
        onSubmit={handleSubmit}
      >
        <div className="rounded-4xl border-2 ps-5 pe-1 flex gap-2 py-1 items-center w-full justify-between h-12">
          <input
            type="text"
            placeholder="Add an ingredient..."
            className="appearance-none border-none outline-none w-full h-full"
            id="ingredientField"
            value={ingredientInput}
            onChange={e => setIngredientInput(e.target.value)}
          />
          <button
            onClick={handleIngredientSubmission}
            id="addIngredient"
            className="bg-transparent text-gray-100 hover:bg-white hover:text-gray-900 transition duration-200 border-white border-2 hover:border-transparent rounded-4xl flex items-center justify-center h-full aspect-square w-10"
            aria-label="Add Ingredient"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          id="createRecipe"
          aria-label="Create Recipe"
          className="border-green-500 text-green-500 hover:text-white hover:bg-green-500 transition duration-200 border-2 hover:border-transparent min-w-auto text-nowrap rounded-4xl p-2 flex items-center justify-center font-semibold py-2 px-6 h-12 w-full md:w-40"
        >
          Create Recipe
        </button>
      </form>

      <div className="w-full lg:max-w-[60%] mt-6" id="recipeContainer">
        {recipe && (
          <div className="prose prose-invert max-w-none">
            <Markdown
              components={{
                text({ children }) {
                  return (
                    <>
                      {String(children)
                      .split("\n")
                      .map((line, i, arr) =>
                        i < arr.length - 1 ? (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                        ) : (
                        line
                        )
                      )}
                    </>
                  );
                },
              }}
            >
              {recipe}
            </Markdown>
          </div>
        )}
      </div>
    </main>
  );
}
