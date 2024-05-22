import { BrowserRouter, useRoutes } from 'react-router-dom'
import { RecipeProvider } from '../../Context'
import Home from '../Home'
import RecipeView from '../RecipeView'
import NewRecipe from '../NewRecipe'
import Login from '../Login'
import Signin from '../Signin'
import MyAccount from '../MyAccount'
import Navbar from '../../Components/Navbar'
import './App.css'

const AppRoutes = () => {
  let routes = useRoutes([
    { path: '/', element: <Home/>},
    { path: '/Login', element: <Login/>},
    { path: '/Signin', element: <Signin/>},
    { path: '/MyAccount', element: <MyAccount/>},
    { path: '/NewRecipe', element: <NewRecipe/>},
    { path: '/RecipeView', element: <RecipeView/>},
  ])

  return routes
}

const App = () => {
  return (
    <RecipeProvider>
      <BrowserRouter>
        <AppRoutes/>
        <Navbar/>
      </BrowserRouter>
    </RecipeProvider>
  )
}

export default App
