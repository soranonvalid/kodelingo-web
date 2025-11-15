import { useNavbar } from "@/layout/navbar/NavbarLayout";
import { Badge, House, User, Users, type LucideProps } from "lucide-react";
import { GiPodium } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";
import { type IconType } from "react-icons/lib";

type Item = {
  url: string;
  text: string;
  icon:
    | React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >
    | IconType;
  activePaths?: string[];
};

const items: Item[] = [
  {
    url: "/home",
    text: "Home",
    icon: House,
    activePaths: ["/home"],
  },
  {
    url: "/challenges",
    text: "Challenges",
    icon: Badge,
    activePaths: ["/challenges", "/challenges/:id"],
  },
  {
    url: "/leaderboard",
    text: "Leaderboard",
    icon: GiPodium,
    activePaths: ["/leaderboard"],
  },
  {
    url: "/friends",
    text: "Friends",
    icon: Users,
    activePaths: ["/friends", "/chat/:id"],
  },
  {
    url: "/profile",
    text: "Profile",
    icon: User,
    activePaths: ["/profile"],
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isOpen } = useNavbar();

  const isActive = (item: Item) =>
    item.activePaths?.some((path) => {
      if (path.includes(":")) {
        const base = path.split("/:")[0];
        return pathname.startsWith(base);
      }
      return pathname === path;
    });

  return (
    <nav
      className="absolute bottom-0 border-t border-black/10 w-full left-0 flex items-center justify-around py-2 bg-white/80 backdrop-blur-md"
      style={{
        display: isOpen ? "" : "none",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);

        return (
          <div
            key={item.url}
            onClick={() => navigate(item.url)}
            className={`flex flex-col items-center gap-1 w-min transition-all cursor-pointer md:py-0 py-1 ${
              active ? "opacity-100" : "opacity-50 hover:opacity-100"
            }`}
          >
            <Icon className="md:w-[17.5px] md:h-[17.5px] w-5 h-5" />
            <p className="text-sm md:flex hidden">{item.text}</p>
          </div>
        );
      })}
    </nav>
  );
};

export default Navbar;
