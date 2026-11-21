import { Link } from "react-router";
import { CalendarDays, ArrowRight } from "lucide-react";

import HomeLogo from "../../Shared/Logo/HomeLogo";
import HomeQuote from "../HomeQuotes/HomeQuote";
import HomeFeatures from "../HomeFeatures/HomeFeatures";

import desktopBg from "../../../assets/Omkar_Quest_Background_2560x1440.png";
import mobileBg from "../../../assets/Omkar_Quest_Mobile_Background_1080x2340.png";
import HomeQuoteCarousel from "../HomeQuoteCarousel/HomeQuoteCarousel";

const Home = () => {
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {/* Responsive Background */}
      <picture className="absolute inset-0 z-0">
        <source media="(min-width: 768px)" srcSet={desktopBg} />

        <img
          src={mobileBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-fill"
        />
      </picture>

      {/* Center Omkar Logo - All Devices */}
      <div
        className="
          absolute z-20
          left-1/2
          -translate-x-1/2
        "
      >
        <HomeLogo />
      </div>

      {/* Decorative Quote - Tablet/Desktop Only */}
      <div
        className="
          hidden md:block
          absolute z-20
          left-[7%] top-[25%] w-[45%]
          md:left-[14.5%]
          md:top-[21%]
          md:w-[16%]
          aspect-[10/9]
        "
      >
        <HomeQuote />
      </div>

      {/* Questionnaire Button and Feature Cards - Tablet/Desktop Only */}
      <div
        className="
          hidden md:block
          absolute z-20
          left-1/2 -translate-x-1/2

          bottom-[9%]
          w-[94%]

          lg:bottom-[20%]
          lg:w-[72%]
          xl:w-[76%]
          2xl:w-[74%]

          max-w-[1450px]
        "
      >
        <HomeFeatures />
      </div>

      {/* Bottom Bhagavad Gita Quote Carousel - Tablet/Desktop Only */}
      <div
        className="
          hidden md:block
          absolute z-20
          left-1/2 -translate-x-1/2

          bottom-[3%]
          w-[92%]

          md:-bottom-[01%]
          md:w-[65%]

          xl:w-[58%]
          max-w-[1000px]
        "
      >
        <HomeQuoteCarousel />
      </div>

      {/* Mobile Only - Center Questionnaire Button */}
      <div
        className="
          absolute z-20
          left-1/2 top-1/2
          -translate-x-1/2 translate-y-5
          w-full px-4
          flex justify-center
          md:hidden
        "
      >
        <Link
          to="/dashboard/dailyQuestionnaire"
          className="
            group flex items-center justify-center
            gap-3
            rounded-full
            border-2 border-[#FFCA52]
            bg-gradient-to-b
            from-[#A80D35]
            via-[#850024]
            to-[#490016]
            px-5 py-3
            text-[#FFF2DB]
            shadow-[0_0_18px_rgba(255,170,0,0.75)]
            transition-all duration-300
            hover:scale-[1.03]
            hover:shadow-[0_0_28px_rgba(255,190,40,0.9)]
            sm:px-8
          "
        >
          <CalendarDays
            className="h-5 w-5 shrink-0 text-[#FFD65B] sm:h-7 sm:w-7"
            strokeWidth={1.8}
          />

          <span
            className="
              font-serif
              text-sm font-semibold
              sm:text-xl
              lg:text-2xl
              whitespace-nowrap
            "
          >
            Start Today's Questionnaire
          </span>

          <ArrowRight
            className="
              h-5 w-5 shrink-0
              text-[#FFD65B]
              transition-transform duration-300
              group-hover:translate-x-1
              sm:h-7 sm:w-7
            "
          />
        </Link>
      </div>
    </main>
  );
};

export default Home;
