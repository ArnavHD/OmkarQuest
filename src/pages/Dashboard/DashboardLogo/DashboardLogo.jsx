import { Link } from "react-router";
import omkarLogo from "../../../assets/omkar_200x200.png";
import lotusDevider from "../../../assets/DashboardImages/dividerLotus.png"

const DashboardLogo = () => {
  return (
    <Link
      to="/"
      className="group flex w-full flex-col items-center justify-center px-3  text-center"
    >
      {/* Om Symbol */}
      <div className="relative mb-1 flex items-center justify-center">
        <img
          src={omkarLogo}
          alt="Omkar symbol"
          className="h-20 w-20 object-contain drop-shadow-[0_0_12px_rgba(255,193,85,0.35)] transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Brand Name */}
      <h1
        className="bg-gradient-to-b from-[#FFF2B8] via-[#F8C95E] to-[#C8872E] bg-clip-text font-serif text-[29px] font-bold leading-tight tracking-wide text-transparent"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        Omkar Quest
      </h1>

      {/* Subtitle */}
      <p
        className="mt-0.5 text-[12px] font-medium tracking-[0.02em] text-[#F5D68C]"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        Daily Spiritual Questionnaire
      </p>

      {/* Decorative Golden Divider */}
      <div className=" flex w-full max-w-[235px] items-center justify-center gap-2">
        
        <img src={lotusDevider} alt="" />
        
        {/* <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#DFA94E] to-[#F5D58C]" />


            

        <svg
          width="38"
          height="18"
          viewBox="0 0 38 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0 text-[#F3C86D]"
        >
          <path
            d="M19 2C16.5 5.5 16.5 8 19 11C21.5 8 21.5 5.5 19 2Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M19 11C15 6 10.5 7 9 9C12 13 16 14 19 11Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M19 11C23 6 27.5 7 29 9C26 13 22 14 19 11Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M5 13C10 15 14 15 19 12C24 15 28 15 33 13"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path d="M19 11V16" stroke="currentColor" strokeWidth="1.2" />
        </svg>

        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#DFA94E] to-[#F5D58C]" /> */}
      </div>
    </Link>
  );
};

export default DashboardLogo;
