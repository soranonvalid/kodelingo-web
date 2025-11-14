import { WiStars } from "react-icons/wi";
import { GiPolarStar } from "react-icons/gi";
import { GoNorthStar } from "react-icons/go";
import { MdStarBorder } from "react-icons/md";
import { GiFallingStar } from "react-icons/gi";
// -
import { SiCplusplus, SiJavascript, SiPython } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { Ellipsis } from "lucide-react";

export const getStatusBadge = (rank: number) => {
  if (rank <= 3) {
    return <WiStars color="black" size={20} />;
  }
  if (rank <= 10) {
    return <GiPolarStar color="black" size={20} />;
  }
  if (rank <= 100) {
    return <GoNorthStar color="black" size={20} />;
  }
  if (rank <= 1000) {
    return <MdStarBorder color="black" size={20} />;
  }
  if (rank <= 1000000) {
    <GiFallingStar color="black" size={20} />;
  }
};

export const getLangIco = (fix: string, size: number = 20) => {
  const suffix = fix.toLowerCase();
  if (suffix === "javascript") {
    return <SiJavascript size={size} />;
  }
  if (suffix === "cpp") {
    return <SiCplusplus size={size} />;
  }
  if (suffix === "python") {
    return <SiPython size={size} />;
  }
  if (suffix === "java") {
    return <FaJava size={size} />;
  }
  return <Ellipsis size={size} />;
};
