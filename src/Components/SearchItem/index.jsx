const SearchItem = ({recipeName}) => {
  return (
    <>
      <p className="font-secondaryFont p-4 cursor-pointer hover:bg-secondaryColor hover:text-lightColor">{recipeName}</p>
    </>
  )
}
export default SearchItem