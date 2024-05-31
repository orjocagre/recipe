import { useContext } from "react"
import Layout from "../../Components/Layout"
import { RecipeContext } from "../../Context"
import { ClockIcon, UserIcon } from "@heroicons/react/24/outline"

function RecipeView() {
  const context = useContext(RecipeContext)
  const procedure = context.selectedRecipe.procedure.replace(/\n/g, '<br/>');


  function IngredientItem({ingredient}) {
    return (
      <div className="flex items-center">
        <div className="bg-secondaryColor w-2 h-2 rounded-lg mr-2"></div>
        <p>{ingredient.RecipeIngredient.amount || ''}</p>
        {ingredient.RecipeIngredient.amount && <p>&nbsp;</p>}
        <p>{ingredient.name}</p>
        <p>&nbsp;</p>
        <p>{ingredient.RecipeIngredient.description || ''}</p>
      </div>
    )
  }

  return(
    <Layout>
      <div className="rounded-lg h-min w-full sm:flex p-2 gap-4">
        <figure className="w-full sm:w-96 h-1/2 relative">
          <span></span>
          <img className="w-full h-full object-cover rounded-lg" src={context.selectedRecipe.image ? context.selectedRecipe.image : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiL2jQwQ5jf4rVj0CCh_PTZBqVHG-vK72HqeWyWIaIPMxKMx4DhEYr_4lfAKHP8S7RKTI&usqp=CAU'} alt="" />
        </figure>


        <div className="w-full h-[calc(50%-0.5rem)] rounded-lg flex flex-col gap-2 mt-4 sm:mt-0">
          <span className="font-primaryFont text-3xl sm:text-5xl sm:font-bold text-secondaryColor">{context.selectedRecipe.name}</span>
          <hr />
          <span className="font-secondaryFont text-sm text-secondaryColor">por {context.selectedRecipe.user.userName}</span>
          <div className="flex gap-2">
            <ClockIcon className="w-6 h-6 text-secondaryColor"/>
          <span>{context.selectedRecipe.time} min</span>
          </div>
          <div className="flex gap-2">
            <UserIcon className="w-6 h-6 text-secondaryColor"/>
            <span>{context.selectedRecipe.servings} personas</span>
          </div>
        </div>
      </div>
      <div className="sm:flex gap-4">
        <div className="bg-lightColor rounded-lg p-8 mt-4">
          <h2 className="font-secondaryFont text-lg font-bold text-secondaryColor mb-8">Ingredientes</h2>
          {context.selectedRecipe.ingredients.map((ingredient, index) => (
            <IngredientItem key={index} ingredient={ingredient}/>
          ))}
        </div>
        <div className="flex-1 bg-lightColor rounded-lg p-8 mt-4">
          <h2 className="font-secondaryFont text-lg font-bold text-secondaryColor mb-8">Procedimiento</h2>
          <p className="font-secondaryFont" dangerouslySetInnerHTML={{ __html: context.selectedRecipe.procedure.replace(/\n/g, '<br/>') }}></p>
        </div>
      </div>
    </Layout>
  )
}

export default RecipeView