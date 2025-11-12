import { WiStars } from "react-icons/wi";
import { GiPolarStar } from "react-icons/gi";
import { GoNorthStar } from "react-icons/go";
import { MdStarBorder } from "react-icons/md";
import { GiFallingStar } from "react-icons/gi";

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
