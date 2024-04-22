import { useState } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Bars3Icon } from "@heroicons/react/24/outline"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/outline"

function Navbar() {


  // const [account, setAccount] = useState(null)
  const [account, setAccount] = useState({ name: 'Orlando' })


  const [activeSearch, setActiveSearch] = useState(false)


  const [displayAccountMenu, setDisplayAccountMenu] = useState(false)

  const activeUserContainer = "absolute right-0 top-14 bg-white rounded-lg shadow-lg flex flex-col p-1"
  const inactiveUserContainer = "hidden absolute right-0 top-14 bg-white rounded-lg shadow-lg flex flex-col p-1"

  const activeStyleButton = "font-secondaryFont text-lg font-bold text-white border-b-2 border-white hidden sm:block"
  const inactiveStyleButton = "font-secondaryFont text-lg font-bold text-lightColor hidden sm:block"



  const [displaySideMenu, setDisplaySideMenu] = useState(false)


  const renderMenuView = () => {
    if (displaySideMenu) {
      if (account) {
        return (
          <>
            <div className="fixed top-14 left-0 w-full h-svh z-30 bg-lightColor flex flex-col align-baseline p-4">
              <p className="font-secondaryFont text-xl text-secondaryColor pb-5 pt-5">Orlando</p>
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

  const closeSearch = () => {
    setActiveSearch(false)
    setDisplaySideMenu(false)
  }
  const renderHeader = () => {
    if (!activeSearch) {
      return (
        <>

        </>
      )
    }
    else {
      return (
        <div className="h-14 bg-secondaryColor flex items-center justify-between p-4">
          <ArrowLeftIcon onClick={() => closeSearch()} className="w-6 h-6 text-lightColor" />
          <input className="flex-1 rounded-lg p-2 bg-secondaryColor font-secondaryFont text-lightColor focus:outline-none" type="text" placeholder="buscar receta o ingrediente..." />
          <XMarkIcon className="w-6 h-6 text-lightColor" />
        </div>
      )
    }
  }

  const renderSearchView = () => {
    if (activeSearch) {
      return (
        <div className="fixed w-full h-[calc(100vh-3.5rem)] top-14 left-0 z-30 flex flex-col overflow-scroll">

          <div className="bg-lightColor flex-1 p-4">
            <h2 className="font-secondaryFont text-sm font-bold p-4">recetas</h2>
            {searchItem()}
            {searchItem()}
            {searchItem()}
            {searchItem()}
            {searchItem()}
            {searchItem()}
            <h2 className="font-secondaryFont text-sm font-bold p-4">recetas con <span className="text-secondaryColor font-extrabold">chile verde</span></h2>
            {searchItem()}
            {searchItem()}
            {searchItem()}
          </div>
        </div>
      )
    }
  }

  const searchItem = () => {
    return (
      <>
        <p className="font-secondaryFont p-4 border-b">Filete de pollo en salsa de hongos</p>
      </>
    )
  }

  let searchBackButton
  let headerLogo
  let searchButton
  let cancelSearchButton
  let hamburguerButton
  let searchContainer
  let searchInput

  if (!activeSearch) {
    searchBackButton = 'hidden w-6 h-6 text-lightColor'
    headerLogo = 'text-4xl font-primaryFont text-primaryColor font-bold'
    searchButton = 'h-6 w-6 text-white sm:text-darkColor'
    cancelSearchButton = 'hidden w-6 h-6 text-lightColor'
    hamburguerButton = 'h-6 w-6 sm:hidden text-white'
    searchContainer = 'sm:w-1/2 h-10 p-2 rounded-lg sm:bg-lightColor flex items-center'
    searchInput = 'flex-1 rounded-lg p-2 hidden sm:block bg-lightColor font-secondaryFont focus:outline-none'
  }
  else {
    if(window.innerWidth < 640) {
      searchBackButton = 'hidden w-6 h-6 text-lightColor'
      headerLogo = 'hidden text-4xl font-primaryFont text-primaryColor font-bold'
      searchButton = 'hidden h-6 w-6 text-white sm:text-darkColor'
      cancelSearchButton = 'w-6 h-6 text-lightColor'
      hamburguerButton = 'hidden h-6 w-6 sm:hidden text-white'
      searchContainer = 'w-full sm:w-1/2 h-10 rounded-lg sm:bg-lightColor flex items-center'
      searchInput = 'flex-1 rounded-lg p-2 sm:block bg-secondaryColor sm:bg-lightColor font-secondaryFont text-lightColor focus:outline-none'
    }
  }

  return (
    <header className="fixed p-4 shadow-md h-14 w-full bg-secondaryColor left-0 top-0 flex items-center justify-between">
      <Bars3Icon onClick={() => setDisplaySideMenu(!displaySideMenu)} className={hamburguerButton} />
      <p className={headerLogo}>recipe</p>
      <div className={searchContainer}>
        <ArrowLeftIcon onClick={() => closeSearch()} className={searchBackButton} />
        <input className={searchInput} type="text" />
        <MagnifyingGlassIcon onClick={() => window.innerWidth < 640 && setActiveSearch(true)} className={searchButton} />
        <XMarkIcon className={cancelSearchButton} />
      </div>
      <button className="font-secondaryFont text-lg font-bold text-lightColor hidden sm:block">Iniciar Sesion</button>

      <div className={displayAccountMenu ? activeUserContainer : inactiveUserContainer}>
        <button className="font-secondaryFont text-lg p-3 bg-white rounded-lg hover:bg-lightColor">Mi cuenta</button>
        <button className="font-secondaryFont text-lg p-3 bg-white rounded-lg hover:bg-lightColor text-red-600">Cerrar sesion</button>
      </div>

      {renderMenuView()}

      {renderSearchView()}



    </header>
  )


}

export default Navbar