import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Target,
  CalendarCheck2,
} from "lucide-react";

import streaks from "../../../assets/DashboardImages/streak.png";
import comp from "../../../assets/DashboardImages/tick.png";
import average from "../../../assets/DashboardImages/average.png";
import wisdom from "../../../assets/DashboardImages/wisdom.png";
import challange from "../../../assets/DashboardImages/challange.png";
import challange1 from "../../../assets/DashboardImages/SunsetChariotofWisdom.png";
import challange2 from "../../../assets/DashboardImages/GoldenSunsetTempleSilhouette.png";
import challange3 from "../../../assets/DashboardImages/Meditationatmountain.png";
import namaste from "../../../assets/DashboardImages/GoldenNamaste.png";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import desktopBg from "../../../assets/DashboardImages/laptopDashBg.png";
import mobileBg from "../../../assets/Omkar_Quest_Mobile_Background_1080x2340.png";

// =====================================================
// OPTIONAL CARD BACKGROUND IMAGES
// =====================================================
// Import images when ready, then replace null below.

const DASHBOARD_IMAGES = {
  wisdom: wisdom,
  challenge: challange,
  learning1: challange1,
  learning2: challange2,
  learning3: challange3,
};

// =====================================================
// DATE HELPERS
// =====================================================

const getDateInTimeZone = (date, timeZone = "America/Regina") => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const shiftDate = (dateString, days) => {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day + days));

  return date.toISOString().slice(0, 10);
};

const getWeekDates = (today) => {
  const [year, month, day] = today.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  const mondayOffset = (date.getUTCDay() + 6) % 7;

  const monday = shiftDate(today, -mondayOffset);

  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (label, index) => ({
      label,
      date: shiftDate(monday, index),
    }),
  );
};

const calculateStreak = (completedDates, today) => {
  let cursor = today;
  let streak = 0;

  // Preserve yesterday's streak if today is not completed.
  if (!completedDates.has(cursor)) {
    cursor = shiftDate(cursor, -1);
  }

  while (completedDates.has(cursor)) {
    streak++;
    cursor = shiftDate(cursor, -1);
  }

  return streak;
};

const calculateCompletionPercentage = (history, today) => {
  if (!history.length) {
    return {
      completedDays: 0,
      totalDays: 0,
      percentage: 0,
    };
  }

  const completedDates = new Set(history.map((item) => item.quizDate));

  // First recorded questionnaire
  const firstDate = [...completedDates].sort()[0];

  const toUTC = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };

  // Count every calendar day from first submission through today
  const totalDays =
    Math.floor((toUTC(today) - toUTC(firstDate)) / 86400000) + 1;

  const completedDays = completedDates.size;

  const percentage =
    totalDays > 0 ? Number(((completedDays / totalDays) * 100).toFixed(1)) : 0;

  return {
    completedDays,
    totalDays,
    percentage,
  };
};

// =====================================================
// REUSABLE COMPONENTS
// =====================================================

const DashboardCard = ({ children, className = "", style = {} }) => (
  <div
    style={style}
    className={`
      relative min-h-0 overflow-hidden
      rounded-2xl border border-[#E8BD84]
      bg-[#FFF1DC]/90
      shadow-[0_3px_12px_rgba(111,45,20,0.09)]
      backdrop-blur-sm
      ${className}
    `}
  >
    {children}
  </div>
);

const ImageBackground = ({ image }) =>
  image ? (
    <div
      className="pointer-events-none absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url("${image}")` }}
    />
  ) : null;

