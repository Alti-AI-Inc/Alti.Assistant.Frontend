'use client';

import Image from 'next/image';

function Footer() {
  const handleScroll = (id: string) => {
    const element = document.querySelector('#' + id);
    const offset =
      id === 'home'
        ? 140
        : id === 'features'
          ? 220
          : id === 'industries'
            ? 150
            : 80;
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.pageYOffset - offset; // 80px offset for navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };
  return (
    <div className="w-full bg-black py-12 md:py-16 lg:py-20">
      <div className="px-4 md:px-6 lg:px-10">
        {/* Main Footer Content */}
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-8">
          {/* Logo and Tagline Section */}
          <div className="items-between flex flex-col justify-between">
            <div className="flex flex-col gap-6 text-center lg:items-start lg:gap-10 lg:text-left">
              <Image
                src="/assets/logo-white.png"
                alt="Logo"
                height={25}
                width={50}
                className="ml-4"
              />
            </div>
          </div>
          {/* Navigation Links Section */}
          <div className="w-full lg:w-auto">
            {/* Desktop/Tablet Grid Layout */}
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-8 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:gap-8">
              {/* Company Column */}
              <div className="flex w-full flex-col gap-6 lg:w-[200px] lg:gap-10">
                <p className="text-base font-medium text-white">Company</p>
                <ul className="flex flex-col gap-4 lg:gap-6">
                  <li onClick={() => handleScroll('about')}>
                    <div className="font-secondary cursor-pointer text-sm font-normal text-white transition-colors hover:text-gray-300">
                      About
                    </div>
                  </li>

                  <li onClick={() => handleScroll('features')}>
                    <div className="font-secondary cursor-pointer text-sm font-normal text-white transition-colors hover:text-gray-300">
                      Features
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex w-full flex-col gap-6 lg:w-[200px] lg:gap-10">
                <p className="text-base font-medium text-white">Business</p>
                <ul className="flex flex-col gap-4 lg:gap-6">
                  <li onClick={() => handleScroll('industries')}>
                    <div className="font-secondary cursor-pointer text-sm font-normal text-white transition-colors hover:text-gray-300">
                      Industries
                    </div>
                  </li>

                  <li onClick={() => handleScroll('pricing')}>
                    <div className="font-secondary cursor-pointer text-sm font-normal text-white transition-colors hover:text-gray-300">
                      Pricing
                    </div>
                  </li>
                </ul>
              </div>

              {/* Info Column */}
              <div className="flex w-full flex-col gap-6 lg:w-[200px] lg:gap-10">
                <p className="text-base font-medium text-white">Legal</p>
                <ul className="flex flex-col gap-4 lg:gap-6">
                  <li>
                    <div className="font-secondary text-sm font-normal text-white transition-colors hover:text-gray-300">
                      Privacy
                    </div>
                  </li>
                  <li>
                    <div className="font-secondary cursor-pointer text-sm font-normal text-white transition-colors hover:text-gray-300">
                      Terms
                    </div>
                  </li>
                </ul>
              </div>

              {/* Office Column */}
              <div className="col-span-2 flex w-full flex-col gap-6 md:col-span-1 lg:w-[200px] lg:gap-10">
                <p className="text-base font-medium text-white">Office</p>
                <ul className="flex flex-col gap-4 lg:gap-6">
                  <li className="font-secondary text-sm leading-6 font-normal text-white">
                    280 N Old Woodward
                    <br />
                    Birmingham, MI 48009
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
