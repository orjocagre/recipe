import { useContext, useEffect, useState } from "react"
import { RecipeContext } from "../../Context"
import Layout from "../../Components/Layout"
import Card from "../../Components/Card"
import { PlusIcon } from "@heroicons/react/24/outline"
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline"
import { NavLink, useNavigate } from "react-router-dom"

function Home() {

  const context = useContext(RecipeContext)
  const navigate = useNavigate()
  const [showAllRecipes, setShowAllRecipes] = useState(true)
  const [displayedRecipes, setDisplayedRecipes] = useState(context.searchedRecipesHome)
  

  useEffect(() => {
    // console.log('----------------------------------------------')
    // console.log('recipes')
    // console.log(context.recipes)
    // console.log('displayed Recipies')
    // console.log(displayedRecipes)
    // console.log('user id')
    // console.log(context.account)


    if(!showAllRecipes && context.account) {
      const filteredList = context.searchedRecipesHome.filter(recipe => context.account.id == recipe.userId)
      setDisplayedRecipes(filteredList)
    } else {
      setDisplayedRecipes(context.searchedRecipesHome)
    }
    // console.log('displayed Recipies')
    // console.log(displayedRecipes)
  },[showAllRecipes, context.searchedRecipesHome, context.recipes])


  function myRecipesButtonClick() {
    if(Object.keys(context.account).length > 0 && !context.isSignedOut) {
      setShowAllRecipes(false)
    }
    else {
      navigate('/Login')
    }
  }

  function newRecipeButtonClick() {
    if(Object.keys(context.account).length > 0 && !context.isSignedOut) {
      navigate('/NewRecipe')
    }
    else {
      navigate('/Login')
    }
  }

  function IngredientGroup({ingredient}) {
    return (
      <>
        <p className="font-secondaryFont mt-8 text-lg bg-lightColor rounded-lg p-2">Recetas con {ingredient.ingredient} </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
        {ingredient.recipes.map((recipe) => (
          <Card recipe={recipe} key={recipe.id}/>
        ))}
        </div>
      </>
    )
  }

  const selectedStyle = 'p-2 font-secondaryFont border-b-2 border-primaryColor'
  const unSelectedStyle = 'p-2 font-secondaryFont hover:text-secondaryColor'
  
  return (
    <Layout>

      <NavLink to="/NewRecipe" className="fixed z-10 right-4 bottom-4 font-secondaryFont bg-primaryColor text-black border border-primaryColor p-2 rounded-lg flex items-center gap-1 flex sm:hidden">
        <PlusIcon className="h-6 w-6"/>
      </NavLink>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <button className={showAllRecipes ? selectedStyle : unSelectedStyle} onClick={() => setShowAllRecipes(true)}>Todas las recetas</button>
          <button className={showAllRecipes ? unSelectedStyle : selectedStyle} onClick={() => myRecipesButtonClick()}>Solo mis recetas</button>
        </div>
        <div className="flex gap-2">
          <button className="font-secondaryFont bg-primaryColor text-black border border-primaryColor p-2 rounded-lg flex items-center gap-1 w-min sm:w-auto">
            <MagnifyingGlassPlusIcon className="h6 w-6"/>
            Busqueda especial
          </button>
          <button onClick={() => newRecipeButtonClick()} className="font-secondaryFont bg-primaryColor text-black border border-primaryColor p-2 rounded-lg flex items-center gap-1 hidden sm:flex">
            <PlusIcon className="h-6 w-6"/>
            Agregar nueva
          </button>
        </div>
      </div>
      {context.textSearched && 
        <p className="font-secondaryFont mt-8 text-lg bg-lightColor rounded-lg p-2">Recetas que coinciden con '{context.textSearched}' </p>
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
        {
          displayedRecipes?.map((recipe) => (
            <Card recipe={recipe} key={recipe.id}/>
          ))
        }
      </div>
      {context.searchedByIngredientHome?.map(ingredient => (
        <IngredientGroup key={ingredient.ingredient} ingredient={ingredient}/>
      ))}

      

    </Layout>
  )
}

export default Home