const StatCard = ({
  icon: Icon,
  iconImage,
  value,
  label,
  subtitle,
  percentage,
  onClick,
}) => {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      {...(onClick ? { type: "button", onClick } : {})}
      className={`
        flex h-full min-h-0 flex-col
        items-center justify-center gap-1
        rounded-2xl border border-[#E8BD84]
        bg-[#FFF1DC]/90 px-2 py-2 text-center
        shadow-sm backdrop-blur-sm
        ${onClick ? "cursor-pointer transition hover:bg-[#FFE8C8]" : ""}
      `}
    >
      {/* Custom image icon OR Lucide icon */}
      {iconImage ? (
        <img
          src={iconImage}
          alt=""
          className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10"
        />
      ) : Icon ? (
        <Icon size={23} strokeWidth={1.8} className="shrink-0 text-[#B86A20]" />
      ) : null}

      <span className="font-sans text-lg font-bold tabular-nums text-[#471D19] sm:text-xl lg:text-2xl">
        {value}
      </span>

      <span className="text-[10px] font-semibold text-[#653C2A] sm:text-xs">
        {label}
      </span>

      {subtitle && (
        <span className="text-[10px] text-[#80533B]">{subtitle}</span>
      )}

      {percentage !== undefined && (
        <div className="mt-1 h-1.5 w-full max-w-[110px] overflow-hidden rounded-full bg-[#F0D1B0]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#87152A] to-[#E9A12D]"
            style={{
              width: `${Math.max(0, Math.min(100, percentage))}%`,
            }}
          />
        </div>
      )}
    </Component>
  );
};

