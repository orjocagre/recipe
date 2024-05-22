import { EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { ClockIcon } from "@heroicons/react/24/outline"
import { UserIcon } from "@heroicons/react/24/outline"
import { useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RecipeContext } from "../../Context"
import { TrashIcon } from "@heroicons/react/24/outline"
import { PencilIcon } from "@heroicons/react/24/outline"

function Card({recipe}) {

  const navigate = useNavigate()
  const context = useContext(RecipeContext)
  const btnRecipeMenu = useRef(null)
  const btnEdit = useRef(null)
  const btnDelete = useRef(null)

  const [menuActive, setMenuActive] = useState(false)

  function clickRecipeMenu(event) {
    event.stopPropagation()
    setMenuActive(!menuActive)
  }

  function clickDelete(event) {
    event.stopPropagation()

  }

  function clickEdit(event) {
    event.stopPropagation()

  }

  function clickRecipe(event) {
    if(event.target == btnRecipeMenu || event.target == btnDelete || event.target == btnEdit) return
    context.setSelectedRecipe(recipe)
    navigate('/RecipeView')
  }
  
  function menuLoseFocus(event) {
    console.log(event)
    console.log(btnDelete)
    if(event.relatedTarget == btnDelete || event.relatedTarget == btnEdit) {
      console.log('es uno de los botones')
      return
    }
    setMenuActive(false)
  }

  const randomIngredients = () => {
    const num = Math.ceil(Math.random()*20)

    const ingredientList = [
      "harina",
      "huevos",
      "leche",
      "azúcar",
      "mantequilla",
      "sal",
      "aceite de oliva",
      "cebolla",
      "ajo",
      "tomate",
      "pimiento",
      "zanahoria",
      "papas",
      "pimienta",
      "orégano",
      "albahaca",
      "queso parmesano",
      "queso mozzarella",
      "queso cheddar",
      "jamón",
      "pollo",
      "ternera",
      "cerdo",
      "salchicha",
      "atún",
      "salmón",
      "langostinos",
      "camarones",
      "calamares",
      "aceitunas",
      "champiñones",
      "espinacas",
      "lechuga",
      "brócoli",
      "coliflor",
      "maíz",
      "frijoles",
      "lentejas",
      "garbanzos",
      "arroz",
      "pasta",
      "pan",
      "miel",
      "vinagre balsámico",
      "mostaza",
      "ketchup",
      "mayonesa",
      "salsa de soja",
      "salsa worcestershire",
      "salsa de tomate",
      "salsa picante"
    ]

    let ingredients = ''
    for(let i=0; i<num; i++) {
      ingredients = ingredients + ingredientList[Math.floor(Math.random()*50)] + ' · '
    }
    ingredients = ingredients.substring(0, ingredients.length-3)
    return ingredients
  }

  return (
    <article className="rounded-lg h-min w-full cursor-pointer transition-transform hover:scale-95 hover:bg-lightColor p-2" onClick={(event) => clickRecipe(event)}>
      <figure className="w-full h-1/2 relative">
        <span></span>
        <img className="w-full h-full object-cover rounded-lg" src={recipe.image ? recipe.image : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiL2jQwQ5jf4rVj0CCh_PTZBqVHG-vK72HqeWyWIaIPMxKMx4DhEYr_4lfAKHP8S7RKTI&usqp=CAU'} alt="" />
        {context.account && context.account.id == recipe.userId && 
          <button className="absolute rounded-xl top-2 right-2 bg-white hover:bg-primaryColor" ref={btnRecipeMenu} onClick={event => clickRecipeMenu(event)} onBlur={event => menuLoseFocus(event)}>
            <EllipsisVerticalIcon className="w-6 h6 text-black" />
          </button>        
        }
        {context.account && context.account.id == recipe.userId && menuActive &&
          <div className="absolute rounded-lg top-8 right-2 bg-white p-1 flex flex-col gap-1 shadow-lg">
            <button className="font-secondaryFont text-sm font-medium text-secondaryColor p-2 hover:bg-lightColor hover:text-black rounded-lg flex items-center gap-2" ref={btnEdit} onClick={event => clickEdit(event)}>
              <PencilIcon className="w-6 h-6"/>
              Editar
            </button>
            <button className="font-secondaryFont text-sm font-medium text-secondaryColor p-2 hover:bg-lightColor hover:text-black rounded-lg flex items-center gap-2" ref={btnDelete} onClick={event => clickDelete(event)}>
              <TrashIcon className="w-6 h-6"/>
              Eliminar
            </button>
          </div>        
        }
      </figure>

      

      <div className="w-full h-[calc(50%-0.5rem)] rounded-lg mt-2 flex flex-col gap-2">
        <span className="font-primaryFont text-3xl text-secondaryColor">{recipe.name}</span>
        <hr />
        <span className="font-secondaryFont text-sm text-secondaryColor">por {recipe.user.userName}</span>
        <div className="flex gap-2">
          <ClockIcon className="w-6 h-6 text-secondaryColor"/>
        <span>{recipe.time} min</span>
        </div>
        <div className="flex gap-2">
          <UserIcon className="w-6 h-6 text-secondaryColor"/>
          <span>{recipe.servings} personas</span>
        </div>
        <span className="text-sm">{recipe.ingredients.map(ingredient => ingredient.name).join(' · ')}</span>
      </div>
    </article>
  )
}

export default Card