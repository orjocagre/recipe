import { PlusIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/16/solid";
import { RecipeContext } from "../../Context";
import { useContext, useEffect, useState } from "react";

function IngredientsSelector({ recipe }) {
  const context = useContext(RecipeContext);

  const [searchIngredient, setSearchIngredient] = useState("");
  const [searchedIngredients, setSearchedIngredients] = useState(null);
  const [inputFocus, setInputFocus] = useState(false);

  function removeIngredient(name) {
    let index = context.tempIngredientList.findIndex(
      (ingredient) => ingredient.name === name
    );
    let newList = [...context.tempIngredientList];
    newList.splice(index, 1);
    context.setTempIngredientList(newList);
    context.setIngredientSelectorEditionState("changed");
  }

  function addExistingIngredient(name) {
    const selectedIngredient = context.ingredients.find(
      (ingredient) => ingredient.name == name
    );
    if (
      !context.tempIngredientList.some(
        (ingredient) => selectedIngredient.name == ingredient.name
      )
    ) {
      context.setTempIngredientList([
        ...context.tempIngredientList,
        selectedIngredient,
      ]);
      context.setIngredientSelectorEditionState("changed");
    }
  }

  function addNewIngredient(event) {
    event.preventDefault();
    if (searchIngredient) {
      if (
        context.tempIngredientList.find(
          (ingredient) => ingredient.name == searchIngredient
        )
      ) {
        return;
      }
      const isIngredientAlreadyInList = context.ingredients.find(
        (ingredient) => ingredient.name == searchIngredient
      );
      if (isIngredientAlreadyInList) {
        addExistingIngredient(isIngredientAlreadyInList.name);
        setSearchIngredient("");
        return;
      }
      const ingredient = { id: null, name: searchIngredient };
      context.setTempIngredientList([
        ...context.tempIngredientList,
        ingredient,
      ]);
      setSearchIngredient("");
      context.setIngredientSelectorEditionState("changed");
    }
  }

  function loseFocus(event) {
    if (event.relatedTarget && event.relatedTarget.name == "deleteButton") {
      removeIngredient(event.relatedTarget.getAttribute("data-ingredientName"));
    }
    if (
      event.relatedTarget &&
      event.relatedTarget.name &&
      event.relatedTarget.name != "deleteButton"
    ) {
      addExistingIngredient(event.relatedTarget.name);
      setSearchIngredient("");
    }
    setInputFocus(false);
  }

  useEffect(() => {
    if (searchIngredient && inputFocus) {
      const searched = searchIngredient.trim().toLowerCase();
      setSearchedIngredients(
        context.ingredients.filter((ingredient) =>
          ingredient.name.toLowerCase().includes(searched)
        )
      );
    } else {
      setSearchedIngredients(null);
    }
  }, [searchIngredient, inputFocus]);

  function SearchDropdown() {
    return (
      <>
        {searchedIngredients && (
          <div className="absolute w-full max-h-[calc(2.25rem*4)] overflow-y-auto top-10 left-0 z-30 flex flex-col drop-shadow-2xl rounded overflow-hidden bg-whiteColor border border-secondaryColor">
            {searchedIngredients.map((ingredient) => (
              <SearchItem
                key={ingredient.id}
                ingredientId={ingredient.id}
                ingredientName={ingredient.name}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  function SearchItem({ ingredientName }) {
    return (
      <>
        <button
          name={ingredientName}
          className="font-secondaryFont p-2 text-sm hover:bg-secondaryColor hover:text-whiteColor text-left"
          onClick={() => {
            addExistingIngredient(ingredientName);
          }}
        >
          {ingredientName}
        </button>
      </>
    );
  }

  function IngredientItem({ ingredientName }) {
    return (
      <div className="flex rounded-lg border border-secondaryColor text-black p-1 items-center gap-2">
        <p className="font-secondaryFont">{ingredientName}</p>
        <button
          name={"deleteButton"}
          data-ingredientName={ingredientName}
          onClick={() => removeIngredient(ingredientName)}
        >
          <XCircleIcon className="w-4 h-4 cursor-pointer hover:text-secondaryColor" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="relative bg-whiteColor rounded-lg flex border border-secondaryColor">
        <input
          className="font-secondaryFont bg-transparent rounded-lg p-2 w-full focus:outline-none"
          type="text"
          value={searchIngredient}
          onChange={(event) => setSearchIngredient(event.target.value)}
          onFocus={() => setInputFocus(true)}
          onBlur={(event) => loseFocus(event)}
        />
        <button
          className="hover:bg-primaryColor w-10 flex items-center justify-center rounded-lg"
          onClick={(event) => addNewIngredient(event)}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
        <SearchDropdown />
      </div>
      <div className="mt-2 flex gap-2 flex-wrap">
        {context.tempIngredientList &&
          context.tempIngredientList.map((ingredient) => (
            <IngredientItem
              key={ingredient.name}
              id={ingredient.id}
              ingredientName={ingredient.name}
            />
          ))}
      </div>
    </>
  );
}

export default IngredientsSelector;
