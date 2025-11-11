import PageLayout from "@/layout/pageLayout";
import { withProtected } from "@/utils/auth/use-protected";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

const Challenges = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (!searchValue || !searchValue.trim()) return;
    console.log(searchValue.trim());
  }, [searchValue]);

  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <h1 className="font-bold">Challenges</h1>
        <Tooltip>
          <TooltipTrigger asChild className="hover:cursor-pointer px-3">
            <button className="relative">
              <Plus className="w-4.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create challenge</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="w-full mt-2">
        <input
          type="text"
          className="w-full text-sm px-4 py-3 bg-black/5 focus:outline-2 focus:outline-black/50 rounded-sm font-jakarta focus:bg-[#DFDFDF]/25"
          placeholder="Search challenge.."
          onChange={(e) => setSearchValue(e.target.value)}
          defaultValue={searchValue}
        />
      </div>
    </PageLayout>
  );
};

const ChallengesPage = withProtected(Challenges);
export default ChallengesPage;
