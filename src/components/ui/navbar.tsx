import {
  Badge,
  House,
  Settings,
  User,
  Users,
  type LucideProps,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

type Item = {
  url: string;
  text: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  activePaths?: string[];
};

const items: Item[] = [
  {
    url: "/",
    text: "Home",
    icon: House,
    activePaths: ["/"],
  },
  {
    url: "/challenges",
    text: "Challenges",
    icon: Badge,
    activePaths: ["/challenges"],
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
  {
    url: "/settings",
    text: "Settings",
    icon: Settings,
    activePaths: ["/settings"],
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const isActive = (item: Item) =>
    item.activePaths?.some((path) => {
      if (path.includes(":")) {
        const base = path.split("/:")[0];
        return pathname.startsWith(base);
      }
      return pathname === path;
    });

  return (
    <nav className="absolute bottom-0 border-t border-black/10 w-full left-0 flex items-center justify-around py-2 bg-white/80 backdrop-blur-md">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item);

        return (
          <div
            key={item.url}
            onClick={() => navigate(item.url)}
            className={`flex flex-col items-center gap-1 w-min transition-all cursor-pointer ${
              active ? "opacity-100" : "opacity-50 hover:opacity-100"
            } ${isMobile ? "py-1" : ""}`}
          >
            <Icon size={isMobile ? 20 : 17.5} />
            <p className="text-sm">{isMobile ? null : item.text}</p>
          </div>
        );
      })}
    </nav>
  );
};

export default Navbar;
