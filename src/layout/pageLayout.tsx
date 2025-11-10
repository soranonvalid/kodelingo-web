import Navbar from "@/components/ui/navbar";
import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  padding?: boolean;
  center?: boolean;
  scroll?: boolean;
  reqAnimation?: boolean;
}

const PageLayout = ({
  children,
  padding = true,
  center = false,
  scroll = true,
  reqAnimation = false,
}: PageLayoutProps) => {
  return (
    <div className="w-full sm:px-10 px-0 max-h-svh min-h-dvh flex justify-center overflow-y-scroll">
      <div
        className={`max-w-3xl w-full min-h-dvh h-full flex flex-col border border-x-black/10 border-y-black/0 absolute ${
          padding && "px-3"
        }`}
      >
        <section
          className={`h-full mb-[62px] flex flex-col overflow-x-hidden hide-scroll ${
            reqAnimation && "pop"
          } ${center && "justify-center items-center w-full"} ${
            scroll ? "overflow-y-scroll" : "overflow-y-hidden"
          }`}
        >
          {children}
        </section>
        <Navbar />
      </div>
    </div>
  );
};

export default PageLayout;
