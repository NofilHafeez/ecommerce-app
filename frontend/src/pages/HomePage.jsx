import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import { IoIosArrowRoundForward } from "react-icons/io";
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { Link } from "react-router-dom";

const HomePage = () => {
  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer) {
      const scroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
      });
      setTimeout(() => scroll.update(), 500);
      return () => scroll.destroy();
    }
  }, []);

  return (
    <>
      <div data-scroll-container className="bg-[#ededed] min-h-screen">

        {/* Hero Section */}
        <section
          data-scroll-section
          className="flex flex-col mt-10 md:flex-row items-start md:items-center gap-6 px-6 md:px-20 py-12 max-w-[1200px] mx-auto"
        >
          {/* Image container */}
          <div className="w-full md:w-[400px] rounded-2xl overflow-hidden shadow-lg flex-shrink-0 h-[300px] md:h-[500px]">
            <img
              src="https://i.pinimg.com/736x/58/06/30/5806302758651f2e6aec4e413e66b34f.jpg"
              alt="Unique Style"
              className="w-full  sm:object-bottom lg:object-cover"
            />
          </div>

          {/* Text container */}
          <div className="flex flex-col justify-center text-center md:text-left max-w-xl">
            <p className="text-lg md:text-xl mb-3">
              Want to buy something that makes you <span className="font-semibold">UNIQUE?</span>
            </p>
            <Link
              to="/"
              className="inline-block mb-4 text-red-600 hover:text-red-800 font-semibold underline"
            >
              Start SHOPPING!
            </Link>
            <p className="text-base md:text-lg max-w-md">
              We create unique fashion styles that stand out in the real world!
            </p>
          </div>
        </section>

        {/* Winter Arrivals Section */}
        <section data-scroll-section className="px-6 md:px-20 py-12 max-w-[1200px] mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-10">/ WINTER ARRIVALS</h1>
          <div className="flex flex-wrap  gap-4">
            <div className="w-full md:w-auto h-[230px] md:h-[300px] rounded-lg overflow-hidden shadow-md">
              <img
                src="https://i.pinimg.com/736x/03/21/8a/03218afdca3cdc926b189fb14840331a.jpg"
                alt="Winter Collection"
                className="w-full sm:object-bottom lg:object-cover"
              />
            </div>
            <div className="w-full md:w-auto h-[280px] md:h-[360px] rounded-lg overflow-hidden shadow-md">
              <img
                src="https://i.pinimg.com/736x/c2/4a/26/c24a264dfe0d507e477993fbb8cf546c.jpg"
                alt="Winter Collection"
                className="w-full sm:object-bottom lg:object-cover"
              />
            </div>
            <div className="w-full md:w-72 flex flex-col items-center text-center md:text-left gap-3 text-sm md:text-base px-4">
              <p>Get the best collection of winter clothes worldwide.</p>
              <p>Crafted with premium quality leather which contains amazing fashion styles.</p>
            </div>
            <div className="w-full md:w-auto h-[280px] md:h-[360px] rounded-lg overflow-hidden shadow-md">
              <img
                src="https://i.pinimg.com/736x/cc/69/a3/cc69a38fffe5e8760295a58602cc7987.jpg"
                alt="Winter Collection"
                className="w-full sm:object-bottom lg:object-cover"
              />
            </div>
          </div>
        </section>

        {/* Men's Collection Section */}
        <section
          data-scroll-section
          className="px-6 md:px-20 py-20 max-w-[1200px] mx-auto flex flex-wrap gap-8 justify-between bg-[#ededed]"
        >
          <h1 className="text-3xl md:text-5xl w-full md:w-auto font-bold">/ FOR MEN</h1>
          <div className="w-full w-full">
            {['SHOES', 'JACKETS', 'SHIRTS'].map((item, index) => (
              <button
                key={index}
                className="block w-full py-5 border-b-1 outline-none text-left hover:text-red-600 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h1 className="text-xl md:text-2xl font-medium">{item}</h1>
                  <div className="flex text-red-500 items-center gap-1">
                    <Link to={`/?category=${item.toLowerCase()}`} className="hover:underline">
                      SEE MORE ITEMS
                    </Link>
                    <IoIosArrowRoundForward className="text-xl" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div data-scroll-section>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
