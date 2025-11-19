import HomeChart from "../pages/Home Components/HomeChart";
import ScrollToTopButton from "./Home Components/ScrollToTopButton";
import HeroSection from "./Home Components/HeroSection";
import HowItWorksSection from "./Home Components/HowItWorksSection";
import FeaturesSection from "./Home Components/FeaturesSection";
import CTASection from "./Home Components/CTASection";
// import CircularText from "./Home Components/CircularText";
const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <HomeChart />
      <CTASection />
      <ScrollToTopButton />
      {/* <CircularText text="Hello" /> */}
    </div>
  );
};

export default Home;
