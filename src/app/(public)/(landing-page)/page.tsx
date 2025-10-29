import AboutUs from './_landingPageComponents/AiBuiltFor';
import Automate from './_landingPageComponents/Automate';
import Header from './_landingPageComponents/Header';
import HeroSection from './_landingPageComponents/HeroSection';
import Knowledge from './_landingPageComponents/Knowledge';
import Search from './_landingPageComponents/Search';

const page = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <AboutUs className="h-[700px]" />
      <Search className="h-[700px]" />
      <Knowledge className="h-[700px]" />
      <Automate className="h-[700px]" />
    </div>
  );
};

export default page;
