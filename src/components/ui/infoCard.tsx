import type { ReactNode } from "react";

interface props {
  children?: ReactNode;
  background?: string;
  footer?: string;
  isPointer?: boolean;
  padding?: number;
  onClick?: () => void;
}

// hover:bg-[linear-gradient(235.14deg,#FFFFFF_0%,#E4E4E4_99.56%)]

const InfoCard = ({
  children,
  footer,
  isPointer = false,
  onClick,
  ...rest
}: props) => {
  return (
    <div
      {...rest}
      onClick={onClick}
      style={{
        transition: "all 0.2s ease-in-out",
      }}
      className={`
        rounded-2xl border border-black/10 min-w-full z-10 snap-start px-6 py-5 sm:py-3 sm:px-5 bg-[linear-gradient(234.98deg,#FFFFFF_49.95%,#F4F4F4_99.56%)] ${
          isPointer && "cursor-pointer"
        }
        `}
    >
      <div className="flex flex-col h-full">
        <div className="h-full">{children}</div>
        {footer && (
          <div className="text-4xl font-semibold opacity-75">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
