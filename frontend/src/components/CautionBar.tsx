import React from "react";
import { X } from "lucide-react";

const CautionBar = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-red-500 text-white px-4 py-2 flex items-center w-full">
      <div className="flex-grow flex justify-center">
        <p className="text-sm font-medium text-center">
          I made this page as a weekend joke and it's totally "not" audited. If
          that freaks you out, don't use it!
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-white hover:text-gray-200 focus:outline-none ml-4"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default CautionBar;
