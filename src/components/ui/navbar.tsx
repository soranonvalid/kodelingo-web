import { House, Settings, User, Users } from "lucide-react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const chatMatch = useMatch("/chat/*");
  return (
    <nav className="absolute bottom-0 border border-y-black/10 border-x-black/0 w-full left-0 flex items-center justify-around py-2 z">
      <div
        onClick={() => navigate("/")}
        className={`flex flex-col items-center gap-1 w-min transition-smooth  cursor-pointer ${
          location.pathname === "/" ? "" : "opacity-50  hover:opacity-100"
        }`}
      >
        <House size={20} />
        <p className="text-sm">Home</p>
      </div>
      <div
        onClick={() => navigate("/friends")}
        className={`flex flex-col items-center gap-1 w-min transition-smooth  cursor-pointer ${
          location.pathname === "/friends" || chatMatch
            ? ""
            : "opacity-50  hover:opacity-100"
        }`}
      >
        <Users size={20} />
        <p className="text-sm">Friends</p>
      </div>
      <div
        onClick={() => navigate("/r")}
        className={`flex flex-col items-center gap-1 w-min transition-smooth  cursor-pointer ${
          location.pathname === "" ? "" : "opacity-50  hover:opacity-100"
        }`}
      >
        <User size={20} />
        <p className="text-sm">Profile</p>
      </div>
      <div
        onClick={() => navigate("/r")}
        className={`flex flex-col items-center gap-1 w-min transition-smooth  cursor-pointer ${
          location.pathname === "" ? "" : "opacity-50  hover:opacity-100"
        }`}
      >
        <Settings size={20} />
        <p className="text-sm">Settings</p>
      </div>
    </nav>
  );
};

export default Navbar;
