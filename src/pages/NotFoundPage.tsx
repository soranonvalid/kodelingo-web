import PageLayout from "@/layout/pageLayout";
import { CornerDownLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <PageLayout center={true} scroll={false} reqAnimation={true}>
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-10 opacity-45">
          <h1 className="text-5xl">404</h1>
          <p className="text-4xl">Pages not found!</p>
        </div>
        <div
          onClick={() => {
            navigate(-1);
          }}
          className="flex gap-2 items-center italic cursor-pointer"
        >
          <CornerDownLeft size={15} />
          <span>Return</span>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFoundPage;
