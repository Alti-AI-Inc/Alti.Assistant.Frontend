import AboutUs from './_landingPageComponents/AiBuiltFor';
import Automate from './_landingPageComponents/Automate';
import Footer from './_landingPageComponents/Footer';
import Generation from './_landingPageComponents/Generation';
import Header from './_landingPageComponents/Header';
import HeroSection from './_landingPageComponents/HeroSection';
import Industries from './_landingPageComponents/Industries';
import Knowledge from './_landingPageComponents/Knowledge';
import Pricing from './_landingPageComponents/Pricing';
import Search from './_landingPageComponents/Search';

const page = () => {
  return (
    <div id="home">
      <Header />
      <HeroSection />
      <AboutUs className="h-[700px]" />
      <Search className="h-[600px]" />
      <Knowledge className="h-[600px]" />
      <Automate className="h-[600px]" />
      <Generation className="h-[600px]" />
      <Industries className="h-[600px]" />
      <Pricing />
      <Footer />
    </div>
  );
};

export default page;
