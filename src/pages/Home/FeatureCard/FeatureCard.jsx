import { Link } from "react-router";
import featureFrame from "../../../assets/omkar_blank_quote_frame_600x540.png";

const FeatureCard = ({ title, description, icon, path }) => {
  return (
    <Link
      to={path}
      className="
        group relative block
        w-full aspect-[6/5]
        min-w-0
        transition-transform duration-300
        hover:-translate-y-1
      "
    >
      {/* Decorative Card Background */}
      <img
        src={featureFrame}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-48 object-fill pointer-events-none"
      />

      {/* Card Content */}
      <div
        className="
          absolute inset-[9%] z-10 top-10
          flex flex-col items-center justify-center
          text-center text-[#241608]
        "
      >
        {/* Custom PNG Icon */}
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className="
            w-8 h-8
            sm:w-9 sm:h-9
            lg:w-11 lg:h-11
            object-contain
            shrink-0
            mb-1
            transition-transform duration-300
            group-hover:scale-110
          "
        />

        {/* Title */}
        <h3 className="font-serif  font-bold text-[clamp(10px,1.1vw,19px)] leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-1 font-serif text-[clamp(9px,0.9vw,15px)] leading-tight">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default FeatureCard;