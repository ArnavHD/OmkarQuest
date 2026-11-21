import { Link, useRouteError } from "react-router";
import { ArrowLeft, House, Sparkles, Flower2 } from "lucide-react";

// Replace these paths with your actual background filenames
import desktopBg from "../../assets/GoldenError.png";
import mobileBg from "../../assets/GoldenErrorMobile.png";

const ErrorPage = () => {
  const error = useRouteError();

  const status = error?.status || 404;
  const isNotFound = status === 404;

  return (
    <main className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      {/* Responsive background */}
      <picture className="absolute inset-0 -z-20">
        <source media="(min-width: 768px)" srcSet={desktopBg} />
        <img
          src={mobileBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </picture>

      {/* Soft overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-[#160918]/35 md:bg-[#160918]/20" />

      {/* Main content */}
      <div className="relative w-full max-w-xl text-center">
        

        {/* Error number */}
        <div className="relative">
          <Sparkles className="absolute left-[12%] top-3 h-5 w-5 text-[#FFE5A0] sm:left-[18%]" />

          <h1
            className="
              font-serif text-[clamp(5.5rem,23vw,12rem)]
              font-bold leading-none tracking-tight
              text-transparent
              bg-gradient-to-b from-[#FFF4C5] via-[#FFD66F] to-[#B66A23]
              bg-clip-text
              drop-shadow-[0_5px_12px_rgba(0,0,0,0.3)]
            "
          >
            {status}
          </h1>

          <Sparkles className="absolute bottom-4 right-[12%] h-5 w-5 text-[#FFE5A0] sm:right-[18%]" />
        </div>

        {/* Error title */}
        <h2 className="mt-3 font-serif text-2xl font-bold text-[#FFF0C5] drop-shadow-lg sm:mt-5 sm:text-4xl">
          {isNotFound ? "A Path Yet to Be Found" : "A Moment of Stillness"}
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md font-serif text-sm leading-relaxed text-[#FFF1D9] drop-shadow-md sm:text-lg">
          {isNotFound
            ? "Even the most beautiful journeys sometimes take an unexpected turn. The page you seek is not here."
            : "Something interrupted your journey. Please return to the beginning and try again."}
        </p>

        {/* Golden divider */}
        <div className="mx-auto my-7 h-px w-36 bg-gradient-to-r from-transparent via-[#F5C46D] to-transparent sm:my-9 sm:w-52" />

        {/* Home button */}
        <Link
          to="/"
          className="
            group inline-flex items-center justify-center gap-3
            rounded-full border-2 border-[#FFCA52]
            bg-gradient-to-b from-[#A80D35] via-[#850024] to-[#490016]
            px-6 py-3 font-serif text-sm font-semibold text-[#FFF2DB]
            shadow-[0_0_18px_rgba(255,170,0,0.45)]
            transition-all duration-300
            hover:scale-[1.04]
            hover:shadow-[0_0_28px_rgba(255,190,40,0.8)]
            sm:px-9 sm:py-4 sm:text-lg
          "
        >
          <House className="h-5 w-5 text-[#FFD65B]" />
          Return to Home
          <ArrowLeft className="h-4 w-4 text-[#FFD65B] transition-transform duration-300 group-hover:-translate-x-1" />
        </Link>

        {/* Closing quote */}
        <p className="mt-8 font-serif text-xs italic tracking-wide text-[#FFE3AB] sm:mt-10 sm:text-sm">
          "Every new beginning starts with finding your way."
        </p>
      </div>
    </main>
  );
};

export default ErrorPage;
