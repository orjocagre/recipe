import Layout from "../../Components/Layout";
import RegularIngredients from "../../Components/RegularIngredients";
import { Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../Context";
import { useContext, useEffect, useState } from "react";

function SignIn() {
  const context = useContext(RecipeContext);
  const navigate = useNavigate()

  const [formData, setFormData] = useState({userName: '', password: '', confirmPassword: ''})
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false)

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

  function logIn() {
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

    post('http://localhost:3000/api/v1/users/', userObject)
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to save data')
      }
      else {
        return response.json()
      }
    })
    .then(data => (data.id))
    .then(userId => {
      context.setSaveRegularIngredients({startSave: true, userId: userId, isNewUser: true})
    }
    )
    .catch(error => {
      console.log('Error:', error)
    })
  }

  useEffect(() => {
    if(!context.saveRegularIngredients.startSave && context.saveRegularIngredients.isNewUser) logIn()
  }, [context.saveRegularIngredients])

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
          <RegularIngredients/>

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

export default SignIn;
