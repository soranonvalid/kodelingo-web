import Navbar from "@/components/ui/navbar";
import { useEffect, type ReactNode } from "react";
import { useNavbar } from "./navbar/NavbarLayout";
import { useLocation } from "react-router-dom";

interface PageLayoutProps {
  children: ReactNode;
  padding?: boolean;
  center?: boolean;
  scroll?: boolean;
  reqAnimation?: boolean;
  hideScroll?: boolean;
  backgroundColor?: string;
}

const PageLayout = ({
  children,
  padding = true,
  center = false,
  scroll = true,
  reqAnimation = false,
  hideScroll = true,
  backgroundColor = "",
  ...rest
}: PageLayoutProps) => {
  const { setIsOpen } = useNavbar();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/challenges/play/")) {
      return setIsOpen(false);
    }

    return setIsOpen(true);
  }, [pathname, setIsOpen]);

  return (
    <div
      {...rest}
      className={`w-full sm:px-10 px-0 max-h-svh min-h-dvh flex justify-center  hide-scroll ${
        scroll ? "overflow-y-scroll" : "overflow-y-hidden"
      }`}
    >
      <div
        className={`max-w-3xl w-full min-h-dvh h-full flex flex-col border border-x-black/10 border-y-black/0 absolute ${
          padding && "px-3"
        }`}
        style={{
            backgroundColor: backgroundColor,
          }}
      >
        <section
          className={`h-full mb-[62px] flex flex-col py-5 sm:py-3 px-3 overflow-x-hidden ${
            hideScroll && "hide-scroll"
          } ${reqAnimation && "pop"} ${
            center && "justify-center items-center w-full"
          } ${scroll ? "overflow-y-scroll" : "overflow-y-hidden"}`}
          
        >
          {children}
        </section>
        <Navbar />
      </div>
    </div>
  );
};

export default PageLayout;
