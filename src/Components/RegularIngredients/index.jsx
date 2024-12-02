import Layout from "../Layout";
import { PlusIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/16/solid";
import { RecipeContext } from "../../Context";
import { useContext, useEffect, useState } from "react";

function RegularIngredients({recipe}) {
  const context = useContext(RecipeContext);

  let regularIngredients
  if(context.account && !context.isSignedOut) {
    regularIngredients = context.account.regularIngredients
  } else {
    regularIngredients = context.ingredients ? context.ingredients.filter((ingredient) => ingredient.isCommon === true) : []
  }

  const [searchIngredient, setSearchIngredient] = useState('')
  const [searchedIngredients, setSearchedIngredients] = useState(null)
  const [inputFocus, setInputFocus] = useState(false)
  const [userRegularIngredients, setUserRegularIngredients] = useState(regularIngredients)
  const [editionState, setEditionState] = useState('unchanged')

  function removeIngredient(name) {
    let index = userRegularIngredients.findIndex(ingredient => ingredient.name === name)
    let newList = [...userRegularIngredients]
    newList.splice(index,1)
    setUserRegularIngredients(newList)
    setEditionState('changed')
  }

  function addExistingIngredient(name) {
    const selectedIngredient = context.ingredients.find(ingredient => ingredient.name == name)
    if(!userRegularIngredients.includes(selectedIngredient)) {
      setUserRegularIngredients([...userRegularIngredients, selectedIngredient])
      setEditionState('changed')
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
      setEditionState('changed')
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

  function post(url, body) {
    return (fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }))
  }

  function deleteIngredient(name) {
    let index = context.account.regularIngredients.findIndex(ingredient => ingredient.name === name)

    let idRegularIngredient = context.account.regularIngredients[index].RegularIngredient.id

    let url = 'http://localhost:3000/api/v1/regular_ingredients/'+idRegularIngredient
    return fetch(url, {
      method: 'DELETE'
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to delete data')
      }
    })
  }

  function createNewIngredient(ingredient, userId) {
    return post('http://localhost:3000/api/v1/ingredients/', {
      name: ingredient.name
    })
    .then(response => (response.json()))
    .then(data => {
      return linkIngredientToUser(data, userId)
    })
  }

  function linkIngredientToUser(ingredient, userId) {
    return post('http://localhost:3000/api/v1/regular_ingredients/', {
      userId: userId, 
      ingredientId: ingredient.id
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to save data')
      }
      else {
        return response.json()
      }
    })
  }

  function saveUserIngredient(ingredient, userId) {
    if(ingredient.id) {
      return linkIngredientToUser(ingredient, userId)
    }
    else {
      return createNewIngredient(ingredient, userId)
    }
  }

  function saveIngredientList(ingredients, userId) {
    const promises = ingredients.map(ingredient => saveUserIngredient(ingredient, userId))
    return Promise.all(promises)
  }
  
  useEffect(() => {
    if (searchIngredient && inputFocus) {

      const searched = searchIngredient.trim().toLowerCase();
      setSearchedIngredients(context.ingredients.filter((ingredient) => ingredient.name.toLowerCase().includes(searched)))

    } else {
      setSearchedIngredients(null)
    }
  }, [searchIngredient, inputFocus]);

  useEffect(() => {
    if(!context.saveRegularIngredients.startSave) return

    if(context.saveRegularIngredients.isNewUser) {

      saveIngredientList(userRegularIngredients, context.saveRegularIngredients.userId)
      .then(() => {
        context.setSaveRegularIngredients({startSave: false, userId: null, isNewUser: true})
      })

    } else {

      updateIngredients()

    }

  }, [context.saveRegularIngredients])

  function updateIngredients() {
    const deletedIngredients = regularIngredients.filter(ingredient => !userRegularIngredients.includes(ingredient))
    const addedIngredients = userRegularIngredients.filter(ingredient => !regularIngredients.includes(ingredient))

    saveIngredientList(addedIngredients, context.saveRegularIngredients.userId)
    .then(() => {
      const promises = deletedIngredients.map(ingredient => deleteIngredient(ingredient.name))
      return Promise.all(promises)
    })
    .then(() => {
      context.setSaveRegularIngredients({startSave: false, userId: null, isNewUser: false})
      context.setUpdateAccount(true)
    })
    .then(() => {
      setEditionState('saved')
      setTimeout(() => {
        setEditionState('unchanged')
      }, 2000);
    })
  }

  useEffect(() => {
    switch(editionState) {
      case 'unchanged':

    }
  }, [editionState])

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
    <>
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
      {context.account && !context.isSignedOut && editionState == 'changed' &&
        <button className="font-secondaryFont w-full p-2 bg-primaryColor rounded-lg mt-4 hover:scale-105 transition" type="button" onClick={()=>{context.setSaveRegularIngredients({startSave: true, userId: context.account.id, isNewUser: false})}}> Guardar cambios</button>
      }
      {context.account && !context.isSignedOut && editionState == 'saved' &&
        <button disabled className="font-secondaryFont w-full p-2 text-green-700 rounded-lg mt-4" type="button" onClick={()=>{context.setSaveRegularIngredients({startSave: true, userId: context.account.id, isNewUser: false})}}>Guardado</button>
      }
    </>
  );
}

export default RegularIngredients