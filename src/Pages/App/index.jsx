import { BrowserRouter, useRoutes } from 'react-router-dom'
import { RecipeProvider } from '../../Context'
import Home from '../Home'
import Navbar from '../../Components/Navbar'
import './App.css'

const AppRoutes = () => {
  let routes = useRoutes([
    { path: '/', element: <Home/>},
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
