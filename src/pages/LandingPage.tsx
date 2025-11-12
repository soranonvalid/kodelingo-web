import PageLayout from "@/layout/pageLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InfoCard from "@/components/ui/infoCard";
import SectionHead from "@/components/ui/sectionHead";
import ChallengeCard from "@/components/ui/challengeCard";
import { WiStars } from "react-icons/wi";
import RankBadge from "@/components/ui/rankBadge";

const user = {
  photoURL:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJJwZievtcRT0r69GUl5BYUPvxn66ZGJClig&s",
  displayName: "soru",
  streak: 32,
  level: {
    current: 21,
    xp: 1000,
  },
  rank: {
    status: 1,
    score: 23498,
  },
};

// const renderLevel = (crntLVL: number, crntXP: number) => {
//   console.log("user", crntLVL, crntXP);
//   const mult = (crntLVL / 200) * Math.ceil(crntLVL % 0.3);
//   const limitLVL = mult * crntLVL * 1000;

//   console.log(limitLVL, mult);
//   const perXP = Math.round((crntXP / limitLVL) * 100);
//   return { limitLVL, perXP, crntLVL, crntXP };
// };

const LandingPage = () => {
  const navigate = useNavigate();
  // const level = renderLevel(user.level.current, user.level.xp);
  // console.log(level);
  return (
    <PageLayout>
      <main>
        <section className=" flex gap-3 overflow-x-auto sm:grid sm:grid-rows-2 sm:gap-3 sm:grid-cols-2 h-70 sm:h-100 w-full snap-x snap-mandatory scroll-smooth">
          <InfoCard footer="Card 1">150</InfoCard>
          <InfoCard footer="Card 2">120</InfoCard>
          <InfoCard footer="Card 3">140</InfoCard>
          <InfoCard footer="Card 4">180</InfoCard>
        </section>
        <SectionHead title={"Profile"} fx={true} path="/profile">
          <div className="flex sm:flex-row flex-col gap-2 sm:gap-10 items-center w-full">
            <Avatar
              onClick={() => {
                navigate("/profile");
              }}
              className="sm:w-20 w-35 sm:h-20 h-35 cursor-pointer"
            >
              <AvatarImage src={user.photoURL} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="h-full flex flex-col sm:items-start items-center gap-2 w-full">
              <h2 className="text-2xl sm:text-left text-center font-semibold">
                {user.displayName}
              </h2>
              <div className="flex w- items-center gap-5">
                <RankBadge rank={1001} />
                <div className="text-sm">{user.rank.score}</div>
              </div>
            </div>
          </div>
        </SectionHead>
        <SectionHead title={"Challenges"} fx={true} path="/challenges">
          <div className="flex flex-col gap-3">
            <ChallengeCard
              title="Learning JS"
              date="20-11-2025"
              lang="js"
              src={user.photoURL}
              user={user.displayName}
              question={8}
            />
            <ChallengeCard
              title="Learning JS"
              date="20-11-2025"
              lang="js"
              src={user.photoURL}
              user={user.displayName}
              difficulty="difficult"
              question={8}
            />
            <ChallengeCard
              title="Learning JS"
              date="20-11-2025"
              lang="js"
              src={user.photoURL}
              user={user.displayName}
              difficulty="intermediate"
              question={8}
            />
          </div>
        </SectionHead>
      </main>
    </PageLayout>
  );
};

export default LandingPage;
