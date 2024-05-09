import { BrowserRouter, useRoutes } from 'react-router-dom'
import { RecipeProvider } from '../../Context'
import Home from '../Home'
import Login from '../Login'
import Signin from '../Signin'
import Navbar from '../../Components/Navbar'
import './App.css'

const AppRoutes = () => {
  let routes = useRoutes([
    { path: '/', element: <Home/>},
    { path: '/Login', element: <Login/>},
    { path: '/Signin', element: <Signin/>},
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
