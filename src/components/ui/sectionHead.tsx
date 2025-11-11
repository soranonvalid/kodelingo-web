import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface props {
  children: ReactNode;
  title: string | number;
  path?: string;
  fx?: boolean;
}

const SectionHead = ({ children, fx = false, title, path }: props) => {
  const navigate = useNavigate();
  return (
    <section className="py-6 flex flex-col gap-4 w-full">
      <div
        onClick={
          path
            ? () => {
                navigate(path);
              }
            : undefined
        }
        className={`flex items-center gap-5  transition-smooth ${
          fx && "cursor-pointer opacity-75 hover:opacity-100"
        }`}
      >
        <h1 className="text-[1.2rem]">{title}</h1>
        {path && <ArrowRight strokeWidth={1.5} />}
      </div>
      <div>{children}</div>
    </section>
  );
};

export default SectionHead;
