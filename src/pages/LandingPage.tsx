import { Button } from "@/components/ui/button";
import { withUnprotected } from "@/utils/auth/use-protected";
import { ArrowRight } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import header1 from "@/assets/x1.svg";
import header2 from "@/assets/x2.svg";

interface containerProps {
  children: ReactNode;
}

const Container = ({ children }: containerProps) => {
  return <div className="mx-auto max-w-3xl w-full">{children}</div>;
};

const Landing = () => {
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <>
      <header className="border border-transparent border-b-px fixed top-0 w-full border-b-black/20 z-10 bg-white">
        <Container>
          <nav className="py-4 flex justify-between px-3 items-center">
            <img width={35} height={35} src="/logo.svg" alt="" />
          </nav>
        </Container>
      </header>
      <div className="mt-23 flex flex-col justify-center gap-30">
        <Container>
          <section className="flex pt-14 px-3 flex-col gap-20">
            <div className="flex-1 flex text-center items-center flex-col gap-10">
              <h1 className="text-4xl md:text-6xl font-bold">
                Crack challenges, <br /> Level up your code
              </h1>
              <p className="max-w-[400px] text-sm md:text-xl">
                post challenge, solve one from a friend, or try a challenge from
                the list. Couldn't be more easier.
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
                  className="underline tranisition-smooth text-sm cursor-pointer opacity-70 hover:opacity-100"
                >
                  Know more
                </p>
              </div>
            </div>
            <div
              ref={sectionRef}
              className="flex-1 flex justify-center items-center"
            >
              <img src={header1} alt="" />
            </div>
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
                platform for sharing and solving coding challenges with friends.
                It blends practice and friendly competition in one place.
              </p>
            </div>
          </section>
        </Container>
        <Container>
          <section className="flex px-3 gap-10 flex-col md:flex-row">
            <div className="flex-4 flex justify-center flex-col gap-3 text-center md:text-start">
              <h1 className="text-2xl font-bold">Ranking System</h1>
              <p className="text-center md:text-justify max-w-[358px] mx-auto md:mx-0 md:max-w-full">
                scores each solved challenge and updates your rank in real time.
                You can see your progress on a clear board and compare it with
                friends.
              </p>
            </div>
            <div className="flex-3">
              <img
                className="object-contain w-[250px] md:w-[200px] mx-auto"
                src={header2}
                alt=""
              />
            </div>
          </section>
        </Container>
        <Container>
          <section className="flex px-3 gap-10 flex-col md:flex-row-reverse">
            <div className="flex-4 flex justify-center flex-col gap-3 text-center md:text-start">
              <h1 className="text-2xl font-bold">Share and talk</h1>
              <p className="text-center md:text-justify max-w-[358px] mx-auto md:mx-0 md:max-w-full">
                ask for hints, share approaches, or check in with your group.
                Messages load fast and stay organized by challenge, so every
                thread has its own space.
              </p>
            </div>
            <div className="flex-3">
              <img
                className="object-contain w-[250px] md:w-[200px] mx-auto"
                src={header2}
                alt=""
              />
            </div>
          </section>
        </Container>
        <div className="bg-black text-white">
          <Container>
            <div className="flex items-center justify-center py-10 flex-col gap-5">
              <h1 className="text-3xl font-bold">What are we waiting?</h1>
              <p className="text-center max-w-[500px]">
                Jump into fresh challenges, talk through ideas with people who
                share your drive, and watch your rank rise as your skill
                improves.
              </p>
              <Button
                onClick={() => {
                  navigate("/login");
                }}
                className="bg-white text-black hover:text-white cursor-pointer"
              >
                Join now
              </Button>
            </div>
          </Container>
        </div>
      </div>
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
