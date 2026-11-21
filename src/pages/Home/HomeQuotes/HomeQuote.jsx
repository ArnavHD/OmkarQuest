import quoteFrame from "../../../assets/omkar_blank_quote_frame_600x540.png";

const HomeQuote = ({
  quote = "কিছু অসাধ্য নাই সকলি সম্ভব মধুর অখণ্ড-নামে ডুবাইলেই সব।",
  source = "Swami Swarupananda",
}) => {
  return (
    <div
      className="
        relative
        w-full
        aspect-[10/9]
        flex items-center justify-center
        drop-shadow-[0_0_12px_rgba(255,180,45,0.3)]
      "
    >
      {/* Decorative Quote Background */}
      <img
        src={quoteFrame}
        alt=""
        aria-hidden="true"
        className="
          absolute inset-0
          w-full h-full
          object-fill
          pointer-events-none
          select-none
        "
      />

      {/* Quote Content */}
      <div
        className="
          relative z-10
          flex flex-col items-center justify-center
          w-[80%] h-[70%]
          text-center
          pt-[3%]
        "
      >
        {/* Quote Text */}
        <blockquote
          className="
            tiro-bangla
            text-[#24170C]
            text-[clamp(10px,1.2vw,20px)]
            leading-[1.05]
            font-bold italic
          "
        >
          <span
            className="
              mr-1
              text-[1.5em]
              font-bold
              leading-none
            "
          >
            “
          </span>

          {quote}

          <span
            className="
              ml-1
              text-[1.5em]
              font-bold
              leading-none
            "
          >
            ”
          </span>
        </blockquote>

        {/* Quote Source */}
        <p
          className="
            mt-[4%]
            font-serif
            font-semibold
            text-[#39250E]
            text-[clamp(9px,0.9vw,15px)]
            leading-tight
          "
        >
          — {source}
        </p>
      </div>
    </div>
  );
};

export default HomeQuote;
