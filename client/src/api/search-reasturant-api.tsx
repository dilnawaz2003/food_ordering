import { useQuery } from "react-query";
import { SearchState } from "../pages/search-page/search-resturants-page";

// {
//   city: string;
//   sortOption?: string;
//   cuisines?: string[];
//   userSearch?: string;
// }

export const useSearchResturant = (city: string, searchState: SearchState) => {
  // console.log(searchState);
  const requestFn = async () => {
    console.log("search api called");
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.userSearch);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.cuisines.join(","));
    params.set("sortOption", searchState.sortOption);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const res = await fetch(
      `${baseUrl}/api/resturant/search/city/${city}?${params.toString()}`
    );
    if (!res.ok) throw new Error("Unable to get resturants");
    return res.json();
  };

  const {
    data: resturantData,
    isError,
    isFetching,
    refetch,
  } = useQuery(["searchResturant", searchState], requestFn);

  return { resturantData, isError, isFetching, refetch };
};

export const useGerRestaurantById = (id: string) => {
  const request = async () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const res = await fetch(`${baseUrl}/api/resturant/search/${id}`);

    if (!res.ok) throw new Error("Unable to get Restaurant");

    return res.json();
  };

  const {
    data: restaurant,
    isLoading,
    isError,
  } = useQuery("getRestaurantById", request);

  return { restaurant, isLoading, isError };
};
