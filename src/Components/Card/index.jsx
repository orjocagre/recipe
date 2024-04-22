import { EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { ClockIcon } from "@heroicons/react/24/outline"
import { UserIcon } from "@heroicons/react/24/outline"

function Card({recipe}) {

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
    <article className="rounded-lg h-min w-full">
      <figure className="w-full h-1/2 relative">
        <span></span>
        <img className="w-full h-full object-cover rounded-lg" src={recipe.image} alt="" />
        <div className="absolute rounded-xl top-2 right-2 bg-white">
          <EllipsisVerticalIcon className="w-6 h6 text-black" />
        </div>

      </figure>


      <div className="w-full h-[calc(50%-0.5rem)] rounded-lg mt-2 flex flex-col gap-2">
        <span className="font-primaryFont text-3xl text-secondaryColor">{recipe.name}</span>
        <div className="flex gap-2">
          <ClockIcon className="w-6 h-6 text-secondaryColor"/>
          <span>20 min</span>
        </div>
        <div className="flex gap-2">
          <UserIcon className="w-6 h-6 text-secondaryColor"/>
          <span>4 porciones</span>
        </div>
        {/* <span className="text-sm">tomate · cebolla · cilanto · hieva buena · perejil · filete de pollo · zanahoria · albahaca · cumino · arroz · limon · sal · pimienta </span> */}
        <span className="text-sm">{randomIngredients()}</span>
      </div>
    </article>
  )
}

export default Card