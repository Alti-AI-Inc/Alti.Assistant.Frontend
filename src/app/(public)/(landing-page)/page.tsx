import AboutUs from './_landingPageComponents/AboutUs';
import Automate from './_landingPageComponents/Automate';
import Header from './_landingPageComponents/Header';
import HeroSection from './_landingPageComponents/HeroSection';
import OurMission from './_landingPageComponents/OurMission';
import OurVision from './_landingPageComponents/OurVision';

const page = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <AboutUs />
      <OurMission />
      <OurVision />
      <Automate/>
    </div>
  );
};

export default page;
