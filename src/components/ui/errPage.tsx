import PageLayout from "@/layout/PageLayout";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type prop = {
  code: number | string;
  detail?: number | string;
};

const ErrPage = ({ code, detail }: prop) => {
  const navigate = useNavigate();
  return (
    <PageLayout center={true} scroll={false}>
      <div className="flex flex-col items-center gap-5">
        <X size={40} />
        <div className="flex flex-col items-center gap-10 opacity-45">
          <h1 className="text-5xl">{code || "500"}</h1>
          <p className="text-4xl">Error Occured!</p>
        </div>
        <p
          onClick={() => {
            navigate(-1);
          }}
          className="text-sm italic cursor-pointer"
        >
          Return to previous page...
        </p>
        {detail && <p>{detail}</p>}
      </div>
    </PageLayout>
  );
};

export default ErrPage;
