import { useContext, useState } from "react";
import Layout from "../../Components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../../Context";

function Login() {
  const context = useContext(RecipeContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [notFoundUser, setNotFoundUser] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.userName || !formData.password) {
      return;
    }

    fetch("http://localhost:3000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.userName) {
          context.setAccount(data);
          localStorage.setItem("account", JSON.stringify(data));
          context.setIsSignedOut(false);
          localStorage.setItem("sign-out", JSON.stringify(false));
          console.log(data);
          console.log(context.account);
          navigate("/");
        } else {
          setNotFoundUser(true);
        }
      });

  }

  return (
    <Layout>
      <div className="w-full flex justify-center">
        <form
          className="w-80 flex flex-col m-8"
          onSubmit={(event) => handleSubmit(event)}
        >
          <h1 className="text-lg font-secondaryFont self-center">Login</h1>
          <p className="font-secondaryFont mt-6">Nombre de usuario</p>
          <input
            className="font-secondaryFont bg-whiteColor border border-secondaryColor rounded-lg p-2 w-full focus:outline focus:outline-1"
            type="text"
            name="userName"
            value={formData.userName}
            onChange={(event) => handleChange(event)}
          />
          <p className="font-secondaryFont mt-6">Contraseña</p>
          <input
            className="font-secondaryFont bg-whiteColor border border-secondaryColor rounded-lg p-2 w-full focus:outline focus:outline-1"
            type="text"
            name="password"
            value={formData.password}
            onChange={(event) => handleChange(event)}
          />
          {notFoundUser ? (
            <p className="font-secondaryFont text-red-600 mt-4">
              Usuario o contraseña incorrectos
            </p>
          ) : (
            <p className="hidden">Usuario o contraseña incorrectos</p>
          )}
          <button className="font-secondaryFont p-4 rounded-lg text-secondaryColor border-2 border-secondaryColor font-bold text-lg mt-8 hover:scale-105 transition-transform">
            Iniciar Sesion
          </button>
          <div className="flex gap-2 mt-4 self-center">
            <p>No tienes cuenta?</p>
            <button
              type="button"
              onClick={(() => {
                let regularIngredients = context.ingredients
                  ? context.ingredients.filter(
                      (ingredient) => ingredient.isCommon === true
                    )
                  : [];
                context.setTempIngredientList(regularIngredients);
                navigate("/SignIn");
              })}
              className="font-secondaryFont text-secondaryColor font-medium underline"
            >
              Registrate
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
