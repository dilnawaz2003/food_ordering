import { FaArrowDown, FaArrowUp, FaCheck } from "react-icons/fa";
import { cuisinesList } from "../../utils/constants";

const CuisinesList = ({
  setCuisines,
  cuisines,
  viewMore,
  setViewMore,
  resetAllFilters,
}: {
  setCuisines: any;
  cuisines: string[];
  viewMore: boolean;
  setViewMore: any;
  resetAllFilters: any;
}) => {
  return (
    <div id="cuisines-list" className="cursor-pointer">
      <div className="flex justify-between">
        <span className="font-semibold">Filter By Cuisines</span>
        <span
          className="underline text-blue-700 cursor-pointer"
          onClick={resetAllFilters}
        >
          Reset Filters
        </span>
      </div>

      <div>
        {cuisinesList.map((cuisine, index) => {
          const includeCuisine = cuisines.includes(cuisine);
          return (
            <div key={cuisine}>
              {(index < 4 || viewMore) && (
                <div
                  className={`rounded-full border border-gray-400 font-meduim  text-center p-2 my-3 shadow-md ${
                    includeCuisine && "text-green-400"
                  }`}
                  onClick={() => {
                    if (!includeCuisine) {
                      setCuisines([...cuisines, cuisine]);
                      // field.onChange([...field?.value, cuisine]);
                    } else {
                      let tempCuisines = [...cuisines];
                      tempCuisines = tempCuisines.filter(
                        (val: string) => val !== cuisine
                      );
                      setCuisines(tempCuisines);
                      // field.onChange(
                      //   field.value.filter((val: string) => val !== cuisine)
                      // );
                    }
                  }}
                >
                  {includeCuisine && <FaCheck className="inline mr-2" />}
                  {cuisine}
                </div>
              )}
            </div>
          );
        })}
        <div className="text-center font-semibold mt-2">
          {viewMore ? (
            <span
              className="flex items-center justify-center gap-2"
              onClick={() => setViewMore(false)}
            >
              View Less <FaArrowUp />
            </span>
          ) : (
            <span
              className="flex items-center justify-center gap-2"
              onClick={() => setViewMore(true)}
            >
              View More <FaArrowDown />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CuisinesList;
