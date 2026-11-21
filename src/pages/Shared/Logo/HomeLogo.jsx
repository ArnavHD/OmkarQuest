import omLogo from "../../../assets/LogoTest.png";

const HomeLogo = () => {
  return (
    <div className="flex mt-8 flex-col items-center text-center">
      {/* Om Logo */}
      <img
        src={omLogo}
        alt="Omkar Quest Logo"
        width="768"
        height="768"
        fetchPriority="high"
        className="
          w-28 sm:w-32 md:w-40 lg:w-44 xl:w-48
          h-auto object-contain
          drop-shadow-[0_0_20px_rgba(255,170,0,0.35)]
        "
      />

      {/* Heading and Lotus Divider */}
      <div className="relative isolate flex flex-col items-center -mt-3 md:-mt-5">
        {/* Main Title - Above Lotus */}
        <h1
          className="
            relative z-20
            cormorant-garamond
            text-5xl sm:text-6xl lg:text-7xl
            leading-[1.10]
            pb-2
            bg-gradient-to-b
            from-[#FFF9CE]
            via-[#F9D875]
            to-[#C78B29]
            bg-clip-text text-transparent
          "
        >
          Omkar Quest
        </h1>

        {/* Golden Divider - Behind Heading */}
        <div
          className="
            relative z-0
            -mt-5 sm:-mt-6 lg:-mt-7
            mb-2
            flex items-center justify-center
            w-56 sm:w-64 md:w-80
          "
        >
          {/* Left Golden Line */}
          <span
            className="
              h-px flex-1
              bg-gradient-to-r
              from-transparent to-[#F5C65B]
            "
          />

          {/* Lotus SVG */}
          <svg
            viewBox="0 0 64 40"
            className="
              w-12 h-8 mx-2
              shrink-0
              drop-shadow-[0_0_5px_#F5B642]
            "
            fill="none"
            aria-hidden="true"
          >
            {/* Center Petal */}
            <path
              d="M32 4 C24 14 25 25 32 34 C39 25 40 14 32 4Z"
              fill="#FFD76A"
              stroke="#B97817"
              strokeWidth="1"
            />

            {/* Left Petal */}
            <path
              d="M30 32 C17 31 12 23 12 13 C23 16 30 23 32 35Z"
              fill="#E6A12D"
              stroke="#FFD76A"
              strokeWidth="1"
            />

            {/* Right Petal */}
            <path
              d="M34 32 C47 31 52 23 52 13 C41 16 34 23 32 35Z"
              fill="#E6A12D"
              stroke="#FFD76A"
              strokeWidth="1"
            />

            {/* Bottom Left Petal */}
            <path
              d="M32 35 C20 39 10 34 5 27 C18 26 26 30 32 35Z"
              fill="#C78320"
              stroke="#FFD76A"
              strokeWidth="1"
            />

            {/* Bottom Right Petal */}
            <path
              d="M32 35 C44 39 54 34 59 27 C46 26 38 30 32 35Z"
              fill="#C78320"
              stroke="#FFD76A"
              strokeWidth="1"
            />
          </svg>

          {/* Right Golden Line */}
          <span
            className="
              h-px flex-1
              bg-gradient-to-l
              from-transparent to-[#F5C65B]
            "
          />
        </div>
      </div>

      {/* Subtitle */}
      <p
        className="
          relative z-10
          max-w-[320px] sm:max-w-md lg:max-w-xl -mt-2
          px-2
          font-serif
          text-base sm:text-lg lg:text-2xl
          leading-snug
          text-[#FFF5E6]
          drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
        "
      >
        A Daily Spiritual Questionnaire for
        <br className="hidden sm:block" /> Self-Reflection, Dharma &amp; Inner
        Growth
      </p>
    </div>
  );
};

export default HomeLogo;
