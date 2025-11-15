import { withUnprotected } from "@/utils/auth/use-protected";

const Landing = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col w-full max-w-300 md:px-0 px-4">
        <div className="w-full min-h-screen flex justify-center md:gap-16 items-center md:flex-row flex-col-reverse">
          <div className="flex flex-col gap-2 h-fit">
            <h1 className="text-4xl text-black font-bold">
              Sharpen Your Skills With <br /> CodeLingo Here!
            </h1>
            <p>Study & Share your quiz through our community</p>
            <button className="w-fit border px-4 py-2 rounded-lg bg-amber-500 text-white cursor-pointer">
              Start learning
            </button>
          </div>
          <img
            src="/hero-image.png"
            alt=""
            className="object-cover object-center max-w-[300px] h-fit"
          />
        </div>
      </div>
    </div>
  );
};

const LandingPage = withUnprotected(Landing);
export default LandingPage;
