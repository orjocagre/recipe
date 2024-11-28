import Layout from "../../Components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/16/solid";
import { RecipeContext } from "../../Context";
import { useContext, useEffect, useState } from "react";

function Login() {
  const context = useContext(RecipeContext);
  const navigate = useNavigate()

  const regularIngredients = context.ingredients ? context.ingredients.filter((ingredient) => ingredient.isCommon === true) : [];

  const [searchIngredient, setSearchIngredient] = useState('')
  const [searchedIngredients, setSearchedIngredients] = useState(null)
  const [inputFocus, setInputFocus] = useState(false)
  const [userRegularIngredients, setUserRegularIngredients] = useState(regularIngredients)
  const [formData, setFormData] = useState({userName: '', password: '', confirmPassword: ''})
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false)

  function removeIngredient(name) {
    let index = userRegularIngredients.findIndex(ingredient => ingredient.name === name)
    let newList = [...userRegularIngredients]
    newList.splice(index,1)
    setUserRegularIngredients(newList)
  }

  function addExistingIngredient(name) {
    const selectedIngredient = context.ingredients.find(ingredient => ingredient.name == name)
    if(!userRegularIngredients.includes(selectedIngredient)) {
      setUserRegularIngredients([...userRegularIngredients, selectedIngredient])
    }
  }

  function addNewIngredient(event) {
    event.preventDefault()
    if(searchIngredient) {
      if(userRegularIngredients.find(ingredient => ingredient.name == searchIngredient)) {
        return
      }
      const isIngredientAlreadyInList = context.ingredients.find(ingredient => ingredient.name == searchIngredient)
      if(isIngredientAlreadyInList) {
        addExistingIngredient(isIngredientAlreadyInList.name)
        setSearchIngredient('')
        return
      }
      const ingredient = {id:null, name:searchIngredient}
      setUserRegularIngredients([...userRegularIngredients, ingredient])
      setSearchIngredient('')
    }
  }

  function loseFocus(event) {
    if(event.relatedTarget && event.relatedTarget.name == "deleteButton") {
      removeIngredient(event.relatedTarget.attributes[1].value)
    }
    if(event.relatedTarget && event.relatedTarget.name && event.relatedTarget.name != "deleteButton") {
      addExistingIngredient(event.relatedTarget.name)
      setSearchIngredient('')
    }
    setInputFocus(false)
  }

  function handleChange(event) {
    const { value, name } = event.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function post(url, body) {
    return (fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }))
  }

  function saveIngredient(ingredient, userId) {
    if(ingredient.id) {
      console.log('http://localhost:3000/api/v1/regular_ingredients/')
      console.log({
        userId: userId, 
        ingredientId: ingredient.id
      })
      post('http://localhost:3000/api/v1/regular_ingredients/', {
        userId: userId, 
        ingredientId: ingredient.id
      })
      .then(response => {
        if(!response.ok) {
          throw new Error('Failed to save data')
        }
        else {
          const data = response.json()
          return(data)
        }
      })
    }
    else {
      console.log('http://localhost:3000/api/v1/ingredients/')
      console.log({
        name: ingredient.name
      })
      post('http://localhost:3000/api/v1/ingredients/', {
        name: ingredient.name
      })
      .then(response => (response.json()))
      .then(data => {
        console.log('http://localhost:3000/api/v1/regular_ingredients/')
        console.log({
          userId: userId, 
          ingredientId: data.id
        })
        post('http://localhost:3000/api/v1/regular_ingredients/', {
          userId: userId, 
          ingredientId: data.id
        })
        .then(response => {
          if(!response.ok) {
            throw new Error('Failed to save data')
          }
          else {
            const data = response.json()
            return(data)
          }
        })
      })
    }
  }

  function logIn() {
    console.log('http://localhost:3000/api/v1/users/login')
        console.log({
          userName: formData.userName,
          password: formData.password,
        })
    post('http://localhost:3000/api/v1/users/login', {
      userName: formData.userName,
      password: formData.password,
    })
    .then(response => (response.json()))
    .then(data =>  {
      if(data && data.userName) {
        context.setAccount(data)
        context.setIsSignedOut(false)
        localStorage.setItem('account', JSON.stringify(data))
        localStorage.setItem('sign-out', JSON.stringify(false))
        navigate('/')
      }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if(formData.password !== formData.confirmPassword || !formData.userName || !formData.password) {
      setErrorConfirmPassword(true)
      return
    }

    const userObject = formData
    delete userObject.confirmPassword

    console.log('http://localhost:3000/api/v1/users/')
    console.log(userObject)

    post('http://localhost:3000/api/v1/users/', userObject)
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to save data')
      }
      else {
        const data = response.json()
        return data
      }
    })
    .then(data => (data.id))
    .then(userId => {
      userRegularIngredients.map(ingredient => {
        saveIngredient(ingredient, userId)
      })
    }
    )
    .then(() => logIn())
  }
    

  useEffect(() => {
    if (searchIngredient && inputFocus) {

      const searched = searchIngredient.trim().toLowerCase();
      setSearchedIngredients(context.ingredients.filter((ingredient) => ingredient.name.toLowerCase().includes(searched)))

    } else {
      setSearchedIngredients(null)
    }
  }, [searchIngredient, inputFocus]);

  function SearchDropdown() {
    return (
      <div className="absolute w-full max-h-[calc(2.25rem*4)] overflow-y-auto top-10 left-0 z-30 flex flex-col drop-shadow-2xl rounded overflow-hidden bg-white">
        {
        searchedIngredients && searchedIngredients.map(ingredient => (
          <SearchItem key={ingredient.id} ingredientId={ingredient.id} ingredientName={ingredient.name}/>
        ))
        }
      </div>
    )
  }

  function SearchItem({ingredientName}) {
    return (
      <>
        <button name={ingredientName} className="font-secondaryFont p-2 text-sm hover:bg-secondaryColor hover:text-lightColor text-left" onClick={()=>{addExistingIngredient(ingredientName)}}>{ingredientName}</button>
      </>
    )
  }


  function IngredientItem({ ingredientName}) {
    return (
      <div className="flex rounded-lg bg-lightColor p-1 items-center gap-2">
        <p className="font-secondaryFont">{ingredientName}</p>
        <button name={"deleteButton"} ingredientName={ingredientName} onClick={()=>(removeIngredient(ingredientName))}>
        <XCircleIcon className="w-4 h-4 cursor-pointer hover:text-secondaryColor"/>
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="w-full flex justify-center">
        <form className="w-80 flex flex-col m-8" onSubmit={event => handleSubmit(event)}>
          <h1 className="text-lg font-secondaryFont self-center">
            Crear cuenta
          </h1>
          <p className="font-secondaryFont mt-6">Nombre de usuario</p>
          <input className="font-secondaryFont bg-lightColor rounded-lg p-2 w-full focus:outline-none" type="text" name="userName" value={formData.userName} onChange={event => handleChange(event)}/>
          <p className="font-secondaryFont mt-6">Contraseña</p>
          <input className="font-secondaryFont bg-lightColor rounded-lg p-2 w-full focus:outline-none" type="password" name="password" value={formData.password} onChange={event => handleChange(event)}/>
          <p className="font-secondaryFont mt-6">Confirmar contraseña</p>
          <input className="font-secondaryFont bg-lightColor rounded-lg p-2 w-full focus:outline-none" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={event => handleChange(event)}/>
          {errorConfirmPassword ? 
            <p className="font-secondaryFont text-sm text-red-600">Las contraseñas no coinciden</p> :
            <p className="hidden">Las contraseñas no coinciden</p>
          }
          <p className="font-secondaryFont mt-6">Ingredientes comunes</p>
          <p className="font-secondaryFont mt-2 text-sm font-light">
            Selecciona los ingredientes que comunmente tienes en tu cocina
          </p>
          <div className="relative bg-lightColor rounded flex">
            <input className="font-secondaryFont bg-lightColor rounded-lg p-2 w-full focus:outline-none" type="text" value={searchIngredient} onChange={event=>setSearchIngredient(event.target.value)} onFocus={()=>setInputFocus(true)} onBlur={event=>loseFocus(event)}/>
            <button className="hover:bg-primaryColor w-10 flex items-center justify-center rounded-lg" onClick={(event)=>addNewIngredient(event)}>
              <PlusIcon className="w-6 h-6" />
            </button>
            <SearchDropdown/>
          </div>
          <div className="mt-2 flex gap-4 flex-wrap">
            {userRegularIngredients && userRegularIngredients.map((ingredient) => (
              <IngredientItem key={ingredient.name} id={ingredient.id} ingredientName={ingredient.name}/>
            ))}
          </div>

          <button className="font-secondaryFont p-4 rounded-lg text-secondaryColor border-2 border-secondaryColor font-bold text-lg mt-8 hover:scale-105 transition-transform" type="submit" onClick={event => handleSubmit(event)}>Enviar</button>
          <div className="flex gap-2 mt-4 self-center">
            <p>Ya tienes cuenta?</p>
            <Link to={"/Login"} className="font-secondaryFont text-secondaryColor font-medium underline">Iniciar sesion</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
