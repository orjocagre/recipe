import { createContext, useState, useEffect } from "react";

export const RecipeContext = createContext();

export const initializeLocalStorage = () => {
  const accountInLocalStorage = localStorage.getItem('account')
  const signOutInLocalStorage = localStorage.getItem('sign-out')
  let parsedAccount
  let parsedSignOut

  if(!accountInLocalStorage) {
    localStorage.setItem('account', JSON.stringify({}))
    parsedAccount = {}
  } else {
    parsedAccount = JSON.parse(accountInLocalStorage)
  }

  if(!signOutInLocalStorage) {
    localStorage.setItem('sign-out', JSON.stringify(true))
    parsedSignOut = true
  } else {
    parsedSignOut = JSON.parse(signOutInLocalStorage)
  }
}

export const RecipeProvider = ({ children }) => {

  console.log('rerender')

  // Logged In account
  const parsedAccount = JSON.parse(localStorage.getItem('account'))
  const [account, setAccount] = useState(parsedAccount)

  // Signed out
  const parsedIsSignedOut = JSON.parse(localStorage.getItem('sign-out'))
  const [isSignedOut, setIsSignedOut] = useState(parsedIsSignedOut)

  // Trigger fetch account
  const [updateAccount, setUpdateAccount] = useState(false)

  // Nav side menu (phone) · Open/Close
  const [isSideMenuActive, setIsSideMenuActive] = useState(false);

  // Search view (phone) · Open/Close
  const [isSearchActive, setIsSearchActive] = useState(false);

  // List of ingredients
  const [ingredients, setIngredients] = useState(null);

  // List of recipes
  const [recipes, setRecipes] = useState(null);

  // Search input (search box) · Recipe or ingredient typed
  const [searchRecipeOrIngredient, setSearchRecipeOrIngredient] = useState("");

  // List of searched recipes (Search box) · Just recipes
  const [searchedRecipes, setSearchedRecipes] = useState(null);

  // List of searched recipes by ingredient (Search box) · Recipes grouped by ingredient
  const [searchedByIngredient, setSearchedByIngredient] = useState(null);

  // Text searched (Home) 
  const [textSearched, setTextSearched] = useState('')

  // List of searched recipes (Home) · Just recipes
  const [searchedRecipesHome, setSearchedRecipesHome] = useState(null);

  // List of searched recipes by ingredient (Home) · Recipes grouped by ingredient
  const [searchedByIngredientHome, setSearchedByIngredientHome] = useState(null);

  // Recipe detail · Show recipe
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  // Save in db regular ingredients list or updates it if it is not a new user
  const [saveRegularIngredients, setSaveRegularIngredients] = useState({startSave: false, userId: null, isNewUser: false})


  async function login(userName, password) {
    fetch('http://localhost:3000/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({userName, password})
      })
      .then(response => (response.json()))
      .then(data =>  {
        if(data && data.userName) {
          setAccount(data)
          setIsSignedOut(false)
          localStorage.setItem('account', JSON.stringify(data))
          localStorage.setItem('sign-out', JSON.stringify(false))
          return true
        }
      })
  }

  useEffect(() => {
    if(updateAccount) {
      if(Object.keys(account).length > 0) {
        login(account.userName, account.password)
      }
      setUpdateAccount(false)
    }
  },[updateAccount])

  // List of displayed Recipes
  // const recipeList = [
  //   {
  //     name: 'Filete de pollo en salsa de hongos',
  //     ingredients: [
  //       { name: 'pollo', amount: '5 lbs' },
  //       { name: 'hongos', amount: '1/2 lbs' },
  //       { name: 'crema', amount: '2 cucharadas' },
  //       { name: 'maicena', amount: '4 onz' },
  //       { name: 'sal', amount: 'al gusto' }
  //     ],
  //     procedure: 'Sofreír el pollo, luego agregar la salsa, esperar a que hierva, poner sal al gusto y dejar reposar por 30 minutos.',
  //     duration: '20 min',
  //     servings: '4 porciones',
  //     image: 'https://www.lactaid.com/sites/lactaid_us/files/recipe-images/chicken_in_creamy_mushroom_sauce.jpg',

  //   },
  //   {
  //     name: 'Pasta Alfredo',
  //     ingredients: [
  //       { name: 'pasta', amount: '1 lb' },
  //       { name: 'mantequilla', amount: '1/2 taza' },
  //       { name: 'crema', amount: '1 taza' },
  //       { name: 'ajo', amount: '2 dientes' },
  //       { name: 'queso parmesano', amount: '1 taza' },
  //       { name: 'sal', amount: 'al gusto' }
  //     ],
  //     procedure: 'Cocinar la pasta al dente, derretir la mantequilla en una sartén, agregar el ajo, la crema y el queso parmesano, mezclar con la pasta cocida y añadir sal al gusto.',
  //     duration: '20 min',
  //     servings: '4 porciones',
  //     image: 'https://mojo.generalmills.com/api/public/content/8GresqM3pUK_fXrmtlyKjg_gmi_hi_res_jpeg.jpeg?v=df1663f8&t=16e3ce250f244648bef28c5949fb99ff',
  //   },
  //   {
  //     name: 'Ensalada César',
  //     ingredients: [
  //       { name: 'lechuga romana', amount: '1 cabeza' },
  //       { name: 'pan blanco', amount: '2 rebanadas' },
  //       { name: 'aceite de oliva', amount: '1/4 taza' },
  //       { name: 'filete de anchoa', amount: '2 unidades' },
  //       { name: 'queso parmesano', amount: '1/2 taza' },
  //       { name: 'limón', amount: '1 unidad' },
  //       { name: 'ajo', amount: '1 diente' },
  //       { name: 'sal', amount: 'al gusto' }
  //     ],
  //     procedure: 'Cortar la lechuga en trozos pequeños, dorar el pan en aceite de oliva, mezclar con el ajo machacado, las anchoas picadas, el queso rallado, el jugo de limón y la sal, agregar la lechuga y servir.',
  //     duration: '20 min',
  //     servings: '4 porciones',
  //     image: 'https://www.comedera.com/wp-content/uploads/2023/10/shutterstock_1087243763.jpg',
  //   },
  //   {
  //     name: 'Sopa de tomate',
  //     ingredients: [
  //       { name: 'tomates', amount: '1 kg' },
  //       { name: 'cebolla', amount: '1 unidad' },
  //       { name: 'ajo', amount: '2 dientes' },
  //       { name: 'caldo de pollo', amount: '1 litro' },
  //       { name: 'azúcar', amount: '1 cucharadita' },
  //       { name: 'sal', amount: 'al gusto' },
  //       { name: 'pimienta', amount: 'al gusto' }
  //     ],
  //     procedure: 'Pelar y picar los tomates y la cebolla, sofreír con el ajo en una olla grande, agregar el caldo de pollo, el azúcar, la sal y la pimienta, cocinar a fuego lento durante 20 minutos, licuar y servir caliente.',
  //     duration: '20 min',
  //     servings: '4 porciones',
  //     image: 'https://www.gourmet.cl/wp-content/uploads/2018/05/Sopa-de-tomate-570x458.jpg',
  //   },
  //   {
  //     name: 'Hamburguesa Clásica',
  //     ingredients: [
  //       { name: 'carne molida', amount: '1 lb' },
  //       { name: 'pan para hamburguesa', amount: '4 unidades' },
  //       { name: 'queso cheddar', amount: '4 lonchas' },
  //       { name: 'lechuga', amount: '4 hojas' },
  //       { name: 'tomate', amount: '4 rodajas' },
  //       { name: 'cebolla', amount: '1 unidad' },
  //       { name: 'mostaza', amount: 'al gusto' },
  //       { name: 'kétchup', amount: 'al gusto' },
  //       { name: 'sal', amount: 'al gusto' },
  //       { name: 'pimienta', amount: 'al gusto' }
  //     ],
  //     procedure: 'Formar las hamburguesas con la carne molida, sazonar con sal y pimienta, cocinar a la parrilla o en una sartén caliente hasta que estén cocidas, armar las hamburguesas con los ingredientes restantes y servir.',
  //     duration: '20 min',
  //     servings: '4 porciones',
  //     image: 'https://d31npzejelj8v1.cloudfront.net/media/recipemanager/recipe/1687289278_clasica-bem.jpg',
  //   },
  //   {
  //     name: 'Tacos de Carnitas',
  //     ingredients: [
  //       { name: 'paleta de cerdo', amount: '2 lbs' },
  //       { name: 'cebolla', amount: '1 unidad' },
  //       { name: 'limón', amount: '2 unidades' },
  //       { name: 'cilantro', amount: '1 manojo' },
  //       { name: 'tortillas de maíz', amount: '16 unidades' },
  //       { name: 'salsa verde', amount: 'al gusto' },
  //       { name: 'sal', amount: 'al gusto' },
  //       { name: 'aceite', amount: 'suficiente para freír' }
  //     ],
  //     procedure: 'Cocinar la paleta de cerdo en agua con sal hasta que esté tierna, desmenuzarla y freírla en aceite caliente hasta que esté dorada y crujiente, servir en tortillas de maíz con cebolla, cilantro, limón y salsa verde.',
  //     duration: '20 min',
  //     servings: '4 porciones',
  //     image: 'https://www.goya.com/media/3193/carnitas.jpg?quality=80',
  //   },
  //   {
  //     name: 'Coq au Vin',
  //     ingredients: [
  //       { name: 'pollo', amount: '1 pollo entero' },
  //       { name: 'tocino', amount: '100g' },
  //       { name: 'cebolla', amount: '2 unidades' },
  //       { name: 'zanahoria', amount: '2 unidades' },
  //       { name: 'ajo', amount: '4 dientes' },
  //       { name: 'champiñones', amount: '200g' },
  //       { name: 'vino tinto', amount: '1 botella' },
  //       { name: 'caldo de pollo', amount: '500ml' },
  //       { name: 'harina', amount: '2 cucharadas' },
  //       { name: 'mantequilla', amount: '2 cucharadas' },
  //       { name: 'aceite de oliva', amount: '2 cucharadas' },
  //       { name: 'tomillo', amount: '2 ramitas' },
  //       { name: 'laurel', amount: '2 hojas' },
  //       { name: 'sal', amount: 'al gusto' },
  //       { name: 'pimienta', amount: 'al gusto' }
  //     ],
  //     procedure: 'Marinar el pollo en vino tinto durante al menos 2 horas. En una cazuela grande, dorar el tocino y reservar. En la misma cazuela, dorar el pollo marinado por todos lados. Agregar la cebolla, la zanahoria, el ajo y los champiñones cortados en trozos grandes. Espolvorear con harina y revolver. Agregar el vino tinto, el caldo de pollo, el tomillo y el laurel. Cocinar a fuego lento durante 1 hora y media o hasta que el pollo esté tierno. Servir caliente.',
  //     duration: '20 min',
  //     servings: '4 porciones',
  //     image: 'https://images.immediate.co.uk/production/volatile/sites/30/2012/01/coq-au-vin-3740fe3.jpg?quality=90&resize=556,505',
  //   }
  // ];

  useEffect(() => {

    let userId = Object.keys(account).length > 0 ? account.id : ''
    userId = isSignedOut ? '' : userId

    // Update recipe list
    fetch(("http://localhost:3000/api/v1/recipes/all/" + userId))
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data)
        setSearchedRecipesHome(data)
        setSearchedByIngredientHome(null)
      });

    // Update ingredient list
    userId = userId ? userId : 0
    console.log(userId)
    fetch("http://localhost:3000/api/v1/ingredients/user/" + userId)
      .then((response) => response.json())
      .then((data) => setIngredients(data));
  }, [account, isSignedOut]);

  

  useEffect(() => {

    if (searchRecipeOrIngredient) {
      setIsSearchActive(true);

      const searched = searchRecipeOrIngredient.trim().toLowerCase();
      setSearchedRecipes(
        recipes.filter((recipe) => recipe.name.toLowerCase().includes(searched))
      );

      let ingredients = [];
      recipes.forEach((recipe) => {
        ingredients.push(...recipe.ingredients);
      });
      ingredients = ingredients.map((ingredient) => ingredient.name);
      ingredients = ingredients.filter(
        (ingredient, index) => ingredients.indexOf(ingredient) === index
      );

      ingredients = ingredients.filter((ingredient) =>
        ingredient.toLowerCase().includes(searched)
      );

      const groupedRecipes = ingredients.map((ingredient) => ({
        ingredient,
        recipes: recipes.filter((recipe) =>
          recipe.ingredients.reduce(
            (acumulator, current) => acumulator + (current.name === ingredient),
            0
          )
        ),
      }));
      setSearchedByIngredient(groupedRecipes);
    } else {
      setSearchedRecipes(null);
      setSearchedByIngredient(null);
      window.innerWidth >= 640 && setIsSearchActive(false);
    }
  }, [searchRecipeOrIngredient, recipes]);

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        setRecipes,
        searchRecipeOrIngredient,
        setSearchRecipeOrIngredient,
        searchedRecipes,
        searchedByIngredient,
        isSearchActive,
        setIsSearchActive,
        account,
        setAccount,
        isSignedOut,
        setIsSignedOut,
        isSideMenuActive,
        setIsSideMenuActive,
        ingredients,
        setIngredients,
        selectedRecipe,
        setSelectedRecipe,
        setUpdateAccount,
        searchedRecipesHome,
        setSearchedRecipesHome,
        searchedByIngredientHome,
        setSearchedByIngredientHome,
        textSearched,
        setTextSearched,
        saveRegularIngredients,
        setSaveRegularIngredients,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
