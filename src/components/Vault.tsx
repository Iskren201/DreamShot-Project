import { useState } from "react";
import bg from "../assets/bg.png";
import door from "../assets/door.png";
import doorOpen from "../assets/doorOpen.png";
import handle from "../assets/handle.png";
import handleShadow from "../assets/handleShadow.png";

const Vault = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <div
      className="relative w-full h-full flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Vault Door */}
      <img
        src={isOpen ? doorOpen : door}
        alt="Vault Door"
        className="absolute w-[50%] max-w-[500px]"
      />

      {/* Vault Handle */}
      <img
        src={handle}
        alt="Vault Handle"
        className="absolute w-[15%] max-w-[100px] cursor-pointer"
        onClick={handleClick}
      />

      {/* Handle Shadow (Appears when open) */}
      {isOpen && (
        <img
          src={handleShadow}
          alt="Vault Handle Shadow"
          className="absolute w-[15%] max-w-[100px]"
        />
      )}
    </div>
  );
};

export default Vault;