const GrowthDonut = ({ percentage }) => {
  const value = Math.max(0, Math.min(100, Number(percentage) || 0));

  const radius = 49;
  const circumference = 2 * Math.PI * radius;

  const progressLength = (value / 100) * circumference;

  return (
    <div className="relative h-[105px] w-[105px] shrink-0 sm:h-[120px] sm:w-[120px] xl:h-[132px] xl:w-[132px]">
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="omkarGrowthGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#87152A" />
            <stop offset="100%" stopColor="#E9A12D" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#F5D9B7"
          strokeWidth="11"
        />

        {/* Rounded progress arc */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#omkarGrowthGradient)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${progressLength} ${circumference}`}
          style={{
            transition: "stroke-dasharray 0.6s ease",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-sans text-xl font-bold tabular-nums text-[#471D19] sm:text-2xl">
          {Math.round(value)}%
        </span>

        <span className="text-[9px] text-[#754B35]">Your Growth</span>
      </div>
    </div>
  );
};

// =====================================================
// MAIN DASHBOARD
// =====================================================

const Dashboard = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { user, loading: authLoading } = useAuth();

  const {
    data: todayData,
    isLoading: todayLoading,
    isError: todayError,
    refetch: refetchToday,
  } = useQuery({
    queryKey: ["dashboardToday", user?.uid],
    enabled: !authLoading && !!user?.uid,
    queryFn: async () => {
      const response = await axiosSecure.get("/quiz/today");
      return response.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["quizHistory", user?.uid],
    enabled: !authLoading && !!user?.uid,
    queryFn: async () => {
      const response = await axiosSecure.get("/quiz/history");
      return response.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const history = useMemo(
    () => (Array.isArray(historyData?.history) ? historyData.history : []),
    [historyData?.history],
  );

  const hasCompletedFirstQuiz = history.length > 0;

  const today = todayData?.quizDate || getDateInTimeZone(new Date());

  const completedToday = todayData?.status === "completed";

  const completedDates = useMemo(
    () => new Set(history.map((item) => item.quizDate)),
    [history],
  );

  const streak = useMemo(
    () => calculateStreak(completedDates, today),
    [completedDates, today],
  );

  const completion = useMemo(
    () => calculateCompletionPercentage(history, today),
    [history, today],
  );

  const weekDates = useMemo(() => getWeekDates(today), [today]);

  const averagePercentage = Number(historyData?.averagePercentage ?? 0);

  const totalCompleted = Number(
    historyData?.completedDays ?? completedDates.size,
  );

  const firstName = user?.displayName?.trim()?.split(/\s+/)[0] || "Friend";

  const isLoading = authLoading || historyLoading;

  const hasError = historyError;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-[#87152A]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-[#87152A]">
        <p>Unable to load your dashboard.</p>

        <button
          type="button"
          onClick={() => refetchHistory()}
          className="rounded-full bg-[#87152A] px-5 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!hasCompletedFirstQuiz) {
    return (
      <main className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden px-4 py-8">
        {/* Responsive background */}
        <picture className="pointer-events-none absolute inset-0 -z-10">
          <source media="(min-width: 1024px)" srcSet={desktopBg} />
          <img src={mobileBg} alt="" className="h-full w-full object-cover" />
        </picture>

        {/* Welcome card */}
        <div className="w-full max-w-xl rounded-[28px] border-2 border-[#DDA56E] bg-[#FFF0D7]/95 px-6 py-10 text-center shadow-[0_10px_35px_rgba(80,30,20,0.18)] backdrop-blur-md sm:px-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#DDA56E] bg-gradient-to-br from-[#FFE8B5] to-[#F4C778]">
            <BookOpen size={30} className="text-[#87152A]" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-[#87152A] sm:text-3xl">
            Welcome to Omkar Quest
          </h1>

          <p className="mt-4 font-serif text-lg font-semibold leading-relaxed text-[#642C24] sm:text-xl">
            Attempt your first questionnaire to unlock your dashboard.
          </p>

          <p className="mx-auto mt-3 max-w-md font-serif text-sm leading-relaxed text-[#80533B] sm:text-base">
            Begin your spiritual journey by completing your first daily
            questionnaire. Your progress, streaks, and achievements will appear
            here once you finish.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/DailyQuestionnaire")}
            className="mt-7 cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#87152A] to-[#A83D35] px-7 py-3 font-serif text-sm font-bold text-[#FFF0D7] shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:text-base"
          >
            Start Your First Questionnaire
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    );
  }

  if (todayLoading) {
    return (
      <div className="flex h-full items-center justify-center text-[#87152A]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (todayError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-[#87152A]">
        <p>Unable to load your dashboard.</p>

        <button
          type="button"
          onClick={() => {
            refetchToday();
            refetchHistory();
          }}
          className="rounded-full bg-[#87152A] px-5 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="relative isolate flex h-full min-h-0 w-full flex-col overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {/* ======================================= */}
      {/* RESPONSIVE DASHBOARD BACKGROUND */}
      {/* ======================================= */}
      <picture className="pointer-events-none absolute inset-0 -z-10">
        <source media="(min-width: 1024px)" srcSet={desktopBg} />

        <img src={mobileBg} alt="" className="h-full w-full object-fill" />
      </picture>

      {/* ======================================= */}
      {/* MAIN SCREEN-HEIGHT GRID */}
      {/* ======================================= */}
      <div
        className="
          mx-auto grid h-auto min-h-full w-full max-w-[1600px] lg:h-full lg:min-h-0
          grid-rows-[auto_auto_auto_auto]
          gap-2 px-3 py-2
          sm:px-4
          lg:grid-rows-[minmax(0,0.85fr)_minmax(0,0.75fr)_minmax(0,1.1fr)_minmax(0,1fr)]
          lg:gap-2 lg:px-5 lg:py-3
        "
      >
        {/* ======================================= */}
        {/* HERO */}
        {/* ======================================= */}
        {/* ======================================= */}
        {/* HERO - WELCOME SECTION */}
        {/* ======================================= */}
        <section className="flex items-center py-1 lg:min-h-0 lg:py-2">
          <div
            className="
      w-fit max-w-full
      rounded-2xl
      border border-[#DDA56E]/60
      bg-[#FFF0D7]/80
      px-4 py-3
      shadow-[0_4px_20px_rgba(80,30,20,0.12)]
      backdrop-blur-md
      sm:px-5
      lg:px-6 lg:py-3
    "
          >
            <h1 className="flex gap-2 font-serif text-2xl font-bold text-[#471D19] sm:text-3xl lg:text-4xl">
              Welcome, {firstName}
              {/* <span className="ml-2 text-xl">🙏</span> */}
              {/* <img src={namaste} className="w-8 h-8" alt="" /> */}
            </h1>

            <p className="mt-1 max-w-md font-serif text-xs text-[#542B20] sm:text-sm">
              Continue your spiritual journey with daily reflection, learning
              and mindful practice.
            </p>

            <div className="mt-2 h-px w-36 bg-gradient-to-r from-transparent via-[#A66C31] to-transparent" />
          </div>
        </section>
        {/* ======================================= */}
        {/* STATISTICS */}
        {/* ======================================= */}
        <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-h-0 lg:grid-cols-5">
          {/* TODAY'S QUESTIONNAIRE */}
          <div className="col-span-2 min-h-0 sm:col-span-4 lg:col-span-1">
            {completedToday ? (
              <div className="flex h-full min-h-0 flex-col justify-between rounded-2xl border border-[#DDA56E] bg-gradient-to-br from-[#57192A] to-[#8B2937] p-3 text-[#FFF0D7] shadow-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={21} className="text-[#F8C76A]" />

                  <span className="font-serif text-sm font-bold sm:text-base">
                    Today's Task
                  </span>
                </div>

                <p className="my-1 text-[11px]">
                  Today's questionnaire completed!
                </p>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-sans text-base font-bold tabular-nums text-[#F8D68B]">
                    {todayData.score}/{todayData.maxScore}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/my-progress")}
                    className="flex items-center gap-1 rounded-full bg-[#F8D68B] px-3 py-1.5 text-[10px] font-semibold text-[#57192A]"
                  >
                    View Progress
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-0 flex-col justify-between rounded-2xl border border-[#DDA56E] bg-gradient-to-br from-[#57192A] to-[#8B2937] p-3 text-[#FFF0D7] shadow-md">
                <div className="flex items-center gap-2">
                  <CalendarDays size={21} className="text-[#F8C76A]" />

                  <span className="font-serif text-sm font-bold sm:text-base">
                    Today's Task
                  </span>
                </div>

                <p className="my-1 text-[11px]">Daily Questionnaire</p>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/DailyQuestionnaire")}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F5C66A] to-[#F9E1A1] px-3 py-1.5 text-[11px] font-bold text-[#57192A]"
                >
                  Start Now
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          <StatCard
            iconImage={streaks}
            value={`${streak} Days`}
            label="Current Streak"
          />

          <StatCard
            iconImage={comp}
            value={totalCompleted}
            label="Quizzes Completed"
            onClick={() => navigate("/dashboard/my-progress")}
          />

          <StatCard
            iconImage={average}
            value={`${Math.round(averagePercentage)}%`}
            label="Average Score"
            onClick={() => navigate("/dashboard/my-progress")}
          />

          {/* NEW: TEACHING EXPLORED / ATTENDANCE */}
          <StatCard
            icon={CalendarCheck2}
            value={`${completion.percentage}%`}
            label="Completion Percentage"
            subtitle={`${completion.completedDays} of ${completion.totalDays} days completed`}
            percentage={completion.percentage}
          />
        </section>

        {/* ======================================= */}
        {/* MIDDLE ROW */}
        {/* ======================================= */}
        <section className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:min-h-0">
          {/* TODAY'S WISDOM */}
          <DashboardCard className="min-h-[155px] md:min-h-0">
            <ImageBackground image={DASHBOARD_IMAGES.wisdom} />

            <div className="relative flex h-full flex-col items-center justify-center px-4 py-3 text-center">
              <h2 className="mb-2 flex items-center gap-2 font-serif text-base font-bold text-[#87152A] sm:text-lg">
                Today's Wisdom
              </h2>

              <p className="max-w-md font-serif text-base leading-relaxed text-[#642C24] sm:text-lg">
                “Do your duty with sincerity, without attachment to the
                results.”
              </p>

              <p className="mt-2 font-serif text-xs text-[#87152A]">
                — Bhagavad Gita (2.47)
              </p>
            </div>
          </DashboardCard>

          {/* MY SPIRITUAL PROGRESS */}
          <DashboardCard className="min-h-[165px] md:min-h-0">
            <div className="flex h-full flex-col p-3">
              <h2 className="mb-2 flex items-center gap-2 font-serif text-base font-bold text-[#87152A] sm:text-lg">
                <Sparkles size={18} />
                My Spiritual Progress
              </h2>

              <div className="flex min-h-0 flex-1 items-center justify-around gap-3">
                <GrowthDonut percentage={averagePercentage} />

                <div className="flex flex-1 flex-col gap-2">
                  <div>
                    <div className="mb-1 flex justify-between gap-2 text-[10px] text-[#673A2A] sm:text-xs">
                      <span>Average Performance</span>

                      <span className="font-sans font-semibold tabular-nums">
                        {Math.round(averagePercentage)}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#F2CBA6]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#87152A] to-[#E9A12D]"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, averagePercentage),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-[#80533B]">
                    Your average score across all completed questionnaires.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/my-progress")}
                    className="flex items-center gap-1 self-start text-[11px] font-semibold text-[#87152A]"
                  >
                    Explore Progress
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </DashboardCard>
        </section>

        {/* ======================================= */}
        {/* BOTTOM ROW */}
        {/* ======================================= */}
        <section className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:min-h-0">
          {/* CONTINUE LEARNING - HIDDEN ON PHONES */}
          <DashboardCard className="hidden min-h-0 flex-col p-3 sm:flex">
            <h2 className="mb-2 flex items-center gap-2 font-serif text-base font-bold text-[#87152A] sm:text-lg">
              <BookOpen size={17} />
              Continue Learning
            </h2>

            <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
              {[
                {
                  title: "Bhagavad Gita",
                  subtitle: "Essential Teachings",
                  image: DASHBOARD_IMAGES.learning1,
                },
                {
                  title: "Upanishads",
                  subtitle: "Core Ideas",
                  image: DASHBOARD_IMAGES.learning2,
                },
                {
                  title: "Meditation",
                  subtitle: "Inner Peace",
                  image: DASHBOARD_IMAGES.learning3,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="relative flex min-h-0 flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br from-[#E8AC65] to-[#723B2A] p-2"
                >
                  <ImageBackground image={item.image} />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                  <div className="relative text-white">
                    <p className="font-serif text-[11px] font-bold">
                      {item.title}
                    </p>

                    <p className="text-[9px]">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* WEEKLY ACTIVITY */}
          <DashboardCard className="min-h-[175px] md:min-h-0">
            <ImageBackground image={DASHBOARD_IMAGES.challenge} />

            <div className="relative flex h-full min-h-0 flex-col justify-between p-3">
              <div>
                <h2 className="flex items-center gap-2 font-serif text-base font-bold text-[#471D19] sm:text-lg">
                  <Target size={18} className="text-[#B86A20]" />
                  This Week's Activity
                </h2>

                <p className="mt-1 text-[11px] text-[#673A2A]">
                  Build consistency through your daily spiritual questionnaire.
                </p>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((day) => {
                  const completed = completedDates.has(day.date);
                  const isToday = day.date === today;
                  const isFuture = day.date > today;

                  return (
                    <div
                      key={day.date}
                      className="flex flex-col items-center gap-1"
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                          completed
                            ? "border-[#B86A20] bg-[#E8A32C] text-[#471D19]"
                            : isToday
                              ? "border-[#87152A] bg-[#FFF0D7] text-[#87152A]"
                              : isFuture
                                ? "border-[#E8C9A8] bg-[#FFE8CC]/60 text-[#C4A38C]"
                                : "border-[#DDA56E] bg-[#FFE8CC] text-[#B17A48]"
                        }`}
                        title={day.date}
                      >
                        {completed ? (
                          <Check size={15} strokeWidth={3} />
                        ) : isToday ? (
                          <span className="h-2 w-2 rounded-full bg-[#87152A]" />
                        ) : null}
                      </span>

                      <span className="text-[9px] font-medium text-[#673A2A]">
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard/my-progress")}
                className="flex items-center gap-1 self-end text-[11px] font-semibold text-[#87152A]"
              >
                View My Journey
                <ArrowRight size={13} />
              </button>
            </div>
          </DashboardCard>
        </section>
      </div>
    </main>
  );
};
export default Dashboard;
