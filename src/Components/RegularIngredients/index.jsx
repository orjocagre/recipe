import { RecipeContext } from "../../Context";
import IngredientsSelector from "../IngredientsSelector";
import { useContext, useEffect, useState } from "react";

function RegularIngredients({ recipe }) {
  const context = useContext(RecipeContext);

  let regularIngredients;
  if (context.account && !context.isSignedOut) {
    regularIngredients = context.account.regularIngredients;
  } else {
    regularIngredients = context.ingredients
      ? context.ingredients.filter((ingredient) => ingredient.isCommon === true)
      : [];
  }

  function post(url, body) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  function deleteIngredient(name) {
    let index = context.account.regularIngredients.findIndex(
      (ingredient) => ingredient.name === name
    );

    let idRegularIngredient =
      context.account.regularIngredients[index].RegularIngredient.id;

    let url =
      "http://localhost:3000/api/v1/regular_ingredients/" + idRegularIngredient;
    return fetch(url, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete data");
      }
    });
  }

  function createNewIngredient(ingredient, userId) {
    return post("http://localhost:3000/api/v1/ingredients/", {
      name: ingredient.name,
    })
      .then((response) => response.json())
      .then((data) => {
        return linkIngredientToUser(data, userId);
      });
  }

  function linkIngredientToUser(ingredient, userId) {
    return post("http://localhost:3000/api/v1/regular_ingredients/", {
      userId: userId,
      ingredientId: ingredient.id,
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to save data");
      } else {
        return response.json();
      }
    });
  }

  function saveUserIngredient(ingredient, userId) {
    if (ingredient.id) {
      return linkIngredientToUser(ingredient, userId);
    } else {
      return createNewIngredient(ingredient, userId);
    }
  }

  function saveIngredientList(ingredients, userId) {
    const promises = ingredients.map((ingredient) =>
      saveUserIngredient(ingredient, userId)
    );
    return Promise.all(promises);
  }

  useEffect(() => {
    if (!context.saveRegularIngredients.startSave) return;

    if (context.saveRegularIngredients.isNewUser) {
      saveIngredientList(
        context.tempIngredientList,
        context.saveRegularIngredients.userId
      ).then(() => {
        context.setSaveRegularIngredients({
          startSave: false,
          userId: null,
          isNewUser: true,
        });
      });
    } else {
      updateIngredients();
    }
  }, [context.saveRegularIngredients]);

  function updateIngredients() {
    const deletedIngredients = regularIngredients.filter(
      (ingredient) => !context.tempIngredientList.includes(ingredient)
    );
    const addedIngredients = context.tempIngredientList.filter(
      (ingredient) => !regularIngredients.includes(ingredient)
    );

    saveIngredientList(addedIngredients, context.saveRegularIngredients.userId)
      .then(() => {
        const promises = deletedIngredients.map((ingredient) =>
          deleteIngredient(ingredient.name)
        );
        return Promise.all(promises);
      })
      .then(() => {
        context.setSaveRegularIngredients({
          startSave: false,
          userId: null,
          isNewUser: false,
        });
        context.setUpdateAccount(true);
      })
      .then(() => {
        context.setIngredientSelectorEditionState("saved");
        setTimeout(() => {
          context.setIngredientSelectorEditionState("unchanged");
        }, 2000);
      });
  }

  return (
    <>
      <p className="font-secondaryFont mt-6">Ingredientes comunes</p>
      <p className="font-secondaryFont mt-2 text-sm font-light">
        Selecciona los ingredientes que comunmente tienes en tu cocina
      </p>
      <IngredientsSelector />
      {context.account &&
        !context.isSignedOut &&
        context.ingredientSelectorEditionState == "changed" && (
          <button
            className="font-secondaryFont w-full p-2 bg-primaryColor rounded-lg mt-4 hover:scale-105 transition"
            type="button"
            onClick={() => {
              context.setSaveRegularIngredients({
                startSave: true,
                userId: context.account.id,
                isNewUser: false,
              });
            }}
          >
            {" "}
            Guardar cambios
          </button>
        )}
      {context.account &&
        !context.isSignedOut &&
        context.ingredientSelectorEditionState == "saved" && (
          <button
            disabled
            className="font-secondaryFont w-full p-2 text-green-700 rounded-lg mt-4"
            type="button"
          >
            Guardado
          </button>
        )}
    </>
  );
}

export default RegularIngredients;
