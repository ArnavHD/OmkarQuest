import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import quoteFrame from "../../../assets/omkar_quote_banner_1200x200.png";

const quotes = [
  {
    text: "আত্মপ্রচারে অহমিকা বাড়ে, যোগ্যতা বাড়ে না।",
    source: "পথের সঞ্চয়",
  },
  {
    text: "Work with steady purpose and steadfast energy.",
    source: "পথের সঞ্চয়",
  },
  {
    text: "A person is made by their faith. As they believe, so they become.",
    source: "Bhagavad Gita (17.3)",
  },
  {
    text: "The mind can be a friend or an enemy.",
    source: "Bhagavad Gita (6.5–6.6)",
  },
];

const HomeQuoteCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  const changeQuote = (step) => {
    setDirection(step > 0 ? "next" : "prev");

    setActiveIndex(
      (current) => (current + step + quotes.length) % quotes.length,
    );
  };

  const activeQuote = quotes[activeIndex];

  return (
    <section
      aria-label="Spiritual quotes"
      className="relative mx-auto w-full aspect-[6/1]"
    >
      {/* Decorative Background */}
      <img
        src={quoteFrame}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="
          absolute inset-0
          h-48 w-full
          object-fill
          pointer-events-none
          select-none
        "
      />

      {/* Carousel Content */}
      <div
        className="
          absolute inset-0 -bottom-8 z-10
          flex items-center justify-between
          px-[5%]
        "
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => changeQuote(-1)}
          aria-label="Previous quote"
          className="
            flex shrink-0 items-center justify-center
            h-8 w-8
            sm:h-10 sm:w-10
            lg:h-11 lg:w-11
            rounded-full
            border border-[#C88919]
            bg-gradient-to-b
            from-[#FFF2A4]
            via-[#FFD15C]
            to-[#E99C18]
            text-[#211309]
            shadow-[0_3px_8px_rgba(0,0,0,0.65)]
            transition-all duration-300
            hover:scale-110
            active:scale-95
          "
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Quote */}
        <div
          key={activeIndex}
          className="
          
            flex min-w-0 flex-1 flex-col
            items-center justify-center
            px-2 text-center
            animate-[quoteFade_350ms_ease-out]
          "
        >
          <blockquote
            className="
              hind-siliguri
              text-[#FFF4E4]
              text-[clamp(12px,1.6vw,27px)]
              italic
              leading-[1.1]
              drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]
            "
          >
            “{activeQuote.text}”
          </blockquote>

          <p
            className="
              mt-1
              font-serif
              text-[#FFE7C5]
              text-[clamp(10px,1.1vw,18px)]
              leading-tight
            "
          >
            — {activeQuote.source}
          </p>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => changeQuote(1)}
          aria-label="Next quote"
          className="
            flex shrink-0 items-center justify-center
            h-8 w-8
            sm:h-10 sm:w-10
            lg:h-11 lg:w-11
            rounded-full
            border border-[#C88919]
            bg-gradient-to-b
            from-[#FFF2A4]
            via-[#FFD15C]
            to-[#E99C18]
            text-[#211309]
            shadow-[0_3px_8px_rgba(0,0,0,0.65)]
            transition-all duration-300
            hover:scale-110
            active:scale-95
          "
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </section>
  );
};

export default HomeQuoteCarousel;
