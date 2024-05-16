import { useContext, useState } from "react"
import { RecipeContext } from "../../Context"
import SearchDropdown from "../../Components/SearchDropdown"
import SideMenu from "../../Components/SideMenu"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Bars3Icon } from "@heroicons/react/24/outline"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { NavLink } from "react-router-dom"

function Navbar() {


  const context = useContext(RecipeContext)

  const [isAccountMenuActive, setIsAccountMenuActive] = useState(false)

  const activeUserContainer = "absolute right-0 top-14 bg-white rounded-lg shadow-lg flex flex-col p-1"
  const inactiveUserContainer = "hidden absolute right-0 top-14 bg-white rounded-lg shadow-lg flex flex-col p-1"

  const activeStyleButton = "font-secondaryFont text-lg font-bold text-white border-b-2 border-white hidden sm:block"
  const inactiveStyleButton = "font-secondaryFont text-lg font-bold text-lightColor hidden sm:block"


  const closeSearch = () => {
    context.setIsSearchActive(false)
    context.setIsSideMenuActive(false)
    context.account && console.log(context.account)
  }


  let searchBackButton
  let headerLogo
  let searchButton
  let cancelSearchButton
  let hamburgerButton
  let searchContainer
  let searchInput

  searchBackButton = 'hidden w-6 h-6 text-lightColor'
  headerLogo = 'text-4xl font-primaryFont text-primaryColor font-bold'
  searchButton = 'h-6 w-6 text-white sm:text-darkColor'
  cancelSearchButton = 'hidden w-6 h-6 text-lightColor cursor-pointer'
  hamburgerButton = 'h-6 w-6 sm:hidden text-white'
  searchContainer = 'sm:w-1/2 h-10 p-2 rounded-lg sm:bg-lightColor flex items-center'
  searchInput = 'flex-1 rounded-lg p-2 hidden sm:block bg-lightColor font-secondaryFont focus:outline-none'
  
  if (context.isSearchActive) {
    
    if(window.innerWidth < 640) {
      searchBackButton = 'w-6 h-6 text-lightColor'
      headerLogo = 'hidden text-4xl font-primaryFont text-primaryColor font-bold'
      searchButton = 'hidden h-6 w-6 text-white sm:text-darkColor'
      cancelSearchButton = 'w-6 h-6 text-lightColor'
      hamburgerButton = 'hidden h-6 w-6 sm:hidden text-white'
      searchContainer = 'w-full sm:w-1/2 h-10 rounded-lg sm:bg-lightColor flex items-center'
      searchInput = 'flex-1 rounded-lg p-2 sm:block bg-secondaryColor sm:bg-lightColor font-secondaryFont text-lightColor focus:outline-none'
    
    } else {
      searchButton = 'hidden h-6 w-6 text-white sm:text-darkColor'
      cancelSearchButton = 'w-6 h-6 text-darkColor cursor-pointer'
    }
  
  } 

  return (
    <header className="fixed p-4 shadow-md h-14 w-full bg-secondaryColor left-0 top-0 flex items-center justify-between">
      <Bars3Icon onClick={() => context.setIsSideMenuActive(!context.isSideMenuActive)} className={hamburgerButton} />
      <p className={headerLogo}>recipe</p>
      <div className={searchContainer}>
        <ArrowLeftIcon onClick={() => closeSearch()} className={searchBackButton} />
        <input className={searchInput} value={context.searchRecipeOrIngredient} onChange={event => {context.setSearchRecipeOrIngredient(event.target.value)}} type="text" placeholder="Buscar receta o ingrediente" />
        <MagnifyingGlassIcon onClick={() => window.innerWidth < 640 && context.setIsSearchActive(true)} className={searchButton} />
        <XMarkIcon className={cancelSearchButton} onClick={() => context.setSearchRecipeOrIngredient('')} />
        <SearchDropdown/>
      </div>
      {context.account ? 
      <NavLink to='/' className="font-secondaryFont text-lg font-bold text-lightColor hidden sm:block" onClick={() => setIsAccountMenuActive(!isAccountMenuActive)}>{context.account.userName}</NavLink>:
      <NavLink to='/Login' className="font-secondaryFont text-lg font-bold text-lightColor hidden sm:block">Iniciar Sesion</NavLink>
      }
      

      <div className={isAccountMenuActive ? activeUserContainer : inactiveUserContainer}>
        <button className="font-secondaryFont text-lg p-3 bg-white rounded-lg hover:bg-lightColor">Mi cuenta</button>
        <button className="font-secondaryFont text-lg p-3 bg-white rounded-lg hover:bg-lightColor text-red-600">Cerrar sesion</button>
      </div>

      <SideMenu/>

    </header>
  )
}

export default Navbar