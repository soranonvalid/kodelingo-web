import type { ReactNode } from "react";

interface props {
  children?: ReactNode;
  background?: string;
  footer?: string;
}

const InfoCard = ({
  children,
  footer,
  background = "234.98deg, #FFFFFF 49.95%, #F4F4F4 99.56%",
}: props) => {
  return (
    <div
      style={{
        background: `linear-gradient(${background})`,
      }}
      className="rounded-2xl border border-black/10 min-w-full snap-start px-6 py-5 sm:py-3 sm:px-5"
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
