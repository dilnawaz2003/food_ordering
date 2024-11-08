import { useRef } from "react";
import { AiOutlineClose, AiOutlineLine } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";

type PropsType = {
  placeholderText: string;
  onSubmit: any;
  reset: any;
};

const SearchForm = ({ placeholderText, onSubmit, reset }: PropsType) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(inputRef.current?.value || "");
        // setUserSearch(inputRef.current?.value);
      }}
      className={`w-full border border-gray-300 px-2 py-1 rounded-full ${
        // errors && errors.city && "border-red-500"
        ""
      } `}
    >
      <div className="flex justify-between items-center gap-2">
        <FaSearch className="text-primary hidden sm:flex" />
        <input
          className="flex-1 outline-none"
          placeholder={placeholderText}
          ref={inputRef}
        ></input>
        <div className="flex items-center">
          <AiOutlineClose
            className="text-primary sm:hidden"
            onClick={() => {
              inputRef!.current!.value = "";
              reset();
            }}
          />
          <AiOutlineLine className="text-primary  sm:hidden rotate-90 " />
          <FaSearch className="text-primary sm:hidden" type="submit" />
          <button
            onClick={() => {
              inputRef!.current!.value = "";
              reset();
            }}
            type="button"
            className="font-medium hidden sm:inline-block"
          >
            reset
          </button>

          <button
            type="submit"
            className="bg-primary hidden sm:inline-block text-white font-medium px-2 py-1 rounded-full ml-2"
          >
            search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
