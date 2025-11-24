import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Footer from '../(landing-page)/landingpage/_landingPageComponents/Footer';
import Header from '../(landing-page)/landingpage/_landingPageComponents/Header';

const page = () => {
  return (
    <div>
      <Header />
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-(--breakpoint-xl) items-center justify-center p-4 pt-30">
        <div className="hidden items-center justify-center lg:flex lg:w-1/2">
          <Image
            src="/assets/logo-contact.jpeg"
            height={300}
            width={300}
            alt="logo"
          />
        </div>
        <div className="mx-auto w-full max-w-lg justify-center rounded-2xl p-6 md:px-10 md:py-8 lg:w-1/2 lg:px-0">
          <h2 className="font-secondary mb-10 text-2xl font-bold md:text-[40px]">
            Contact Us
          </h2>
          <div className="w-full">
            <div className="mt-4 flex flex-col md:mt-[25px]">
              <input
                className="dark:bg-default-50 w-full rounded-[12px] bg-gray-100 px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="name"
                id="name"
                placeholder="Full name"
              />
            </div>
            <div className="mt-4 flex flex-col md:mt-[25px]">
              <input
                className="dark:bg-default-50 w-full rounded-[12px] bg-gray-100 px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="email"
                id="email"
                placeholder="Email address"
              />
            </div>
            <div className="mt-4 flex flex-col md:mt-[24px]">
              <textarea
                className="dark:bg-default-50 w-full resize-none rounded-[12px] bg-gray-100 px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                id="message"
                rows={4}
                placeholder="Enter your message"
                draggable="false"
              ></textarea>
            </div>
            <Button className="font-secondary mt-4 h-10 w-full rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 md:mt-6 md:py-4 md:text-base dark:bg-white dark:text-black">
              Send
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
