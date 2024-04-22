import { useContext } from "react"
import { RecipeContext } from "../../Context"
import Layout from "../../Components/Layout"
import Card from "../../Components/Card"
import { PlusIcon } from "@heroicons/react/24/outline"
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline"

function Home() {

  const context = useContext(RecipeContext)
  
  return (
    <Layout>

      <button className="fixed z-10 right-4 bottom-4 font-secondaryFont bg-primaryColor text-black border border-primaryColor p-2 rounded-lg flex items-center gap-1 flex sm:hidden">
        <PlusIcon className="h-6 w-6"/>
      </button>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <button className="p-2 font-secondaryFont border-b-2 border-primaryColor">Todas las recetas</button>
          <button className="p-2 font-secondaryFont">Solo mis recetas</button>
        </div>
        <div className="flex gap-2">
          <button className="font-secondaryFont bg-primaryColor text-black border border-primaryColor p-2 rounded-lg flex items-center gap-1 w-min sm:w-auto">
            <MagnifyingGlassPlusIcon className="h6 w-6"/>
            Busqueda especial
          </button>
          <button className="font-secondaryFont bg-primaryColor text-black border border-primaryColor p-2 rounded-lg flex items-center gap-1 hidden sm:flex">
            <PlusIcon className="h-6 w-6"/>
            Agregar nueva
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
        {
          context.recipes.map((recipe) => (
            <Card recipe={recipe}/>
          ))
        }
        {
          context.recipes.map((recipe) => (
            <Card recipe={recipe}/>
          ))
        }
      </div>

      

    </Layout>
  )
}

export default Home