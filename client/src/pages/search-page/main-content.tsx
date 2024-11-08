import { FaClock, FaMoneyBill } from "react-icons/fa";
import SearchForm from "../../components/search-form";
import { Link, useNavigate, useParams } from "react-router-dom";

type PropType = {
  resturants: any[];
  city: string;
  total: number;
  setSortOption: any;
  onSubmitSearch: any;
  reset: any;
  page: number;
  pages: number;
  setPage: any;
};
const MainContent = ({
  resturants,
  city,
  total,
  setSortOption,
  onSubmitSearch,
  reset,
  page,
  pages,
  setPage,
}: PropType) => {
  return (
    <div className="my-5  ">
      {/*TODO :  PLACE HOLDER : SEARCH BY CUISINE OR RESTURANT NAME. */}
      <SearchForm
        reset={reset}
        placeholderText="Search By Cuisine or Resturant Name"
        onSubmit={onSubmitSearch}
      />
      <p className="font-semibold my-3">
        {total} Resturants Found in {city}
        <span className="text-blue-600 underline font-normal ml-1">
          Change Location
        </span>
      </p>
      {/* SORT CONTAINER */}
      <div className="flex justify-end outline-none">
        Sort by
        <select
          className="outline-none"
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value={undefined} className="rounded-full ">
            Best Match
          </option>
          <option value={"estimatedDeliveryTime"}>
            Estimated Delivery Time{" "}
          </option>
          <option value={"deliveryPrice"}>Delivery Price</option>
        </select>
      </div>
      {/* RESTURANT CARD. */}
      {resturants.map((resturant) => {
        return <ResturantCard key={resturant._id} resturant={resturant} />;
      })}

      {/* PAGINATION CONTAINER */}
      <div className="flex  mt-10  justify-center items-center gap-4 text-gray-700">
        <button
          disabled={page === 1}
          className="rounded-md p-1 text-white bg-black hover:text-black hover:bg-white hover:border hover:border-black disabled:cursor-not-allowed"
          onClick={() => setPage(-1)}
        >
          previous
        </button>
        <p>
          {page} outof {pages}
        </p>
        <button
          disabled={page === pages}
          className="rounded-md border p-1 text-white bg-black hover:text-black hover:bg-white hover:border hover:border-black disabled:cursor-not-allowed "
          onClick={() => setPage(1)}
        >
          next
        </button>
      </div>
    </div>
  );
};

const ResturantCard = ({ resturant }: { resturant: any }) => {
  const { city } = useParams();
  return (
    <Link
      to={`/resturant/${city}/${resturant._id}`}
      className="mt-5 lg:flex lg:gap-4"
    >
      <img
        src={resturant.imageUrl}
        alt="image container"
        className="bg-blue-300 mb-2 w-full h-40  border border-gray-500 rounded-md object-cover lg:w-1/2 "
      ></img>
      <div>
        <h1 className="font-semibold">
          {resturant.resturantName || resturant.restaurantName}{" "}
        </h1>
        <div className="text-gray-600 flex gap-1 items-center">
          {resturant.cuisines?.map((cuisine: string, index: number) => {
            return index < 4 ? (
              <p key={cuisine} className="flex items-center ">
                <span className="">
                  {index !== 0 && (
                    <div className="size-1 rounded-full bg-gray-600 mr-1"></div>
                  )}
                </span>
                {cuisine}
              </p>
            ) : (
              <></>
            );
          })}
          {resturant.cuisines.length > 4 && (
            <span className="text-gray-600">....</span>
          )}
        </div>
        <p className="text-green-400 flex items-center gap-1">
          <FaClock />
          {resturant.estimatedDeliveryTime} min
        </p>
        <p className="text-gray-600 flex items-center gap-1">
          <FaMoneyBill />
          Delivery from {resturant.deliveryPrice} min
        </p>
      </div>
    </Link>
  );
};

export default MainContent;
