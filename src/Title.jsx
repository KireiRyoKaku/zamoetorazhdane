import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "./assets/pictures/PregurnataLogoPinkNoText.png";
import aneliaImage from "./assets/pictures/good/anelia-good-ench-edit.png";
import katyaImage from "./assets/pictures/good/katya-good-ench-old.png";
import SocialLinks from "./components/SocialLinks";

const cycleWords = ["Прегърната", "видяна", "приета", "чута", "разбрана"];

const Title = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [heroTextVisible, setHeroTextVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const arcPathRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setLogoVisible(true), 900);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setHeroTextVisible(true), 1500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((previous) => (previous + 1) % cycleWords.length);
        setWordVisible(true);
      }, 1200);
    }, 4500);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!heroTextVisible) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const duration = 3000;
      const ease = (value) => 1 - Math.pow(1 - value, 3);
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = ease(progress);
        const sideY = 50 * (1 - eased);
        const controlY = 50 + 50 * eased;
        arcPathRef.current?.setAttribute(
          "d",
          `M 0 ${sideY} Q 50 ${controlY} 100 ${sideY} L 100 50 L 0 50 Z`,
        );
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [heroTextVisible]);

  const handleClickAbout = () => {
    setIsVisible(false);
    setTimeout(() => navigate("/about"), 300);
  };
  const handleClickCourses = () => {
    setIsVisible(false);
    setTimeout(() => navigate("/events"), 300);
  };

  const aboutButtonClass =
    "mt-6 mb-6 rounded-3xl bg-moetoRazhdaneYellow px-6 py-2 font-rocaTwoRegular text-lg font-black text-black transition-all duration-500 ease-in-out hover:bg-transparent hover:text-black/30";
  const secondButtonClass =
    "mt-6 mb-6 rounded-3xl bg-moetoRazhdanePurple px-6 py-2 font-rocaTwoRegular text-xl font-white text-white transition-all duration-500 ease-in-out hover:bg-transparent hover:text-black/30";

  return (
    <div className={`overflow-x-hidden text-[#4E5F4C] transition-all duration-1000 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
      <div className="absolute right-4 top-6 z-30 sm:right-6 lg:right-8"><SocialLinks /></div>

      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img src="/carousel/3.jpg" alt="Прегърната подкрепа" className="h-full w-full object-cover object-center saturate-50 backdrop-brightness-50" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.45)_18%,rgba(27,18,17,0.18)_44%,rgba(27,18,17,0.56)_100%)]" />
          <div className="absolute inset-0 bg-white/40" />
        </div>
        <div className="relative z-10 flex h-full flex-col px-4 py-6 sm:px-6 lg:px-8">
          <div className={`mx-auto mt-4 flex w-full max-w-6xl justify-center pt-1 transition-opacity duration-1500 ease-in-out sm:pt-2 lg:pt-3 ${logoVisible ? "opacity-100" : "opacity-0"}`}>
            <img src={logoImage} alt="Прегърната лого" className="h-24 w-auto object-contain opacity-95 sm:h-28 lg:h-28" />
          </div>
          <div className={`relative mx-auto -mt-10 flex w-full max-w-6xl flex-1 items-start justify-center transition-opacity duration-1500 ease-in-out sm:-mt-14 lg:-mt-1 ${heroTextVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="flex h-[220px] w-full flex-col items-center justify-center gap-5 sm:h-[280px] lg:h-[320px]">
              <div className="flex h-[5rem] w-full flex-shrink-0 items-center sm:h-[6.5rem] lg:h-[8rem]">
                <div className="flex w-full items-baseline">
                  <div className="flex w-1/2 justify-end"><span className=" whitespace-nowrap pr-[0.25em] text-[clamp(2.2rem,5.5vw,5rem)] font-black tracking-[-0.02em] text-white">Да бъдеш</span></div>
                  <div className="w-1/2">
                <span style={{ transition: "opacity 1.2s ease-in-out, transform 1.2s ease-in-out" }} className={`inline-block drop-shadow-[10px_10px_10px_rgba(0,0,0,0.9)]
                text-moetoRazhdanePurple ${wordIndex === 0 ? "font-magnoliaScript text-[clamp(2.6rem,6.5vw,6rem)] font-normal tracking-normal" : "text-[clamp(2.2rem,5.5vw,5rem)] font-black tracking-[-0.02em]"} ${wordVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>{cycleWords[wordIndex]}</span>
                  </div>
                </div>
            </div>
                        <div className="space-y-0.5">
                            <p className="ml-[25%] w-1/2 px-6 text-justify text-wrap text-xl leading-relaxed text-white sm:text-xl">
                                Подкрепяме жената да върви по своя път в майчинството 
                                със спокойствие и увереност, за да се почувства отново себе си,
                                в и извън ролята си на майка.
                            </p>
                        </div>
              <button type="button" onClick={() => navigate("/events")} className="rounded-3xl bg-moetoRazhdanePurple px-6 py-2 text-lg font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/60">ИЗБЕРИ СВОЯТА ПОДКРЕПА</button>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-[linear-gradient(180deg,_#f8efe8_0%,_#ebd7ca_100%)]">
        <div className="pointer-events-none absolute inset-x-0 -top-[220px] z-20 h-[220px]"><svg viewBox="0 0 100 50" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true"><path ref={arcPathRef} d="M 0 50 Q 50 50 100 50 L 100 50 L 0 50 Z" fill="#f8efe8" /></svg></div>
        <section className="mx-auto w-full max-w-6xl px-4 py-10 text-center sm:px-6 md:py-4 lg:px-8">
            <div className="mx-auto w-full max-w-5xl">
                <h2 className="mt-3 mb-16 font-magnoliaScript text-8xl text-moetoRazhdanePurple/80 sm:text-7xl">Кои сме<span className="ml-3 whitespace-nowrap pr-[0.25em] underline text-[clamp(2.2rem,5.5vw,5rem)] font-black tracking-[-0.02em] text-moetoRazhdanePurple">ние</span></h2>
                {/* <h3 className="mt-3 font-magnoliaScript text-moetoRazhdaneWhite">Почти всички услуги за родители са насочени към обгрижване на бебето...</h3> */}

                <div className="relative w-full bg-[#F5F5F3] rounded-[2.5rem] border shadow-[0_20px_50px_rgba(0,0,0,0.06)] h-[280px] sm:h-[320px] flex items-center">
                    <div className="ml-[45%] w-[50%] sm:w-[45%] p-6 sm:p-10 md:p-12 space-y-3 sm:space-y-4 z-10 text-left">
                      <div className="space-y-0.5 text-left">
                            <h1 className="font-rocaTwoBold text-6xl font-black text-moetoRazhdanePurple">Анелия</h1>
                            <h3 className="font-rocaTwoBold text-2xl font-black text-moetoRazhdanePurple/65">консултант по детски сън</h3>
                            <p className="mt-8 text-base leading-relaxed text-[#4E5F4C]/80">
                                При нас фокусът е върху <b>майката</b>. Ние вярваме, че <b>тя</b> има най-голяма нужда да бъде прегърната в уязвимите периоди от майчинството.
                            </p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                  <button type="button" onClick={handleClickAbout} className={aboutButtonClass}>НАШИЯ ЕКИП</button>
                              </div>
                              <div>
                                  <button type="button" onClick={handleClickCourses} className={secondButtonClass}>МОИТЕ КУРСОВЕ</button>
                              </div>
                            </div>
                      </div>
                    </div>
                    <img
                    src={aneliaImage}
                    alt="Anelia"
                              className="absolute z-20 bottom-0 
                            left-2 sm:left-6 md:left-10
                            h-[120%] sm:h-[140%] md:h-[150%]
                            max-w-[45%] sm:max-w-[50%]
                            w-auto object-bottom"
                    />
                </div>

                <div className="mt-16 relative w-full bg-[#F5F5F3] rounded-[2.5rem] border shadow-[0_20px_50px_rgba(0,0,0,0.06)] h-[280px] sm:h-[320px] flex items-center">
                    <div className="ml-[10%] w-[50%] sm:w-[45%] p-6 sm:p-10 md:p-12 space-y-3 sm:space-y-4 z-10 text-left">
                        <div className="space-y-0.5 text-left">
                            <h3 className="font-rocaTwoBold text-6xl font-black text-moetoRazhdanePurple">Катя</h3>
                            <h3 className="font-rocaTwoBold text-2xl font-black text-moetoRazhdanePurple/65">холистичен психолог</h3>
                                  <p className="text-lg leading-relaxed text-[#4E5F4C]/80">
                                Във всичко, което създаваме, на преден план е <b>жената</b> с нейното индивидуално преживяване в майчинството.
                                  </p>
                                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <button type="button" onClick={handleClickAbout} className={aboutButtonClass}>НАШИЯ ЕКИП</button>
                            </div>
                            <div>
                                <button type="button" onClick={handleClickCourses} className={secondButtonClass}>МОИТЕ КУРСОВЕ</button>
                            </div>
                </div>
                        </div>
                    </div>
                          <img src={katyaImage}
                              alt="Катя"
                              className="absolute z-20 bottom-0 
                            right-2 sm:right-6 md:right-10
                            h-[110%] sm:h-[115%] md:h-[125%]
                            max-w-[45%] sm:max-w-[50%]
                            w-auto object-bottom" />
                </div>
                      

                      
                      
            </div>
            <div className="mt-10 border-t border-[#4E5F4C]/15 pt-10">
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-moetoRazhdanePurple">Какво предлагаме</p>
                      <ul className="mt-4 space-y-3 text-base leading-7 text-[#4E5F4C]/80">
                          <li>• Групова и индивидуална подкрепа за майки.</li>
                          <li>• Събития на живо — месечни срещи в Пловдив и София.</li>
                          <li>• Експертни онлайн срещи, лекции и разговори в кръг.</li>
                          <li>• Общност, принадлежност и взаимна подкрепа.</li>
                          <li>• Менторска програма по личния път в спокойното майчинство.</li>
                      </ul>
                  </div>
        </section>
        <section className="mx-auto w-full max-w-6xl border-t border-[#4E5F4C]/15 px-4 py-10 sm:px-6 md:py-14 lg:px-8"><div className="grid gap-8 md:grid-cols-3"><div><p className="text-sm font-semibold uppercase tracking-[0.3em] text-moetoRazhdanePurple">Индивидуална подкрепа</p><p className="mt-3 text-base leading-8 text-[#4E5F4C]/80">Индивидуални сесии с психолог и консултации по детски сън.</p></div><div><p className="text-sm font-semibold uppercase tracking-[0.3em] text-moetoRazhdanePurple">Онлайн пространство</p><p className="mt-3 text-base leading-8 text-[#4E5F4C]/80">Експертни разговори, идеи и вдъхновение в удобно време.</p></div><div><p className="text-sm font-semibold uppercase tracking-[0.3em] text-moetoRazhdanePurple">Подкаст</p><p className="mt-3 text-base leading-8 text-[#4E5F4C]/80">Писма за вдъхновение — за спокойствие, самочувствие и тяга към себе си.</p></div></div></section>
      </div>
          
    </div>
  );
};

export default Title;