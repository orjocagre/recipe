import SearchItem from "../SearchItem"

const IngredientSearchBlock = ({ingredientList}) => {
  return(
    <>
    <h2 className="font-secondaryFont text-sm font-bold p-4">recetas con <span className="text-secondaryColor font-extrabold">{ingredientList.ingredient}</span></h2>
    {ingredientList.recipes.map(recipe => (
      <SearchItem key={recipe.name} recipeName={recipe.name}/>
    ))}
    </>
  )
}


export default IngredientSearchBlock