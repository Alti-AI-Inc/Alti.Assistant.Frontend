import Agents from './_landingPageComponents/Agents';
import AiBuiltFor from './_landingPageComponents/AiBuiltFor';
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
      <AiBuiltFor className="lg:h-[700px]" />
      <Search className="lg:h-[600px]" />
      <Knowledge className="lg:h-[600px]" />
      <Automate className="lg:h-[600px]" />
      <Generation className="lg:h-[600px]" />
      <Agents className="lg:h-[600px]" />
      <Industries className="lg:h-[600px]" />
      <Pricing />
      <Footer />
    </div>
  );
};

export default page;
