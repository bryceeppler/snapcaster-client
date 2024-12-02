import { Button } from '@/components/ui/button';
import React from 'react';
import { motion } from 'motion/react';


type Props = {};

const Welcome = (props: Props) => {
  return (
    <>
      <div className="invisible h-2 w-full bg-primary sm:visible"></div>
      <div className="bg-[#000315] lg:overflow-hidden lg:pb-14">
        <Header />
        {/* Hero content */}
        <div className="mx-auto max-w-7xl pb-4 md:pb-0 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="mx-auto max-w-md px-6 sm:max-w-2xl sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
              <div className="flex flex-col pb-8">
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                  <span className="block">Find the best prices </span>
                  <span className="block text-primary">
                    on trading cards in Canada
                  </span>
                </h1>
                <p className="lg:text-md text-lg text-gray-300">
                  Search the largest trading card database in Canada to find the
                  best deals across 80+ Canadian stores - for free! From Magic
                  the Gathering, Lorcana, Yu-Gi-Oh, Pokemon and more, we’ve got
                  you covered.
                </p>
              </div>
            </div>
            <div className="-mb-16 mt-12 hidden sm:-mb-48 lg:relative lg:m-0 lg:block">
              <div className="mx-auto max-w-md px-6 text-white sm:max-w-2xl lg:max-w-none lg:px-0">
                <div className="relative flex h-[700px] w-[700px]">
                  <div className="h-[700px] w-[700px] block z-10">
                    <div className="" style={{width:"100%", height:"100%"}}>
                      <canvas style={{verticalAlign: "top", width: "700px", height: "700px"}} width="1400" height="1400"></canvas>
                    </div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute left-[14px] h-[700px] w-[600px] overflow-hidden flex items-center"
                  >
                    <img 
                      alt="Snapcaster Demo"
                      loading="lazy"
                      width="672"
                      height="700"
                      style={{color:"transparent"}}
                      src="/search-demo.png"
                      className="object-contain"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* section 2 */}
      <div className="relative mx-auto flex flex-col items-center justify-center gap-32 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <svg viewBox="0 0 1440 58" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" className="absolute top-0 bg-transparent"><path d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z" fill="#000000"></path></svg>
      <div className="flex w-full max-w-5xl flex-col items-center justify-center pt-8 sm:pt-16">
        <div className="flex flex-col text-center">
            <h2 className="sm:text-md font-mono text-sm font-light text-primary">By Canadians. For Canadians.</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">We bring all the cards into one place, so you don’t have to.</p>
            <p className="text-md mx-auto mt-5 max-w-prose text-gray-500 sm:text-lg">Search over 80 Canadian retailers at once for your favourite cards.</p>
            <div className="hidden flex-row justify-center gap-4 py-8 sm:flex">Icons go here</div>
        </div>
      </div>
      </div>
      {/* section 3 */}
      <div></div>
      <footer></footer>
    </>
  );
};

const Header = () => {
  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="flex justify-between p-6">
        <h1>
          <span className="cursor-pointer text-3xl font-bold tracking-tight text-white">
            snapcaster
          </span>
        </h1>
        <Button>Sign In</Button>
      </div>
    </div>
  );
};

export default Welcome;
