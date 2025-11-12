import PageLayout from "@/layout/pageLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InfoCard from "@/components/ui/infoCard";
import SectionHead from "@/components/ui/sectionHead";
import ChallengeCard from "@/components/ui/challengeCard";
import getObjectValues from "@/utils/firebase/get-object-values";
import { useMemo } from "react";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import ErrPage from "@/components/ui/errPage";
import sudah from "@/data/challengeSudah.json";
import type { Challenge } from "@/types/challenge";
import { mongo } from "@/utils/mongo/api";

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

const LandingPage = () => {
  const navigate = useNavigate();
  const level = renderLevel(user.level.current, user.level.xp);
  const {
    data: challenges,
    isLoading: challengesLoading,
    error: challengesError,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const res = await mongo.get("/challenges/");
      return res.data;
    },
  });

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useRealtimeValue("users");

  const usersArray = useMemo(() => {
    if (!users || typeof users !== "object") return [];
    return getObjectValues(users);
  }, [users]);

  if (challengesLoading || usersLoading || !users || !challenges) {
    return <Loading />;
  }

  if (challengesError || usersError) {
    return <ErrPage code={400} />;
  }

  return (
    <PageLayout>
      <main>
        <section className=" flex gap-3 overflow-x-auto sm:grid sm:grid-rows-2 sm:gap-3 sm:grid-cols-2 h-70 sm:h-100 w-full snap-x snap-mandatory scroll-smooth">
          <InfoCard footer="Card 1">150</InfoCard>
          <InfoCard footer="Card 2">120</InfoCard>
          <InfoCard footer="Card 3">140</InfoCard>
          <InfoCard footer="Card 4">180</InfoCard>
        </section>
        <SectionHead title={"Profile"} fx={true} path="/r">
          <div className="flex sm:flex-row flex-col gap-2 sm:gap-10 items-center w-full">
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
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionHead>
        <SectionHead title={"Challenges"} fx={true} path="/challenges">
          <div className="flex flex-col gap-3">
            {(challenges as Challenge[])
              .filter((challenge) =>
                sudah.some((item) => item.idChallenge === challenge._id)
              )
              .map((challenge) => (
                <ChallengeCard
                  key={challenge._id}
                  challenge={challenge}
                  usersArray={usersArray}
                />
              ))}
          </div>
        </SectionHead>
      </main>
    </PageLayout>
  );
};

export default LandingPage;
