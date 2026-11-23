import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Target,
  BookOpen,
  AlertCircle,
  BookHeart,
  CalendarCheck2,
  Sparkles,
} from "lucide-react";
import questionCardBg from "../../../assets/DashboardImages/quizBackLaptop.png";
import quoteBg from "../../../assets/DashboardImages/quoteBack.png";
import mobileQuizBg from "../../../assets/DashboardImages/quizBack_1000x1300.png";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router";

const getYesterdayDate = (today) => {
  const date = new Date(`${today}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
};

const getDateInTimeZone = (timeZone) => {
  if (!timeZone) return null;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const getLocalDate = (timestamp, timeZone) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

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

const isValidAnswer = (question, value) => {
  if (question.type === "yes_no") {
    return value === "yes" || value === "no";
  }

  if (question.type === "numeric") {
    return (
      Number.isInteger(value) &&
      value >= question.minValue &&
      value <= question.maxValue
    );
  }

  return false;
};

const loadDraft = (storageKey, questions) => {
  const empty = { answers: {}, currentIndex: 0 };

  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return empty;

    const parsed = JSON.parse(saved);
    const answers = {};

    questions.forEach((question) => {
      const value = parsed?.answers?.[question.questionKey];

      if (isValidAnswer(question, value)) {
        answers[question.questionKey] = value;
      }
    });

    const index = parsed?.currentIndex;

    return {
      answers,
      currentIndex: Number.isInteger(index)
        ? Math.max(0, Math.min(index, questions.length - 1))
        : 0,
    };
  } catch (error) {
    console.error("Draft restoration failed:", error);
    return empty;
  }
};

const ProgressBar = ({ value, color = "gold" }) => (
  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EEC99F]">
    <div
      className={`h-full rounded-full transition-all duration-300 ${
        color === "burgundy"
          ? "bg-gradient-to-r from-[#63081D] to-[#A31830]"
          : "bg-gradient-to-r from-[#CB6500] to-[#F3A51B]"
      }`}
      style={{ width: `${value}%` }}
    />
  </div>
);

// const CompletionCard = ({ answered, total, percentage }) => (
//   <section className="rounded-[22px] border-24 border-[#E7A654] bg-gradient-to-br from-[#FFF6E5] via-[#FFE5BD] to-[#F8CB91] p-4 text-[#4D1915] shadow-[0_5px_15px_#7b330f33] sm:p-5">
//     {/* <div className="flex items-start gap-3"> */}
//       {/* <Target className="mt-1 shrink-0 text-[#A7470B]" size={30} /> */}

//       {/* <div className="min-w-0 flex-1">
//         <h3 className="font-serif text-xl font-bold text-[#8D1428]">
//           Your Progress
//         </h3>

//         <p className="mt-1 font-serif text-lg">
//           {answered} / {total} Completed
//         </p>

//         <div className="mt-3 flex items-center gap-3">
//           <div className="flex-1">
//             <ProgressBar value={percentage} />
//           </div>

//           <span className="font-serif text-lg font-bold">{percentage}%</span>
//         </div>
//       </div> */}
//     {/* </div> */}
//    </section>
// );

const QuoteCard = () => (
  <section
    className="relative hidden min-h-96 flex-1 overflow-hidden rounded-[22px]  bg-contain bg-center bg-no-repeat shadow-[0_5px_15px_#7b330f33] lg:flex lg:flex-col lg:items-center"
    style={{
      backgroundImage: `url(${quoteBg})`,
    }}
  >
    {/* Quote content */}
    <div className="relative z-10 flex w-full flex-col items-center px-5 pt-6 text-center xl:pt-8">
      <blockquote className="font-serif text-lg leading-relaxed italic text-[#55201A] xl:text-xl">
        “You have the right to work, but not to the fruits of work.”
      </blockquote>

      <p className="mt-3 font-serif text-sm text-[#6C3522]">
        — Bhagavad Gita 2.47 (paraphrase)
      </p>
    </div>
  </section>
);

const QuestionnaireSession = ({ quiz, uid }) => {
  const questions = quiz.questions;
  const total = questions.length;

  const storageKey = `omkar-draft:${uid}:${quiz.quizType}:${quiz.quizDate}`;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const submitMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosSecure.post("/quiz/submit", payload);
      return response.data;
    },

    onSuccess: () => {
      localStorage.removeItem(storageKey);

      // Refresh questionnaire data
      queryClient.invalidateQueries({
        queryKey: ["dailyQuiz", uid],
      });

      // Refresh dashboard history
      queryClient.invalidateQueries({
        queryKey: ["quizHistory", uid],
      });

      // Refresh today's dashboard status
      queryClient.invalidateQueries({
        queryKey: ["dashboardToday", uid],
      });

      navigate("/dashboard/my-progress");
    },
  });

  const [draft, setDraft] = useState(() => loadDraft(storageKey, questions));

  //   const [reviewMode, setReviewMode] = useState(false);

  const { answers, currentIndex } = draft;

  const question = questions[currentIndex];

  const answeredCount = questions.filter((item) =>
    isValidAnswer(item, answers[item.questionKey]),
  ).length;

  const percentage = Math.round((answeredCount / total) * 100);
  const positionPercentage = ((currentIndex + 1) / total) * 100;

  const currentAnswer = answers[question.questionKey];

  const currentAnswered = isValidAnswer(question, currentAnswer);

  const allAnswered = answeredCount === total;

  // Save draft whenever answers or question position changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch (error) {
      console.error("Draft saving failed:", error);
    }
  }, [draft, storageKey]);

  const selectAnswer = (value) => {
    setDraft((previous) => ({
      ...previous,
      answers: {
        ...previous.answers,
        [question.questionKey]: value,
      },
    }));
  };

  const goToQuestion = (index) => {
    setDraft((previous) => ({
      ...previous,
      currentIndex: index,
    }));
  };

  //   const goNext = () => {
  //     if (!currentAnswered) return;

  //     // if (currentIndex === total - 1) {
  //     //   setReviewMode(true);
  //     // } else {
  //         if()
  //       goToQuestion(currentIndex + 1);
  //     }
  //   };
  const goNext = () => {
    if (!currentAnswered) return;

    if (currentIndex < total - 1) {
      goToQuestion(currentIndex + 1);
    }
  };
  const handleSubmit = () => {
    if (submitMutation.isPending) return;

    const answers = quiz.questions.map((question) => ({
      questionKey: question.questionKey,
      value: draft.answers[question.questionKey],
    }));

    if (!answers.every((answer) => answer.value !== undefined)) {
      return;
    }

    submitMutation.mutate({
      quizDate: quiz.quizDate,
      answers,
    });
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  const optionClass = (selected) =>
    `flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left font-serif text-base text-[#35170F] transition-all duration-200 sm:px-5 sm:text-lg ${
      selected
        ? "border-[#D87809] bg-gradient-to-r from-[#FFE2A3] to-[#FFD184] shadow-[0_2px_8px_#c56d2430]"
        : "border-[#DDA56E] bg-[#FFF1DB]/75 hover:border-[#C97A22] hover:bg-[#FFE9C5]"
    }`;

  const panelClass =
    "relative flex min-h-0 flex-col overflow-hidden rounded-[26px] bg-center bg-no-repeat bg-[length:100%_100%] px-7 py-8 text-[#4D1915] shadow-[0_8px_24px_#69270b35] object-fit sm:px-10 lg:flex-1 lg:px-10 lg:py-5 xl:px-14";
  return (
    <div className="mx-auto w-full max-w-7xl pb-8">
      {/* Page heading */}
      <header className=" mb-5 px-3 text-center text-[#791326] drop-shadow-[0_1px_2px_#fff2d5]">
        <h1 className="font-serif  text-2xl font-bold sm:text-4xl lg:text-5xl">
          Spiritual Questionnaire
        </h1>

        <p className="mt-2 font-serif text-base text-[#4B2118] sm:text-lg">
          Reflect <span className="mx-2">◆</span>
          Learn <span className="mx-2">◆</span>
          Practice <span className="mx-2">◆</span>
          Grow
        </p>

        {/* <div className="mt-2 text-xl text-[#B66A1B]">❀ ─── ❀</div> */}
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_310px] lg:translate-y-27 ">
        <main className="min-w-0 relative z-0">
          {/* Top question progress — no timer */}
          <div className="absolute z-10 mb-3 w-full  rounded-[20px] border-2 lg:-translate-y-3 -translate-y-12 border-[#E7A654] bg-[#FFF0D7]/95 px-4 py-2 shadow-md sm:px-6">
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
              <span className="whitespace-nowrap font-serif text-sm font-semibold text-[#522016] sm:text-base">
                Question {currentIndex + 1} of {total}
              </span>

              <div className="sm:min-w-24 w-full flex-1">
                <ProgressBar value={positionPercentage} color="burgundy" />
              </div>

              <span className="whitespace-nowrap font-serif text-sm font-bold text-[#8D1428]">
                {percentage}% Completed
              </span>
            </div>
          </div>

          {/* Question panel */}
          <section
            className={`${panelClass} relative`}
            style={{
              backgroundImage: `url(${questionCardBg})`,
            }}
          >
            {/* Mobile background */}
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-[length:100%_100%] lg:hidden"
              style={{ backgroundImage: `url(${mobileQuizBg})` }}
            />

            {/* Desktop background */}
            <div
              className="absolute inset-0 hidden bg-center bg-no-repeat bg-[length:100%_100%] lg:block"
              style={{ backgroundImage: `url(${questionCardBg})` }}
            />

            {/* Question content */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              {/* Keep all your existing question content here */}
              <div className="relative z-10">
                {
                  <>
                    {/* Om symbol */}
                    <div className="mb-24 text-center">
                      {/* <span className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-[#E6AD66] bg-[#FFE7BD]/70 font-serif text-6xl text-[#CE7B14] shadow-inner">
                      ॐ
                    </span> */}
                    </div>

                    {/* Question */}
                    <h2 className="mx-auto tiro-bangla mb-7 max-w-2xl text-center font-serif text-xl leading-snug font-bold text-[#87152A] sm:text-2xl">
                      {question.text}
                    </h2>

                    {/* Yes/No */}
                    {question.type === "yes_no" && (
                      <div className="mx-auto flex max-w-2xl flex-col gap-3">
                        {["yes", "no"].map((value) => {
                          const selected = currentAnswer === value;

                          return (
                            <button
                              key={value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => selectAnswer(value)}
                              className={optionClass(selected)}
                            >
                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#D28A2D] ${
                                  selected ? "bg-[#FFF5E4]" : ""
                                }`}
                              >
                                {selected && (
                                  <span className="h-3 w-3 rounded-full bg-[#790F25]" />
                                )}
                              </span>

                              <span className="   ">
                                {value === "yes" ? "হ্যাঁ" : "না"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Numeric */}
                    {question.type === "numeric" && (
                      <div className="mx-auto max-w-xl">
                        <p className="mb-4 text-center font-serif text-[#7C4A30]">
                          Select a number
                        </p>

                        <div className="grid grid-cols-5 gap-2 sm:gap-3">
                          {Array.from(
                            {
                              length: question.maxValue - question.minValue + 1,
                            },
                            (_, index) => question.minValue + index,
                          ).map((value) => {
                            const selected = currentAnswer === value;

                            return (
                              <button
                                key={value}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => selectAnswer(value)}
                                className={`rounded-xl border-2 py-4 font-serif text-xl font-bold transition ${
                                  selected
                                    ? "border-[#C77B24] bg-[#FFD58D] text-[#7E1427]"
                                    : "border-[#DDA56E] bg-[#FFF1DB] text-[#4D1915] hover:bg-[#FFE4B6]"
                                }`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="mt-10 -mx-5 sm:mx-0 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        disabled={currentIndex === 0}
                        onClick={goPrevious}
                        className="flex items-center gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#FFF0D7] to-[#FBC784] px-4 py-3 font-serif font-semibold text-[#56221A] shadow-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 sm:px-7"
                      >
                        <ArrowLeft size={20} />
                        Previous
                      </button>

                      <button
                        type="button"
                        disabled={
                          !currentAnswered ||
                          submitMutation.isPending ||
                          (currentIndex === total - 1 &&
                            answeredCount !== total)
                        }
                        onClick={
                          currentIndex === total - 1 ? handleSubmit : goNext
                        }
                        className="flex items-center gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#A30E2A] to-[#590719] px-6 py-3 font-serif font-semibold text-[#FFE8A8] shadow-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 sm:px-9"
                      >
                        {submitMutation.isPending
                          ? "Submitting..."
                          : currentIndex === total - 1
                            ? "Submit"
                            : "Next"}

                        {currentIndex === total - 1 ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <ArrowRight size={20} />
                        )}
                      </button>
                    </div>
                    {submitMutation.isError && (
                      <p
                        role="alert"
                        className="mt-3 text-center text-sm text-red-700"
                      >
                        {submitMutation.error?.response?.data?.message ||
                          "Something went wrong. Please try again."}
                      </p>
                    )}
                  </>
                }
              </div>
            </div>
            {/* <div className="pointer-events-none absolute inset-2 rounded-[20px] border border-[#E8AA62]" /> */}
          </section>
        </main>

        {/* Desktop sidebar */}
        {/* <aside className="hidden  flex-col gap-4 lg:flex"> */}
        {/* <CompletionCard
            answered={answeredCount}
            total={total}
            percentage={percentage}
          /> */}
        {/* <QuoteCard />
        </aside> */}

        <aside className="hidden h-full min-h-0 flex-col lg:flex">
          <div className="mt-auto w-full">
            <QuoteCard />
          </div>
        </aside>

        {/* Mobile completion card */}
        {/* <div className="lg:hidden">
          <CompletionCard
            answered={answeredCount}
            total={total}
            percentage={percentage}
          />
        </div> */}
      </div>
    </div>
  );
};

const QuestionnaireSelection = ({
  today,
  yesterday,
  todayQuiz,
  yesterdayQuiz,
  profile,
  onSelect,
}) => {
  const accountCreatedDate =
    profile?.registeredAt && profile?.timeZone
      ? getLocalDate(profile.registeredAt, profile.timeZone)
      : null;

  const accountExistedYesterday =
    accountCreatedDate !== null && accountCreatedDate <= yesterday;
  const options = [
    {
      key: "today",
      title: "Today's Questionnaire",
      date: today,
      quiz: todayQuiz,
    },
  ];

  const yesterdayAvailable =
    accountExistedYesterday &&
    yesterdayQuiz?.status === "available" &&
    Array.isArray(yesterdayQuiz?.questions) &&
    yesterdayQuiz.questions.length > 0;

  if (yesterdayAvailable) {
    options.push({
      key: "yesterday",
      title: "Yesterday's Catch-Up",
      date: yesterday,
      quiz: yesterdayQuiz,
    });
  }

  return (
    <div className="flex min-h-[75dvh] w-full items-center justify-center px-2 py-5 sm:px-4 sm:py-8 lg:min-h-[85dvh]">
      <section className="w-full max-w-2xl rounded-2xl border-2 border-[#DDA56E] bg-[#FFF0D7]/95 px-4 py-6 text-center shadow-xl sm:rounded-[28px] sm:px-8 sm:py-9">
        {/* Heading */}
        <h1 className="font-serif text-[clamp(1.45rem,5vw,2.25rem)] font-bold leading-tight text-[#87152A]">
          Daily Spiritual Questionnaire
        </h1>

        <p className="mt-2 font-serif text-sm text-[#6C3522] sm:mt-3 sm:text-base">
          Choose your questionnaire
        </p>

        {/* Questionnaire options */}
        <div
          className={`mt-5 grid gap-3 sm:mt-7 sm:gap-4 ${
            options.length === 1
              ? "mx-auto max-w-xs grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {options.map((option) => {
            const completed = option.quiz?.status === "completed";

            const available =
              !completed &&
              Array.isArray(option.quiz?.questions) &&
              option.quiz.questions.length > 0;

            return (
              <button
                key={option.key}
                type="button"
                disabled={!available}
                onClick={() => onSelect(option.key)}
                className={`flex min-h-36 w-full flex-col items-center justify-center rounded-xl border-2 px-3 py-4 font-serif transition-all duration-300 sm:min-h-44 sm:rounded-2xl sm:px-4 sm:py-6 ${
                  completed
                    ? "cursor-not-allowed border-green-700/40 bg-[#F4E8CE] text-[#56221A]"
                    : available
                      ? "cursor-pointer border-[#C77B24] bg-gradient-to-br from-[#FFE5BD] to-[#F5C47E] text-[#87152A] shadow-md hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                      : "cursor-not-allowed border-[#DDA56E] bg-[#F4E8CE] text-[#7C4A30] opacity-70"
                }`}
              >
                {/* Icon */}
                {completed ? (
                  <CheckCircle2
                    size={28}
                    className="mb-2 text-green-700 sm:mb-3 sm:h-9 sm:w-9"
                  />
                ) : (
                  <BookOpen
                    size={28}
                    className="mb-2 text-[#A7470B] sm:mb-3 sm:h-9 sm:w-9"
                  />
                )}

                {/* Title */}
                <span className="text-base font-bold leading-snug sm:text-xl">
                  {option.title}
                </span>

                {/* Date */}
                <span className="mt-1 text-xs sm:mt-2 sm:text-sm">
                  {option.date}
                </span>

                {/* Status */}
                <span
                  className={`mt-3 rounded-full px-3 py-1.5 text-xs font-semibold sm:mt-4 sm:px-4 sm:text-sm ${
                    completed
                      ? "bg-green-100 text-green-800"
                      : available
                        ? "bg-[#87152A] text-[#FFE8A8]"
                        : "bg-[#E8D5B8] text-[#7C4A30]"
                  }`}
                >
                  {completed
                    ? "Already Completed"
                    : available
                      ? "Start Questionnaire"
                      : "Unavailable"}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const QuizContent = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  // null = selection screen
  // today/yesterday = questionnaire screen
  const [selectedDate, setSelectedDate] = useState(null);
  const [clock, setClock] = useState(() => Date.now());

  // Detect changes in the calendar date
  useEffect(() => {
    const refreshClock = () => setClock(Date.now());

    const interval = setInterval(refreshClock, 30000);

    window.addEventListener("focus", refreshClock);
    document.addEventListener("visibilitychange", refreshClock);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refreshClock);
      document.removeEventListener("visibilitychange", refreshClock);
    };
  }, []);

  const {
    data: profile,
    isPending: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["quizProfile", user?.uid],

    queryFn: async () => {
      const response = await axiosSecure.get("/users/me");
      return response.data;
    },

    enabled: !authLoading && !!user?.uid,
    retry: false,
  });

  // Calculate today using the user's timezone
  let today = null;
  let yesterday = null;
  let dateError = null;

  try {
    if (profile?.timeZone) {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: profile.timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(new Date(clock));

      const values = Object.fromEntries(
        parts.map(({ type, value }) => [type, value]),
      );

      today = `${values.year}-${values.month}-${values.day}`;

      yesterday = getYesterdayDate(today);
    }
  } catch (error) {
    dateError = error;
  }

  // Query for today's questionnaire
  const {
    data: todayQuiz,
    isPending: todayLoading,
    error: todayError,
    refetch: refetchToday,
  } = useQuery({
    queryKey: ["dailyQuiz", user?.uid, today],

    queryFn: async () => {
      const response = await axiosSecure.get("/quiz/today", {
        params: { quizDate: today },
      });

      return response.data;
    },

    enabled: !authLoading && !!user?.uid && !!today,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: false,
  });

  const accountRegisteredDate =
    profile?.registeredAt && profile?.timeZone
      ? getLocalDate(profile.registeredAt, profile.timeZone)
      : null;

  const accountExistedYesterday =
    accountRegisteredDate !== null &&
    yesterday !== null &&
    accountRegisteredDate <= yesterday;

  // Query for yesterday's questionnaire
  const {
    data: yesterdayQuiz,
    isPending: yesterdayLoading,
    error: yesterdayError,
    refetch: refetchYesterday,
  } = useQuery({
    queryKey: ["dailyQuiz", user?.uid, yesterday],

    queryFn: async () => {
      const response = await axiosSecure.get("/quiz/today", {
        params: { quizDate: yesterday },
      });

      return response.data;
    },

    enabled:
      !authLoading && !!user?.uid && !!yesterday && accountExistedYesterday,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: false,
  });

  const loading =
    authLoading ||
    profileLoading ||
    todayLoading ||
    (accountExistedYesterday && yesterdayLoading);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="font-serif text-xl text-[#87152A]">
          Loading questionnaires...
        </p>
      </div>
    );
  }

  if (
    profileError ||
    !profile?.timeZone ||
    !profile?.registeredAt ||
    !accountRegisteredDate ||
    dateError
  ) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4">
        <div className="rounded-2xl bg-[#FFF0D7] p-8 text-center text-[#87152A]">
          <AlertCircle className="mx-auto mb-3" size={36} />
          <p>
            {profileError?.response?.data?.message ||
              dateError?.message ||
              "Unable to load your profile registration date or timezone."}
          </p>
        </div>
      </div>
    );
  }

  if (todayError || (accountExistedYesterday && yesterdayError)) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4">
        <div className="rounded-2xl bg-[#FFF0D7] p-8 text-center text-[#87152A]">
          <AlertCircle className="mx-auto mb-3" size={36} />

          <p>
            {todayError?.response?.data?.message ||
              yesterdayError?.response?.data?.message ||
              "Failed to load questionnaires."}
          </p>

          <button
            type="button"
            onClick={() => {
              refetchToday();
              if (accountExistedYesterday) refetchYesterday();
            }}
            className="mt-5 rounded-full bg-[#87152A] px-6 py-3 text-[#FFE8A8]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const yesterdayAvailable =
    accountExistedYesterday &&
    yesterdayQuiz?.status === "available" &&
    Array.isArray(yesterdayQuiz?.questions) &&
    yesterdayQuiz.questions.length > 0;

  const showSelection = yesterdayAvailable;

  // SCREEN 1: Selection
  if (selectedDate === null && showSelection) {
    return (
      <QuestionnaireSelection
        today={today}
        yesterday={yesterday}
        todayQuiz={todayQuiz}
        yesterdayQuiz={yesterdayQuiz}
        profile={profile}
        onSelect={setSelectedDate}
      />
    );
  }

  // Determine the selected questionnaire
  const useYesterday = showSelection && selectedDate === "yesterday";
  const quiz = useYesterday ? yesterdayQuiz : todayQuiz;
  const expectedDate = useYesterday ? yesterday : today;

  // Prevent rendering a stale or completed session
  if (
    quiz?.quizDate !== expectedDate ||
    quiz?.status === "completed" ||
    !Array.isArray(quiz?.questions) ||
    quiz.questions.length === 0
  ) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <div className="flex w-full justify-center px-3 py-6 sm:px-5">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#D9A35D] bg-gradient-to-br from-[#FFF8EB] via-[#FFE8C4] to-[#F7D49D] px-5 py-6 text-center shadow-[0_8px_28px_#69270b25] sm:px-8 sm:py-8">
            <Sparkles
              size={18}
              className="absolute right-4 top-4 text-[#C58A38]"
            />

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#E1B36D] bg-[#FFF4DC] shadow-sm">
              <CheckCircle2
                size={32}
                strokeWidth={1.7}
                className="text-[#87152A]"
              />
            </div>

            <h2 className="font-serif text-xl font-bold text-[#87152A] sm:text-2xl">
              Today's Questionnaire Complete
            </h2>

            <p className="mx-auto mt-3 max-w-xs font-serif text-sm leading-relaxed text-[#70412D] sm:text-base">
              You have already completed today's spiritual questionnaire.
            </p>

            <div className="mx-auto my-4 h-px w-24 bg-gradient-to-r from-transparent via-[#B97930] to-transparent" />

            <p className="font-serif text-xs italic text-[#96602F] sm:text-sm">
              Come back tomorrow for a new reflection.
            </p>
          </div>
        </div>

        {showSelection && (
          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            className="rounded-full bg-[#87152A] px-6 py-3 text-[#FFE8A8]"
          >
            Back to Selection
          </button>
        )}
      </div>
    );
  }

  const sessionKey = `${user.uid}:${quiz.quizType}:${quiz.quizDate}`;

  // SCREEN 2: Original questionnaire
  return (
    <div className="flex   w-full flex-col ">
      

      <div className="min-h-0 flex-1  overscroll-contain">
        <QuestionnaireSession key={sessionKey} uid={user.uid} quiz={quiz} />
      </div>
    </div>
  );
};

export default QuizContent;
