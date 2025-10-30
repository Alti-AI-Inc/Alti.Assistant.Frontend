import AboutUs from './_landingPageComponents/AiBuiltFor';
import Automate from './_landingPageComponents/Automate';
import Footer from './_landingPageComponents/Footer';
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
      <Search className="h-[500px]" />
      <Knowledge className="h-[500px]" />
      <Automate className="h-[700px]" />
      <Footer />
    </div>
  );
};

export default page;
