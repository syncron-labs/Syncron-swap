import ImageComponent from '@/src/components/image/image-component';
import Link from 'next/link';
import React from 'react'

const HeroSection= () => {
  return (
    <div className=" h-screen">
      <div className="absolute inset-0 m-auto max-w-xs h-[300px] blur-[118px] mt-0 sm:max-w-md md:max-w-lg glow-bg"></div>
      <section className="relative pt-14 md:pt-24">
        <div>
          <ImageComponent
            alt="landing banner"
            src="/landing-banner.png"
            placeholder="blur"
            height={300}
            width={500}
            className="mx-auto opacity-60  hover:mt"
          />
        </div>

        <div className="relative  mt-[-20px] max-w-screen-xl mx-auto px-4 flex flex-col items-center justify-center  md:px-8">
          <div className="space-y-5 max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-semibold mx-auto md:text-6xl gradient-text">
              Trade crypto and NFTs with confidence
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Buy, sell, and explore tokens and NFTs
            </p>
          </div>
          <Link href="/swap">
            <button className="bg-gradient-to-r from-primary via-primary to-lime-400 px-24 py-5 text-black rounded-3xl mt-10">
              Get Started
            </button>
          </Link>
          <p className="mt-5 text-gray-400">Learn more</p>
        </div>
      </section>
    </div>
  );
}

export default HeroSection