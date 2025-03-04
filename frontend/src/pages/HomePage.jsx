import React, { useEffect } from 'react';
import Header from '../components/Header';
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
      
      setTimeout(() => {
        scroll.update();
      }, 500);
  
      return () => {
        scroll.destroy();
      };
    }
  }, []);
  
  return (
    <>
      <div data-scroll-container>
        {/* Hero Section */}
        <div data-scroll-section className="text-black pt-15 flex flex-wrap md:flex-nowrap gap-2 items-start bg-[#ededed] w-full h-auto">
          <div className="w-full md:w-[500px] flex-shrink-0 h-[70vh] md:h-screen">
            <img src="https://i.pinimg.com/736x/ff/e3/12/ffe31285971af72917c1c688f500d8b2.jpg" className="w-full h-full object-cover object-top md:object-center" alt="Fashion" />
          </div>
          <div className="w-full md:w-[400px] flex-shrink-0 h-auto md:h-screen flex flex-col gap-2">
            <div className="w-full h-full bg-red-800 rounded-b-2xl">
              <img src="https://i.pinimg.com/736x/58/06/30/5806302758651f2e6aec4e413e66b34f.jpg" className="rounded-b-2xl w-full h-full object-cover " alt="Unique Style" />
            </div>
            <div className="px-4 text-center md:text-left">
              <p className="text-sm">Want to buy something that makes you UNIQUE? Start <Link to="/products" className="underline text-red-500">SHOPPING!</Link></p>
              <p className="text-sm">We create unique fashion styles that stand out in the real world!</p>
            </div>
          </div>
          <div className="w-full md:w-[450px] flex-shrink-0 h-[70vh] md:h-screen">
            <img src="https://i.pinimg.com/736x/0a/c8/a0/0ac8a0bd503f0e838525a4af3af81c17.jpg" className="w-full  h-full object-cover object-top md:object-center" alt="Fashion" />
          </div>
        </div>

        {/* Winter Arrivals Section */}
        <div data-scroll-section className="text-black bg-[#ededed] w-full px-4 md:px-20 py-10">
          <h1 className="text-3xl md:text-5xl pb-8">/ WINTER ARRIVALS</h1>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="w-full md:w-auto h-92">
              <img src="https://i.pinimg.com/736x/03/21/8a/03218afdca3cdc926b189fb14840331a.jpg" className="w-full h-full object-cover" alt="Winter Collection" />
            </div>
            <div className="w-full md:w-auto h-110">
              <img src="https://i.pinimg.com/736x/c2/4a/26/c24a264dfe0d507e477993fbb8cf546c.jpg" className="w-full h-full object-cover" alt="Winter Collection" />
            </div>
            <div className="w-full md:w-72 flex flex-col items-center text-center md:text-left gap-3 text-sm">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
              <p>Nemo quo voluptates perspiciatis! Totam beatae ratione tempora tenetur voluptatum debitis laborum.</p>
              <div className="flex text-red-500 items-center">
                <h1>SEE MORE</h1>
                <IoIosArrowRoundForward className="text-xl" />
              </div>
            </div>
            <div className="w-full md:w-auto h-110">
              <img src="https://i.pinimg.com/736x/cc/69/a3/cc69a38fffe5e8760295a58602cc7987.jpg" className="w-full h-full object-cover" alt="Winter Collection" />
            </div>
          </div>
        </div>

        {/* Men's Collection Section */}
        <div data-scroll-section className="text-black bg-[#ededed] h-auto py-20 px-4 md:px-20 flex flex-wrap gap-6 md:gap-20 justify-between">
          <h1 className="text-3xl md:text-5xl w-full md:w-auto">/ FOR MEN</h1>
          <div className="w-full md:w-2/3">
            {['SHOES', 'JACKETS', 'SHIRTS'].map((item, index) => (
              <button key={index} className="block w-full py-5 border-b-2 outline-none text-left">
                <div className="flex justify-between">
                  <h1 className="text-xl md:text-2xl">{item}</h1>
                  <div className="flex text-red-500 items-center">
                  <Link to={`/products?category=${item.toLowerCase()}`}>SEE MORE ITEMS</Link>
                    <IoIosArrowRoundForward className="text-xl" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div data-scroll-section>
          <Footer />
        </div>
      </div>
    </> 
  );
};

export default HomePage;
