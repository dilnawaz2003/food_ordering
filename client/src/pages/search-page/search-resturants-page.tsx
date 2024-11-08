import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSearchResturant } from "../../api/search-reasturant-api";
import CuisinesList from "./cuisines-list";
import MainContent from "./main-content";
import LoadingSpinner from "../../components/loading-spinner";

export type SearchState = {
  cuisines: string[];
  sortOption: string;
  userSearch: string;
  page: number;
};

const SearchResturants = () => {
  const [viewMore, setViewMore] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<SearchState>({
    cuisines: [],
    sortOption: "lastUpdated",
    userSearch: "",
    page: 1,
  });

  let { city } = useParams();
  city = city as string;

  const { resturantData, isFetching } = useSearchResturant(city, searchState);

  const resetAllFilters = () => {
    setSearchState({
      cuisines: [],
      sortOption: "lastUpdated",
      userSearch: "",
      page: 1,
    });
  };

  const resetSearch = () => {
    setSearchState((prev) => ({ ...prev, userSearch: "", page: 1 }));
  };

  const setSelectedCuisines = (cuisines: string[]) => {
    setSearchState((prev) => ({ ...prev, cuisines, page: 1 }));
  };

  const setUserSearchQuery = (value: string) => {
    setSearchState((prev) => ({ ...prev, userSearch: value, page: 1 }));
  };

  const setSortOption = (sortOption: string) => {
    setSearchState((prev) => ({ ...prev, sortOption, page: 1 }));
  };

  const setPage = (value: number) => {
    const page = resturantData.pagination.page;
    const pages = resturantData.pagination.pages;

    if ((page === 1 && value < 0) || (page === pages && value > 0)) return;
    setSearchState((prev) => ({
      ...prev,
      page: prev.page + value,
    }));
  };

  if (isFetching) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  // console.log("page renderd ");
  console.log(resturantData);
  return (
    <div className="grid grid-cols-1 px-3 min-h-screen  sm:w-[80%] mx-auto md:grid-cols-[2fr,5fr] md:gap-5 md:w-[92%]">
      {/* CUISINES LIST  */}
      <CuisinesList
        cuisines={searchState.cuisines}
        setCuisines={setSelectedCuisines}
        viewMore={viewMore}
        setViewMore={setViewMore}
        resetAllFilters={resetAllFilters}
      />
      {/* MAIN CONTENTS */}
      <div id="main-content">
        <MainContent
          reset={resetSearch}
          resturants={resturantData.data}
          city={city}
          total={resturantData.pagination.total}
          setSortOption={setSortOption}
          onSubmitSearch={setUserSearchQuery}
          page={resturantData.pagination.page}
          pages={resturantData.pagination.pages}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default SearchResturants;
