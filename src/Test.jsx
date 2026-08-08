import React, { useState } from 'react';
import aneliaImage from "./assets/pictures/good/anelia-good-ench-edit.png";

const Test = () => {

  // Collection of reliable transparent PNG cutouts
  const pngCutouts = [
    "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8xNV9mdWxsX2JvZHlfcGhvdG9fb2ZfYV95b3VuZ19tYW5faW5fY2FzdWFsX2Nsb3RoX2M3YWFmOTc3LTRhYjgtNGJhOS1iNzRkLTFiNjc1YzEwOGVhYi5wbmc.png",
    "https://pngimg.com/uploads/man/man_PNG6530.png",
    "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"
  ];

  const [imgIndex, setImgIndex] = useState(0);

  const handleImageError = () => {
    if (imgIndex < pngCutouts.length - 1) {
      setImgIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#E2E2E2] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Outer Wrapper - Top padding gives room for head overflow */}
      <div className="relative w-full max-w-4xl pt-32 pb-12 px-4">
        
        {/* Main Card Frame - Serving as absolute bottom reference */}
        <div className="relative w-full bg-[#F5F5F3] rounded-[2.5rem] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] h-[280px] sm:h-[320px] flex items-center">
          
          {/* Left Text Column - Width constrained to guarantee space for image */}
          <div className="w-[50%] sm:w-[45%] p-6 sm:p-10 md:p-12 space-y-3 sm:space-y-4 z-10 text-left">
            <div className="space-y-0.5 text-left">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
                Design Better
              </h1>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-neutral-400 italic font-['Instrument_Serif'] tracking-wide">
                Faster Smarter
              </h2>
            </div>

            <p className="text-neutral-600 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
              I design refined brands, websites, and interfaces for ambitious founders and creative teams.
            </p>
          </div>

          {/* PNG Cutout - Strictly anchored to bottom-0 of the card frame */}
          <img
            src={aneliaImage}
            alt="Person PNG Cutout"
            className="absolute pointer-events-none z-20
                       /* Pin image bottom EXACTLY to card bottom */
                       bottom-0
                       /* Right positioning */
                       left-2 sm:left-6 md:left-10
                       /* Height extends up past card top border */
                       h-[145%] sm:h-[155%] md:h-[165%]
                       max-w-[45%] sm:max-w-[50%]
                       w-auto object-contain object-bottom
                      "
          />

        </div>
      </div>
    </div>
  );
};
export default Test;
