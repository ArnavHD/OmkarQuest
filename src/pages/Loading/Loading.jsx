import desktopBg from "../../assets/OmkarQuest_Loading_2560x1440.png";
import mobileBg from "../../assets/OmkarQuest_Phone.png";

const Loading = () => {
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {/* Responsive backgrounds */}
      <picture className="absolute inset-0 h-full w-full">
        <source media="(min-width: 768px)" srcSet={desktopBg} />
        <img
          src={mobileBg}
          alt="Omkar Quest loading background"
          className="h-full w-full object-cover object-center"
        />
      </picture>

      {/* Animated golden spinner */}
      <div
        className="
          absolute z-10
          left-1/2 -translate-x-3.5 sm:translate-x-9
          top-[56%] md:top-[60%]
          flex items-center justify-center
        "
        role="status"
        aria-label="Loading Omkar Quest"
      >
        <div
          className="
            h-10 w-10 md:h-12 md:w-12
            animate-spin rounded-full
            border-[3px] border-[#FFD76A]/25
            border-t-[#FFD76A]
            border-r-[#FF9B24]
            shadow-[0_0_18px_rgba(255,175,45,0.45)]
          "
        />
      </div>
    </main>
  );
};

export default Loading;
