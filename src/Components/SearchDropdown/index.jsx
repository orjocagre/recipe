import { useContext } from "react"
import { RecipeContext } from "../../Context"
import SearchItem from "../SearchItem"
import IngredientSearchBlock from "../IngredientSearchBlock"

const SearchDropdown = () => {

  const context = useContext(RecipeContext)

  if (context.isSearchActive) {

    const smallContainer = "fixed w-full h-[calc(100vh-3.5rem)] top-14 left-0 z-30 flex flex-col overflow-scroll bg-lightColor"
    const largeContainer = "fixed w-[calc(50vw)] h-min top-14 left-1/4 z-30 flex flex-col drop-shadow-2xl rounded overflow-hidden bg-lightColor"

    return (
      <div className={ window.innerWidth<640 ? smallContainer : largeContainer}>
        {
        context.searchedRecipes && context.searchedRecipes.map(recipe => (
          <SearchItem key={recipe.name} recipeName={recipe.name}/>
        ))
        }
        {
        context.searchedByIngredient && context.searchedByIngredient.map(ingredientList => (
          <IngredientSearchBlock key={ingredientList.ingredient} ingredientList={ingredientList}/>
        ))
        }
      </div>
    )
  }
}

export default SearchDropdown