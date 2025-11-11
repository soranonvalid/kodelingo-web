import PageLayout from "@/layout/pageLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InfoCard from "@/components/ui/infoCard";
const user = {
  photoURL:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJJwZievtcRT0r69GUl5BYUPvxn66ZGJClig&s",
  displayName: "soru",
  streak: 32,
  level: {
    current: 21,
    xp: 1000,
  },
  mastery: {
    js: {
      rate: 98,
    },
    ts: {
      rate: 78,
    },
    fl: {
      rate: 67,
    },
  },
};

const renderLevel = (crntLVL: number, crntXP: number) => {
  console.log("user", crntLVL, crntXP);
  const mult = (crntLVL / 200) * Math.ceil(crntLVL % 0.3);
  const limitLVL = mult * crntLVL * 1000;

  console.log(limitLVL, mult);
  const perXP = Math.round((crntXP / limitLVL) * 100);
  return { limitLVL, perXP, crntLVL, crntXP };
};
import PageLayout from "@/layout/PageLayout";

const LandingPage = () => {
  const navigate = useNavigate();
  const level = renderLevel(user.level.current, user.level.xp);
  console.log(level);
  return (
    <PageLayout>
      <main>
        <section className=" flex gap-3 overflow-x-auto sm:grid sm:grid-rows-2 sm:gap-3 sm:grid-cols-2 h-70 sm:h-100 w-full snap-x snap-mandatory scroll-smooth">
          <InfoCard footer="Card 1">150</InfoCard>
          <InfoCard footer="Card 2">120</InfoCard>
          <InfoCard footer="Card 3">140</InfoCard>
          <InfoCard footer="Card 4">180</InfoCard>
        </section>
        <section className="py-6 flex flex-col gap-4">
          <div
            onClick={() => {
              navigate("/r");
            }}
            className="flex items-center gap-5 opacity-75 hover:opacity-100 transition-smooth cursor-pointer"
          >
            <h1 className="text-[1.2rem]">Profile</h1>
            <ArrowRight strokeWidth={1.5} />
          </div>
          <div className="flex sm:flex-row flex-col gap-2 sm:gap-10 items-center">
            <Avatar
              onClick={() => {
                navigate("/r");
              }}
              className="sm:w-20 w-35 sm:h-20 h-35 cursor-pointer"
            >
              <AvatarImage src={user.photoURL} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="h-full flex flex-col gap-1 w-full">
              <h2 className="text-2xl sm:text-left text-center font-semibold">
                {user.displayName}
              </h2>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm text-black/50">
                  <p>
                    {level.crntXP}/{level.limitLVL}
                  </p>
                  <p>Lvl. {level.crntLVL}</p>
                </div>
                <div className="w-full h-2 bg-[#e2e2e2] rounded-full overflow-hidden">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${level.perXP}%`,
                    }}
                    transition={{
                      ease: "easeInOut",
                      duration: 1,
                    }}
                    style={{ width: `${level.perXP}%` }}
                    className={`bg-amber-400 h-full`}
                  ></motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default LandingPage;
