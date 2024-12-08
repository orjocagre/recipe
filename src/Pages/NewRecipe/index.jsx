import Layout from "../../Components/Layout";
import { PlusIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useRef, useState } from "react";
import { RecipeContext } from "../../Context";
import { Link, useNavigate } from "react-router-dom";

function NewRecipe() {
  const context = useContext(RecipeContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    procedure: "1. ",
    servings: "",
    hours: "",
    minutes: "",
    image: "",
    userId: context.account.id,
    isPublic: false,
    amount: "",
    description: "",
  });

  const [searchIngredient, setSearchIngredient] = useState("");
  const [searchedIngredients, setSearchedIngredients] = useState(null);
  const [inputFocus, setInputFocus] = useState(false);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const imgRef = useRef(null);
  const imgInputRef = useRef(null);
  const cantInputRef = useRef(null);

  useEffect(() => {
    if (searchIngredient && inputFocus) {
      const searched = searchIngredient.trim().toLowerCase();
      setSearchedIngredients(
        context.ingredients.filter((ingredient) =>
          ingredient.name.toLowerCase().includes(searched)
        )
      );
    } else {
      setSearchedIngredients(null);
    }
  }, [searchIngredient, inputFocus]);

  function removeIngredient(event) {
    try {
      const index = event.target.attributes.ingredientindex.value;
      let newList = [...recipeIngredients];
      newList.splice(index, 1);
      setRecipeIngredients(newList);
    } catch (err) {
      console.log(err);
    }
  }

  function addExistingIngredient(name) {
    // const selectedIngredient = context.ingredients.find(ingredient => ingredient.name == name)
    // if(!recipeIngredients.includes(selectedIngredient)) {
    //   setRecipeIngredients([...recipeIngredients, selectedIngredient])
    // }
    setSearchIngredient(name);
  }

  function addNewIngredient(event) {
    event.preventDefault();
    if (searchIngredient) {
      let ingredient = context.ingredients.find(
        (ingredient) => ingredient.name == searchIngredient
      );

      if (!ingredient) {
        ingredient = { id: null, name: searchIngredient };
      }

      setRecipeIngredients([
        ...recipeIngredients,
        {
          amount: formData.amount,
          ingredient,
          description: formData.description,
        },
      ]);
      setSearchIngredient("");
      setFormData({ ...formData, amount: "", description: "" });
      cantInputRef.current.focus();
    }
  }

  function loseFocus(event) {
    if (event.relatedTarget && event.relatedTarget.attributes.ingredientname) {
      addExistingIngredient(
        event.relatedTarget.attributes.ingredientname.value
      );
      // setSearchIngredient('')
    }
    setInputFocus(false);
  }

  function handleWriteTextarea(event) {
    if (event.key != "Enter" && event.key != "Backspace") return;

    let textarea = event.target;
    let newText = textarea.value;
    let caretIndex = textarea.selectionStart;

    if (event.key == "Backspace") {
      if (newText == "1.") newText = "1. ";

      if (
        newText.substring(caretIndex - 3, caretIndex).search(/\n\d+\./) != -1
      ) {
        newText = newText
          .substring(0, caretIndex - 3)
          .concat(newText.substring(caretIndex));

        caretIndex -= 6;
      } else {
        caretIndex -= 3;
      }
    }

    newText = newText.substring(0, 3) != "1. " ? "1. " + newText : newText;
    let counter = 2;

    newText = newText
      .replaceAll(/\n\d+\. /g, () => `\n`)
      .replaceAll("\n", () => `\n${counter++}. `);

    caretIndex += 3;
    textarea.value = newText;
    textarea.selectionStart = caretIndex;
    textarea.selectionEnd = caretIndex;
  }

  function handleChange(event) {
    let { value, name } = event.target;

    if (event.target.id == "chbPublic") {
      value = event.target.checked;
    }

    // if(event.target.id == 'image') {
    //   value = event.target.files[0]
    // }

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleEnter(event) {
    if (event.key === "Enter") {
      addNewIngredient(event);
    }
  }

  function handleFiles(event) {
    if (!event.target.files[0]) {
      handleChange(event);
      return;
    }
    let file = event.target.files[0];

    setSelectedImage(file);

    console.log(file);

    let reader = new FileReader();
    reader.onload = (function (aImg) {
      return function (e) {
        aImg.src = e.target.result;
      };
    })(imgRef);
    reader.readAsDataURL(file);

    handleChange(event);
  }

  function post(url, body) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  function postImage(url, body) {
    return fetch(url, {
      method: "POST",
      body: body,
    });
  }

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  function saveIngredient(recipeIngredient, recipeId) {
    const recipeIngredientObject = { recipeId };
    if (recipeIngredient.amount)
      recipeIngredientObject.amount = recipeIngredient.amount;
    if (recipeIngredient.description)
      recipeIngredientObject.description = recipeIngredient.description;

    if (recipeIngredient.ingredient.id) {
      recipeIngredientObject.ingredientId = recipeIngredient.ingredient.id;

      post(
        "http://localhost:3000/api/v1/recipe_ingredients/",
        recipeIngredientObject
      ).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save data");
        } else {
          const data = response.json();
          return data;
        }
      });
    } else {
      post("http://localhost:3000/api/v1/ingredients/", {
        name: recipeIngredient.ingredient.name,
      })
        .then((response) => response.json())
        .then((data) => {
          recipeIngredientObject.ingredientId = data.id;

          post(
            "http://localhost:3000/api/v1/recipe_ingredients/",
            recipeIngredientObject
          ).then((response) => {
            if (!response.ok) {
              throw new Error("Failed to save data");
            } else {
              const data = response.json();
              return data;
            }
          });
        });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.procedure ||
      !formData.servings ||
      (!formData.hours && !formData.minutes)
    ) {
      // setErrorConfirmPassword(true)
      return;
    }

    const recipeObject = { ...formData };
    recipeObject.time =
      Number(recipeObject.hours ? recipeObject.hours * 60 : 0) +
      Number(recipeObject.minutes ? recipeObject.minutes : 0);
    delete recipeObject.minutes;
    delete recipeObject.hours;
    delete recipeObject.amount;
    delete recipeObject.description;

    console.log(recipeObject);

    if (formData.image) {
      const fd = new FormData();
      fd.append("name", recipeObject.name);
      fd.append("userId", recipeObject.userId);
      fd.append("procedure", recipeObject.procedure);
      fd.append("servings", recipeObject.servings);
      fd.append("time", recipeObject.time);
      fd.append("isPublic", recipeObject.isPublic);
      fd.append("image", imgInputRef.current.files[0]);

      postImage("http://localhost:3000/api/v1/recipes/", fd)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save data");
          } else {
            const data = response.json();
            return data;
          }
        })
        .then((data) => data.id)
        .then((recipeId) => {
          recipeIngredients.map((recipeIngredient) => {
            saveIngredient(recipeIngredient, recipeId);
          });
        })
        .then(() => {
          navigate("/");
        });
    } else {
      post("http://localhost:3000/api/v1/recipes/", recipeObject)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save data");
          } else {
            const data = response.json();
            return data;
          }
        })
        .then((data) => data.id)
        .then((recipeId) => {
          recipeIngredients.map((recipeIngredient) => {
            saveIngredient(recipeIngredient, recipeId);
          });
        })
        .then(() => {
          navigate("/");
        });
    }
  }

  function IngredientItem({ index, data }) {
    return (
      <>
        {index ? <hr /> : ""}
        <div className="flex justify-between w-full">
          <p className="font-secondaryFont">
            {data.amount}{" "}
            <strong className="text-secondaryColor">
              {data.ingredient.name}
            </strong>{" "}
            {data.description}
          </p>
          <XMarkIcon
            ingredientindex={index}
            className="w-6 h-6 cursor-pointer hover:text-red-600"
            onClick={(event) => removeIngredient(event)}
          />
        </div>
      </>
    );
  }

  function SearchDropdown() {
    return (
      <>
        {searchedIngredients && (
          <div className="absolute w-full top-20 left-0 z-30 flex flex-col drop-shadow-2xl rounded overflow-hidden bg-whiteColor border border-secondaryColor">
            {searchedIngredients.map((ingredient) => (
              <SearchItem
                key={ingredient.id}
                ingredientId={ingredient.id}
                ingredientName={ingredient.name}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  function SearchItem({ ingredientName }) {
    return (
      <>
        <button
          ingredientname={ingredientName}
          className="font-secondaryFont p-2 text-sm hover:bg-secondaryColor hover:text-whiteColor text-left"
          onClick={() => {
            addExistingIngredient(ingredientName);
          }}
        >
          {ingredientName}
        </button>
      </>
    );
  }

  return (
    <Layout>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="flex flex-col">
          <div className="flex gap-3 pb-4 justify-between">
            <h1 className="font-primaryFont text-5xl text-secondaryColor font-bold">
              Nueva Receta
            </h1>
            {window.innerWidth >= 640 && (
              <div className="flex gap-3">
                <button
                  className="font-secondaryFont bg-lightColor p-4 w-minfont-secondaryFont bg-primaryColor text-black border-2 border-primaryColor p-2 rounded-lg flex items-center gap-1 w-min hover:scale-105 transition-transform"
                  type="submit"
                >
                  Guardar
                </button>
                <Link
                  to={"/"}
                  className="font-secondaryFont bg-lightColor p-4 w-minfont-secondaryFont text-black border-2 bg-whiteColor border-primaryColor p-2 rounded-lg flex items-center gap-1 w-min hover:scale-105 transition-transform"
                >
                  Cancelar
                </Link>
              </div>
            )}
          </div>

          <div className="h-[1px] w-full bg-secondaryLigthColor"></div>

          <div className="flex flex-col sm:flex-row">
            <div className="flex flex-col">
              <input
                className="font-secondaryFont w-0 h-0"
                type="file"
                accept=".png, .jpg, .jpeg"
                name="image"
                value={formData.image}
                onChange={(event) => handleFiles(event)}
                id="image"
                ref={imgInputRef}
              />
              <label className="self-center mt-4" htmlFor="image">
                {formData.image ? (
                  <div className="w-28 h-28 relative self-center bg-lightColor cursor-pointer rounded-lg hover:bg-primaryColor flex items-center justify-center">
                    <div className="absolute top-2 right-2 bg-white rounded-xl transition-transform hover:scale-110">
                      <XMarkIcon
                        className="w-6 h-6"
                        onClick={() => setSelectedImage(null)}
                      />
                    </div>
                    <img
                      className="w-full h-full object-cover object-center"
                      src={
                        selectedImage ? URL.createObjectURL(selectedImage) : ""
                      }
                      alt=""
                      ref={imgRef}
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 self-center bg-lightColor cursor-pointer rounded-lg hover:bg-primaryColor flex items-center justify-center">
                    <PlusIcon className="w-8 h-8" />
                  </div>
                )}
              </label>
              <div className="flex flex-col mt-4">
                <label className="font-secondaryFont" htmlFor="txtName">
                  Nombre
                </label>
                <input
                  className="font-secondaryFont p-2 bg-whiteColor border border-secondaryColor rounded-lg focus:outline-none"
                  type="text"
                  id="txtName"
                  name="name"
                  value={formData.name}
                  onChange={(event) => handleChange(event)}
                />
                <div className="flex gap-7">
                  <div className="flex flex-col">
                    <label
                      className="font-secondaryFont mt-4"
                      htmlFor="txtServings"
                    >
                      Porciones
                    </label>
                    <input
                      className="font-secondaryFont p-2 bg-whiteColor border border-secondaryColor rounded-lg focus:outline-none w-16"
                      type="number"
                      id="txtServings"
                      name="servings"
                      value={formData.servings}
                      onChange={(event) => handleChange(event)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="font-secondaryFont mt-4"
                      htmlFor="txtTime"
                    >
                      Tiempo
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        className="font-secondaryFont p-2 bg-whiteColor border border-secondaryColor rounded-lg focus:outline-none w-16"
                        type="number"
                        id="txtTime"
                        name="hours"
                        value={formData.hours}
                        onChange={(event) => handleChange(event)}
                      />
                      <p className="font-secondaryFont">hr</p>
                      <input
                        className="font-secondaryFont p-2 bg-whiteColor border border-secondaryColor rounded-lg focus:outline-none w-16"
                        type="number"
                        id="txtTime"
                        name="minutes"
                        value={formData.minutes}
                        onChange={(event) => handleChange(event)}
                      />
                      <p className="font-secondaryFont">min</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mt-4 align-middle gap-1">
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    id="chbPublic"
                    name="isPublic"
                    value={formData.isPublic}
                    onChange={(event) => handleChange(event)}
                  />
                  <label className="cursor-pointer" htmlFor="chbPublic">
                    Public
                  </label>
                </div>
              </div>
            </div>

            <div className="flex-1 sm:border-l-[1px] border-secondaryLigthColor sm:pl-8 sm:ml-8">
              <div className="flex flex-col sm:flex-row gap-4 pb-4">
                <div className="flex flex-col">
                  <label
                    className="font-secondaryFont mt-4"
                    htmlFor="txtAmount"
                  >
                    Ingredientes
                  </label>
                  <div className="shadow-md rounded-lg w-fit p-2 mt-2">
                    <p className="font-secondaryFont text-sm font-light">
                      Ingrese los ingredientes como en el ejemplo, puede usar{" "}
                      <strong>tab</strong> para moverse y <strong>enter</strong>{" "}
                      para agregar
                    </p>
                    <div className="grid grid-cols-3 grid-rows-2 p-2 gap-1 items-center justify-items-center w-fit mt-2">
                      <p className="font-secondaryFont text-sm text-green-600 text-center">
                        cantidad (opcional)
                      </p>
                      <p className="font-secondaryFont text-sm text-blue-600 text-center">
                        ingrediente (obligatorio)
                      </p>
                      <p className="font-secondaryFont text-sm text-yellow-600 text-center">
                        descripción (opcional)
                      </p>
                      <p className="font-secondaryFont font-bold text-green-600">
                        1 taza de
                      </p>
                      <p className="font-secondaryFont font-bold text-blue-600">
                        cebolla
                      </p>
                      <p className="font-secondaryFont font-bold text-yellow-600">
                        en julianas
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col">
                      <label
                        className="font-secondaryFont mt-4"
                        htmlFor="txtAmount"
                      >
                        Cantidad
                      </label>
                      <input
                        className="font-secondaryFont p-2 bg-whiteColor border border-secondaryColor rounded-l-lg focus:outline-none w border-r-2 w-[calc(calc(100vw-3.5rem)/3)] sm:w-auto"
                        type="text"
                        id="txtAmount"
                        name="amount"
                        ref={cantInputRef}
                        value={formData.amount}
                        onChange={(event) => handleChange(event)}
                        onKeyDown={(event) => handleEnter(event)}
                      />
                    </div>
                    <div className="relative flex flex-col">
                      <label
                        className="font-secondaryFont mt-4"
                        htmlFor="txtIngredient"
                      >
                        Ingrediente*
                      </label>
                      <input
                        className="font-secondaryFont p-2 bg-whiteColor border-t border-b border-secondaryColor focus:outline-none w-[calc(calc(100vw-3.5rem)/3)] sm:w-auto"
                        type="text"
                        id="txtIngredient"
                        value={searchIngredient}
                        onChange={(event) =>
                          setSearchIngredient(event.target.value)
                        }
                        onFocus={() => setInputFocus(true)}
                        onBlur={(event) => loseFocus(event)}
                        onKeyDown={(event) => handleEnter(event)}
                      />
                      <SearchDropdown />
                    </div>
                    <div className="flex flex-col">
                      <label
                        className="font-secondaryFont mt-4"
                        htmlFor="txtDescription"
                      >
                        Descripción
                      </label>
                      <input
                        className="font-secondaryFont p-2 bg-whiteColor border border-secondaryColor rounded-r-lg focus:outline-none border-l-2 w-[calc(calc(100vw-3.5rem)/3)] sm:w-auto"
                        type="text"
                        id="txtDescription"
                        name="description"
                        value={formData.description}
                        onChange={(event) => handleChange(event)}
                        onKeyDown={(event) => handleEnter(event)}
                      />
                    </div>
                    <button
                      className="hover:bg-primaryColor w-10 h-10 flex items-center justify-center rounded-lg self-end ml-1"
                      onClick={(event) => addNewIngredient(event)}
                    >
                      <PlusIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="w-full mt-11">
                  {recipeIngredients.map((ingredient, index) => (
                    <IngredientItem
                      key={index}
                      data={ingredient}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              <hr />

              <div className="flex flex-col pt-4">
                <label className="font-secondaryFont" htmlFor="txtProcedure">
                  Procedimiento
                </label>
                <textarea
                  className="font-secondaryFont p-2 bg-whiteColor border border-secondaryColor rounded-lg focus:outline-none h-48"
                  name="procedure"
                  value={formData.procedure}
                  onKeyUp={(event) => handleWriteTextarea(event)}
                  onChange={(event) => handleChange(event)}
                  id="txtProcedure"
                ></textarea>
              </div>
            </div>
          </div>
          {window.innerWidth < 640 && (
            <div className="flex gap-3 justify-end mt-4">
              <Link
                to={"/"}
                className="font-secondaryFont bg-lightColor p-4 w-minfont-secondaryFont text-black border-2 bg-white border-primaryColor p-2 rounded-lg flex items-center gap-1 w-min"
              >
                Cancelar
              </Link>
              <button
                className="font-secondaryFont bg-lightColor p-4 w-minfont-secondaryFont bg-primaryColor text-black border-2 border-primaryColor p-2 rounded-lg flex items-center gap-1 w-min"
                type="submit"
              >
                Guardar
              </button>
            </div>
          )}
        </div>
      </form>
    </Layout>
  );
}

export default NewRecipe;
