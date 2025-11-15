import { withUnprotected } from "@/utils/auth/use-protected";

const Landing = () => {
  return <div>LandingPage</div>;
};

const LandingPage = withUnprotected(Landing);
export default LandingPage;
