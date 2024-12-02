import Layout from "../../Components/Layout";
import RegularIngredients from "../../Components/RegularIngredients";
import { Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../Context";
import { useContext, useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

function MyAccount() {
  const context = useContext(RecipeContext);
  const navigate = useNavigate()

  const [formData, setFormData] = useState({userName: context.account.userName, password: context.account.password, confirmPassword: context.account.password})
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false)
  const [isEditActive, setIsEditActive] = useState(false)

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
              <button className="font-secondaryFont p-4 rounded-lg flex-1 text-secondaryColor border-2 border-secondaryColor font-bold text-lg mt-8 hover:scale-105 transition-transform" type="button" onClick={event => cancelEdition(event)}>Cancelar</button>
              <button className="font-secondaryFont p-4 rounded-lg flex-1 bg-secondaryColor text-white border-2 border-secondaryColor font-bold text-lg mt-8 hover:scale-105 transition-transform" type="submit" onClick={event => handleSubmit(event)}>Guardar</button>
            </div>
          </form>
        </div>
      :
        <div className="w-full flex justify-center">
          <div className="w-80 flex flex-col m-8">
            <h1 className="text-lg font-secondaryFont self-center">Cuenta</h1>
            <form>
              <RegularIngredients/>
            </form>
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
