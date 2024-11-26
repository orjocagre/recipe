import Layout from "../../Components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/16/solid";
import { RecipeContext } from "../../Context";
import { useContext, useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

function MyAccount() {
  const context = useContext(RecipeContext);
  const navigate = useNavigate()


  const [searchIngredient, setSearchIngredient] = useState('')
  const [searchedIngredients, setSearchedIngredients] = useState(null)
  const [inputFocus, setInputFocus] = useState(false)
  const [formData, setFormData] = useState({userName: context.account.userName, password: context.account.password, confirmPassword: context.account.password})
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false)
  const [isEditActive, setIsEditActive] = useState(false)

  function removeIngredient(name) {
    let index = context.account.regularIngredients.findIndex(ingredient => ingredient.name === name)

    let idRegularIngredient = context.account.regularIngredients[index].RegularIngredient.id

    let url = 'http://localhost:3000/api/v1/regular_ingredients/'+idRegularIngredient
    console.log(url)
    fetch(url, {
      method: 'DELETE'
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to delete data')
      }
      else {
        context.setUpdateAccount(true)
      }
    })
  }

  function addExistingIngredient(name) {
    const selectedIngredient = context.ingredients.find(ingredient => ingredient.name == name)
    
    for (let i = 0; i < context.account.regularIngredients.length; i++) {
      const ingredient = context.account.regularIngredients[i];
      if(ingredient.name == selectedIngredient.name) {
        setSearchIngredient('')
        return
      }
    }

    post('http://localhost:3000/api/v1/regular_ingredients/', {
      userId: context.account.id,
      ingredientId: selectedIngredient.id,
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to save data')
      }
      else {
        context.setUpdateAccount(true)
      }
    })

  }

  function addNewIngredient(event) {
    event.preventDefault()

    if(!searchIngredient) return

    if(context.ingredients.find(ingredient => ingredient.name == searchIngredient)) {
      addExistingIngredient(searchIngredient)
      return
    }

    post('http://localhost:3000/api/v1/ingredients/', {name: searchIngredient, userId: context.account.id})
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to save data')
      }
      else {
        return(response.json())
      }
    })
    .then(data => {
      post('http://localhost:3000/api/v1/regular_ingredients/', {
      userId: context.account.id,
      ingredientId: data.id,
      })
      .then(response => {
        if(!response.ok) {
          throw new Error('Failed to save data')
        }
        else {
          context.setUpdateAccount(true)
        }
      })
    })

    setSearchIngredient('')
  }

  function loseFocus(event) {
    if(event.relatedTarget && event.relatedTarget.name) {
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

  function deactivateAccount() {
    Swal.fire({
      title: "Estas seguro?",
      text: "Tu cuenta no se podrá recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminada!",
          text: "Tu cuenta se ha eliminado.",
          icon: "success"
        });
      }
    }).then(() => {
      const url = 'http://localhost:3000/api/v1/users/' + context.account.id
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({isActive: false})
      }).then((response) => {
        if(!response.ok) {
          throw new Error('Failed to save data')
        }
        else {
          navigate('/')
          context.setAccount(null)
        }
      })
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

  function cancelEdition(event) {
    event.preventDefault()
    setIsEditActive(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if(formData.password !== formData.confirmPassword || !formData.userName || !formData.password) {
      setErrorConfirmPassword(true)
      return
    }

    const userObject = {...formData}
    delete userObject.confirmPassword


    const url = 'http://localhost:3000/api/v1/users/' + context.account.id

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userObject)
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to save data')
      }
      else {
        return(response.json())
      }
    })
    .then(data => context.setAccount(data))
    .then(() => {
      context.setUpdateAccount(true)
      setIsEditActive(false)
    })
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
        <XCircleIcon className="w-4 h-4 cursor-pointer hover:text-secondaryColor" onClick={()=>(removeIngredient(ingredientName))}/>
      </div>
    );
  }

  return (
    <Layout>
      {isEditActive ? 
        <div className="w-full flex justify-center">
          <form className="w-80 flex flex-col m-8" onSubmit={event => handleSubmit(event)}>
            <h1 className="text-lg font-secondaryFont self-center">Cuenta</h1>
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
            <div className="flex gap-2">
              <button className="font-secondaryFont p-4 rounded-lg flex-1 text-secondaryColor border-2 border-secondaryColor font-bold text-lg mt-8 hover:scale-105 transition-transform" type="submit" onClick={event => cancelEdition(event)}>Cancelar</button>
              <button className="font-secondaryFont p-4 rounded-lg flex-1 bg-secondaryColor text-white border-2 border-secondaryColor font-bold text-lg mt-8 hover:scale-105 transition-transform" type="submit" onClick={event => handleSubmit(event)}>Guardar</button>
            </div>
          </form>
        </div>
      :
        <div className="w-full flex justify-center">
          <div className="w-80 flex flex-col m-8">
            <h1 className="text-lg font-secondaryFont self-center">Cuenta</h1>
            <p className="font-secondaryFont mt-6 text-lg">Ingredientes comunes</p>
            <p className="font-secondaryFont text-sm font-light">
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
              {context.account.regularIngredients && context.account.regularIngredients.map((ingredient) => (
                <IngredientItem key={ingredient.name} id={ingredient.id} ingredientName={ingredient.name}/>
              ))}
            </div>
            <p className="font-secondaryFont mt-6 text-lg mt-8">Datos de usuario</p>
            <div className="bg-lightColor rounded-lg p-2 flex justify-between">
              <div className="flex flex-col">
                <p className="font-secondaryFont">Nombre de usuario: <span className="text-secondaryColor font-bold">{context.account.userName}</span></p>
                <p className="font-secondaryFont mt-4">Contraseña: <span className="text-secondaryColor font-bold">{context.account.password}</span></p>
              </div>
              <button className="rounded-lg bg-gray-200 p-2 w-fit h-fit hover:bg-primaryColor" onClick={() => setIsEditActive(true)}><PencilIcon className="w-4 h-4"/></button>
            </div>
            <button className="font-secondaryFont p-2 w-fit hover:underline text-red-600" onClick={event => deactivateAccount(event)}>Eliminar cuenta</button>
          </div>
        </div>
      }
      
    </Layout>
  );
}

export default MyAccount;
