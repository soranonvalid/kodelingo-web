import { Button } from "@/components/ui/button";
import { withUnprotected } from "@/utils/auth/use-protected";
import { ArrowRight, LibraryBig } from "lucide-react";
import React, { useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { TiStarburstOutline } from "react-icons/ti";
import leaderboardImg from "@/assets/leaderboard.png";
import chatImg from "@/assets/chat.png";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import SmoothScroll from "@/lib/smoothScroll";
import { useMediaQuery } from "@uidotdev/usehooks";

interface containerProps {
  children: ReactNode;
}

const Container = ({
  children,
  ...props
}: containerProps & React.ComponentProps<"div">) => {
  return (
    <div className="mx-auto max-w-4xl w-full" {...props}>
      {children}
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("only screen and (max-width : 768px)");

  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxContainer = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState<string>("1000px");
  // const [trigger, setTrigger] = useState<boolean>(false);
  const { scrollY } = useScroll();
  const last = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (y > last.current) {
      console.log("scrolling down");
    } else {
      console.log("scrolling up");
    }
    last.current = y;
  });

  const { scrollYProgress } = useScroll({
    target: parallaxContainer,
    offset: ["start start", "end end"],
  });

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  scrollYProgress.on("change", (latest) => {
    // if (latest > 0.5 && latest < 0.2) {
    //   setRadius("0px");
    //   return;
    // }
    if (latest > 0) {
      setRadius("0px");
      return;
    }
    setRadius("1000px");
  });

  return (
    <>
      <SmoothScroll />
      <header className="border border-transparent border-b-px fixed top-0 w-full border-b-black/20 z-10 bg-white/50">
        <Container>
          <nav className="py-4 flex justify-between px-3 items-center">
            <img width={35} height={35} src="/logo.svg" alt="" />
            <Button
              onClick={() => {
                navigate("/login");
              }}
              className="cursor-pointer"
            >
              Get started
            </Button>
          </nav>
        </Container>
      </header>
      <main className="fade relative">
        <motion.div
          className="mt-50 flex flex-col justify-center relative gap-30 bg-cover bg-fixed border overflow-hidden"
          ref={parallaxContainer}
          style={{
            backgroundImage: "url(/parallax-background.png)",
          }}
          animate={{
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <div
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(179, 179, 179, 0) 0%, #000000 100%)",
              opacity: 0.1,
              filter: "blur(300px)",
              borderRadius: "100%",
            }}
            className="w-100 h-100 absolute top-[7%] left-[50%] -z-10 translate-x-[-50%]"
          ></div>
          <Container>
            <section className="flex pt-30 px-3 flex-col gap-20">
              <motion.div
                className="flex-1 flex text-center items-center flex-col gap-10"
                animate={{
                  y: radius === "0px" ? (isMobile ? -100 : -500) : 0,
                }}
                transition={{
                  ease: "easeIn",
                  duration: 0.15,
                }}
              >
                <h1 className="text-4xl md:text-6xl font-bold dignify">
                  Crack challenges, <br /> Level up your code
                </h1>
                <p className="max-w-[400px] text-sm md:text-xl">
                  post challenge, solve one from a friend, or try a challenge
                  from the list. Couldn't be more easier.
                </p>
                <div className="flex gap-5 items-center">
                  <Button
                    onClick={() => {
                      navigate("/login");
                    }}
                    className="cursor-pointer"
                  >
                    Try now <ArrowRight></ArrowRight>
                  </Button>
                  <p
                    onClick={scrollToSection}
                    className="underline transition-smooth text-sm cursor-pointer opacity-70 hover:opacity-100"
                  >
                    Know more
                  </p>
                </div>
              </motion.div>
            </section>
          </Container>
          <Container>
            <section className="flex px-3 gap-10 flex-col-reverse md:flex-row items-center">
              <div className="flex justify-center flex-col gap-3 text-center md:text-start max-w-[300px]">
                <h1 className="text-2xl font-bold">Ranking System</h1>
                <p className="text-center md:text-justify max-w-[358px] mx-auto md:mx-0 md:max-w-full">
                  scores each solved challenge and updates your rank in real
                  time. You can see your progress on a clear board and compare
                  it with friends.
                </p>
              </div>
              <div className="max-w-[500px] w-full">
                <img
                  className="object-contain w-full mx-auto"
                  src={leaderboardImg}
                  alt=""
                />
              </div>
            </section>
          </Container>
          <Container>
            <section className="flex px-3 gap-10 flex-col-reverse md:flex-row-reverse items-center">
              <div className="flex justify-center flex-col gap-3 text-center md:text-start max-w-[300px]">
                <h1 className="text-2xl font-bold">Share and talk</h1>
                <p className="text-center md:text-justify max-w-[358px] mx-auto md:mx-0 md:max-w-full">
                  ask for hints, share approaches, or check in with our built-in
                  chat system. Messages load fast and stay organized by
                  challenge, so every thread has its own space.
                </p>
              </div>
              <div className="max-w-[500px] w-full">
                <img className="object-contain w-full" src={chatImg} alt="" />
              </div>
            </section>
          </Container>
          <Container>
            <section className="justify-center items-center flex gap-10 mt-10 md:mt-0">
              <div className="bg-black h-px flex-1 opacity-20"></div>
              <LibraryBig size={30} />
              <div className="bg-black h-px flex-1 opacity-20"></div>
            </section>
          </Container>
          <Container>
            <section className="flex px-3 pt-10 md:pt-0 flex-col gap-10 md:flex-row">
              <div className="flex-1 flex flex-col gap-3 text-center md:text-start">
                <h1 className="text-2xl font-bold">Objective</h1>
                <p className="text-center md:text-justify max-w-[358px] mx-auto md:mx-0 md:max-w-full">
                  make coding practice simple, social, and steady. earn by doing
                  and improve through challenges made from community.
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-3 text-center md:text-start">
                <h1 className="text-2xl font-bold">Overview</h1>
                <p className="text-center md:text-justify max-w-[358px] mx-auto md:mx-0 md:max-w-full">
                  platform for sharing and solving coding challenges with
                  friends. It blends practice and friendly competition in one
                  place.
                </p>
              </div>
            </section>
          </Container>
          <Container>
            <section className="justify-center items-center flex gap-10 mt-10 md:mt-0">
              <div className="bg-black h-px flex-1 opacity-20"></div>
              <TiStarburstOutline size={30} />
              <div className="bg-black h-px flex-1 opacity-20"></div>
            </section>
          </Container>
          <footer className="bg-black mt-20 relative text-white">
            <div className="-top-20 absolute w-full h-20 bg-wave"></div>
            <Container>
              <div className="flex items-center justify-center py-10 flex-col gap-5">
                <h1 className="text-3xl font-bold">What are we waiting?</h1>
                <p className="text-center max-w-[500px] px-10 text-sm md:text-md">
                  Jump into fresh challenges, talk through ideas with people who
                  share your drive, and watch your rank rise as your skill
                  improves.
                </p>
                <Button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="bg-white text-black mt-5 md:mt-0  hover:text-white cursor-pointer"
                >
                  Join now
                </Button>
              </div>
            </Container>
          </footer>
        </motion.div>
      </main>
    </>
  );
};

{
  /* <Container>
  <section className="flex px-3 flex-col md:flex-row">
    <div className="flex-1">a</div>
    <div className="flex-1">a</div>
  </section>
</Container>; */
}

const LandingPage = withUnprotected(Landing);
export default LandingPage;
