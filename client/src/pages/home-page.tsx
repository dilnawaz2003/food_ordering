import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "../components/search-form";

// const homePageSearchSchema = z.object({
//   city: z.string().min(1, "city is required"),
// });

const HomePage = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");

  const onSubmitSearch = (value: string) => {
    setCity(value);
    navigate(`/resturants/${value}`);
  };

  const reset = () => {
    setCity("");
  };
  return (
    <div>
      {/* Image with text Container */}
      <div className="h-[calc(100vh-40vh)] sm:h-[calc(100vh-4rem)] flex justify-around items-center p-10 gap-10 bg-primary">
        <div className="hidden md:flex md:flex-1 ">
          <h1 className="font-bold text-5xl text-white">
            It's not just Food it's an Experience.
          </h1>
        </div>
        <div className="flex-1  flex justify-center items-center">
          <img src="..\src\assets\food1.png" className="w-2/3"></img>
        </div>
      </div>
      {/* Search Bar Container */}
      <div className="m-2 w-[95%] p-2 sm:p-10 sm:w-4/5 md:2/3 flex flex-col justify-center items-center gap-5  shadow-md shadow-gray-300 bg-white border border-gray-300  mx-auto rounded-md relative top-[-20px]">
        <div className="text-primary font-bold text-2xl">
          Tuck into a takeway today
        </div>
        <div className=" font-bold">Food is just a click away!</div>
        <div className="w-full ">
          {/* Search Form */}
          <SearchForm
            reset={reset}
            placeholderText="search by city or town"
            onSubmit={onSubmitSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
