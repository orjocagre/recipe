import { useContext } from "react"
import { RecipeContext } from "../../Context"

const SideMenu = () => {

  const context = useContext(RecipeContext)
  
  if (context.isSideMenuActive) {
    if (context.account) {
      return (
        <>
          <div className="fixed top-14 left-0 w-full h-svh z-30 bg-lightColor flex flex-col align-baseline p-4">
            {context.account && 
            <p className="font-secondaryFont text-xl text-secondaryColor pb-5 pt-5">{context.account.userName}</p>
            }
            <hr />
            <button className="text-left p-4 font-secondaryFont">Mi cuenta</button>
            <button className="text-left p-4 font-secondaryFont">Iniciar Sesion</button>
            <button className="text-left p-4 font-secondaryFont text-red-600">Cerrar sesion</button>
          </div>
        </>
      )
    }
    else {
      return (
        <>
          <div className="fixed top-14 left-0 w-full h-svh z-30 bg-lightColor flex flex-col align-baseline p-4">
            <button className="text-left p-4 font-secondaryFont">Iniciar Sesion</button>
            <button className="text-left p-4 font-secondaryFont">Registrarse</button>
          </div>
        </>
      )

    }
  }
}


export default SideMenu