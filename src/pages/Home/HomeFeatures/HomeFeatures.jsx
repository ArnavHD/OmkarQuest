import flower from "../../../assets/lotus_icon_200x200.png"
import book from "../../../assets/omkar_book_200x200.png"
import progress from "../../../assets/omkar_progress_200x200.png"
import reflection from "../../../assets/omkar_feather_200x200.png"
import trophy from "../../../assets/omkar_trophy_200x200.png"
import meditation from "../../../assets/omkar_meditation_200x200.png"

import { Link } from "react-router";
import {
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import FeatureCard from "../FeatureCard/FeatureCard";




const features = [
  {
    title: "Daily Quotes",
    description: "Timeless wisdom for every day",
    icon: flower,
    path: "/quotes",
  },
  {
    title: "Learn Dharma",
    description: "Explore Hindu teachings & values",
    icon: book,
    path: "/dharma",
  },
  {
    title: "My Progress",
    description: "Track your spiritual growth",
    icon: progress,
    path: "/progress",
  },
  {
    title: "Journal",
    description: "Write, reflect and stay mindful",
    icon: reflection,
    path: "/journal",
  },
  {
    title: "Challenges",
    description: "Build better habits with daily actions",
    icon: trophy,
    path: "/challenges",
  },
  {
    title: "Meditation Guide",
    description: "Practices for peace & focus",
    icon: meditation,
    path: "/meditation",
  },
];

const HomeFeatures = () => {
  return (
    <section
      aria-label="Explore Omkar Quest"
      className="flex w-full flex-col items-center gap-3"
    >
      {/* Start Questionnaire Button */}
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

      {/* Six Feature Cards */}
      <div
        className="
           grid w-full
           
            grid-cols-3
            gap-1
            lg:grid-cols-6
            lg:gap-1
            xl:gap-1.5
        "
      >
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default HomeFeatures;
