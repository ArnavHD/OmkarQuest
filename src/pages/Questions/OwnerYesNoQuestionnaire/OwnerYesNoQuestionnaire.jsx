import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sun,
  MoonStar,
  CalendarDays,
  LockKeyhole,
  ClipboardCheck,
} from "lucide-react";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

import desktopBg from "../../../assets/DashboardImages/laptopDashBg.png";
import mobileBg from "../../../assets/DashboardImages/dashBoardPhoneBg.png";
import questionCardBg from "../../../assets/DashboardImages/quizBackLaptop.png";
import mobileQuizBg from "../../../assets/DashboardImages/quizBack_1000x1300.png";
import quoteBg from "../../../assets/DashboardImages/quoteBack.png";

const getPreviousQuizDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day - 1))
    .toISOString()
    .slice(0, 10);
};

const TOTAL_QUESTIONS = 5;
const DRAFT_PREFIX = "omkar-owner-reflection";

const getDraftKey = (uid, quizDate) => `${DRAFT_PREFIX}:${uid}:${quizDate}`;

const readDraft = (uid, quizDate, questions) => {
  try {
    const saved = localStorage.getItem(getDraftKey(uid, quizDate));

    if (!saved) return { answers: {}, currentIndex: 0 };

    const parsed = JSON.parse(saved);
    const answers = {};

    for (const question of questions) {
      const value = parsed?.answers?.[question.questionKey];

      if (value === "yes" || value === "no") {
        answers[question.questionKey] = value;
      }
    }

    const index = parsed?.currentIndex;

    return {
      answers,
      currentIndex:
        Number.isInteger(index) && index >= 0 && index < questions.length
          ? index
          : 0,
    };
  } catch {
    return { answers: {}, currentIndex: 0 };
  }
};

const ProgressBar = ({ percentage }) => (
  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EEC99F]">
    <div
      className="h-full rounded-full bg-gradient-to-r from-[#63081D] to-[#A31830] transition-all duration-300"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

const QuoteCard = () => (
  <section
    className="relative hidden min-h-96 flex-1 overflow-hidden rounded-[22px] bg-contain bg-center bg-no-repeat shadow-[0_5px_15px_#7b330f33] lg:flex lg:flex-col lg:items-center"
    style={{ backgroundImage: `url(${quoteBg})` }}
  >
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

const ReflectionCompletion = ({ navigate, score }) => (
  <div className="mx-auto flex min-h-[65vh] w-full max-w-xl flex-col items-center justify-center px-3">
    <div className="w-full rounded-3xl border-2 border-[#DDA56E] bg-[#FFF0D7]/95 px-6 py-10 text-center text-[#87152A] shadow-xl backdrop-blur-sm">
      <CheckCircle2 className="mx-auto mb-4 text-green-700" size={56} />

      <h2 className="font-serif text-3xl font-bold">
        Daily Reflection Completed!
      </h2>

      <p className="mt-4 font-serif text-lg text-[#56221A]">
        You have completed all five reflection questions.
      </p>

      <p className="mt-5 font-serif text-4xl font-bold text-[#87152A]">
        {score} / 5
      </p>

      <p className="mt-2 font-serif text-sm text-[#7C4A30]">
        Your score has been saved for today.
      </p>

      <button
        type="button"
        onClick={() => navigate("/dashboard/")}
        className="mt-7 rounded-full bg-gradient-to-b from-[#A30E2A] to-[#590719] px-8 py-3 font-serif font-semibold text-[#FFE8A8] shadow-md"
      >
        Return to Dashboard
      </button>
    </div>
  </div>
);

const OwnerReflectionSession = ({ initialData, uid, onBack, onCompleted }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const questions = initialData.questions;
  const storageKey = getDraftKey(uid, initialData.quizDate);

  const [draft, setDraft] = useState(() =>
    readDraft(uid, initialData.quizDate, questions),
  );

  const [completedScore, setCompletedScore] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { answers, currentIndex } = draft;

  const question = questions[currentIndex];
  const selectedAnswer = answers[question.questionKey];

  const answeredCount = questions.filter(
    (item) =>
      answers[item.questionKey] === "yes" || answers[item.questionKey] === "no",
  ).length;

  const percentage = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const allAnswered = answeredCount === TOTAL_QUESTIONS;
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;

  useEffect(() => {
    if (completedScore !== null) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch (error) {
      console.error("Failed to save reflection draft:", error);
    }
  }, [draft, storageKey, completedScore]);

  const submitMutation = useMutation({
    mutationFn: async (submittedAnswers) => {
      const response = await axiosSecure.post("/owner/reflection/submit", {
        quizDate: initialData.quizDate,
        answers: submittedAnswers,
      });

      return response.data;
    },

    onSuccess: (data) => {
      localStorage.removeItem(storageKey);

      queryClient.invalidateQueries({
        queryKey: ["ownerReflectionToday", uid],
      });
      queryClient.invalidateQueries({
        queryKey: ["ownerReflectionYesterday", uid],
      });
      setCompletedScore(data.score);
      onCompleted?.();
    },

    onError: (error) => {
      setFeedback(
        error.response?.data?.message ||
          "Failed to submit your answers. Please try again.",
      );

      if (error.response?.status === 409) {
        queryClient.invalidateQueries({
          queryKey: ["ownerReflectionToday", uid],
        });
        queryClient.invalidateQueries({
          queryKey: ["ownerReflectionYesterday", uid],
        });
      }
    },
  });

  const selectAnswer = (value) => {
    if (submitMutation.isPending) return;

    setFeedback(null);

    setDraft((previous) => ({
      ...previous,
      answers: {
        ...previous.answers,
        [question.questionKey]: value,
      },
    }));
  };

  const handlePrevious = () => {
    if (currentIndex === 0 || submitMutation.isPending) return;

    setFeedback(null);

    setDraft((previous) => ({
      ...previous,
      currentIndex: previous.currentIndex - 1,
    }));
  };

  const handleNext = () => {
    if (!selectedAnswer || submitMutation.isPending) return;

    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setFeedback(null);

      setDraft((previous) => ({
        ...previous,
        currentIndex: previous.currentIndex + 1,
      }));
    }
  };

  const handleSubmit = () => {
    if (!allAnswered || submitMutation.isPending) return;

    const submittedAnswers = questions.map((item) => ({
      questionKey: item.questionKey,
      value: answers[item.questionKey],
    }));

    setFeedback(null);
    submitMutation.mutate(submittedAnswers);
  };

  if (completedScore !== null) {
    return <ReflectionCompletion navigate={navigate} score={completedScore} />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl pb-8">
      <button
        type="button"
        onClick={onBack}
        disabled={submitMutation.isPending}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDA56E] bg-[#FFF0D7]/90 px-5 py-2 font-serif font-semibold text-[#791326] shadow-md transition hover:bg-[#F8D99C] disabled:opacity-50"
      >
        <ArrowLeft size={18} /> Back to Selection
      </button>
      {/* Heading */}
      <header className="mb-5 px-3 text-center text-[#791326] drop-shadow-[0_1px_2px_#fff2d5]">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
          Daily Personal Reflection
        </h1>

        <p className="mt-2 font-serif text-base text-[#4B2118] sm:text-lg">
          Reflect <span className="mx-2">◆</span>
          Improve <span className="mx-2">◆</span>
          Practice <span className="mx-2">◆</span>
          Grow
        </p>
      </header>

      <div className="grid items-start gap-4 lg:translate-y-15 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="relative z-0 min-w-0">
          {/* Progress */}
          <div className="absolute z-10 mb-3 w-full -translate-y-12 rounded-[20px] border-2 border-[#E7A654] bg-[#FFF0D7]/95 px-4 py-2 shadow-md lg:-translate-y-3 sm:px-6">
            <div className="flex flex-col sm:flex-row  sm:flex-wrap items-center gap-3">
              <span className="whitespace-nowrap font-serif text-sm font-semibold text-[#522016] sm:text-base">
                Question {currentIndex + 1} of {TOTAL_QUESTIONS}
              </span>

              <div className="w-full flex-1">
                <ProgressBar percentage={percentage} />
              </div>

              <span className="whitespace-nowrap font-serif text-sm font-bold text-[#8D1428]">
                {percentage}% Completed
              </span>
            </div>
          </div>

          {/* Question panel */}
          <section
            className="relative flex min-h-[530px] flex-col overflow-hidden rounded-[26px] bg-center bg-no-repeat bg-[length:100%_100%] px-7 py-8 text-[#4D1915] shadow-[0_8px_24px_#69270b35] sm:px-10 lg:min-h-[400px] lg:px-10 lg:py-5 xl:px-14"
            style={{ backgroundImage: `url(${questionCardBg})` }}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-center bg-no-repeat bg-[length:100%_100%] lg:hidden"
              style={{ backgroundImage: `url(${mobileQuizBg})` }}
            />

            <div
              className="pointer-events-none absolute inset-0 hidden bg-center bg-no-repeat bg-[length:100%_100%] lg:block"
              style={{ backgroundImage: `url(${questionCardBg})` }}
            />

            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              {/* Same spacing as Mathematics Challenge */}
              <div className="mb-20 text-center sm:mb-25" />

              {/* Question */}
              <h2 className="mx-auto mb-4 max-w-2xl text-center font-sans text-xl font-bold leading-snug text-[#87152A] sm:text-2xl lg:text-3xl">
                {question.text}
              </h2>

              {/* Yes / No buttons */}
              <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
                {[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ].map((option) => {
                  const selected = selectedAnswer === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      disabled={submitMutation.isPending}
                      onClick={() => selectAnswer(option.value)}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left font-serif text-lg font-semibold transition-all duration-200 ${
                        selected
                          ? "border-[#A30E2A] bg-gradient-to-r from-[#FFE2A3] to-[#FFD184] text-[#87152A] shadow-md"
                          : "border-[#DDA56E] bg-[#FFF1DB]/90 text-[#56221A] hover:border-[#A30E2A] hover:bg-[#FFE4B6]"
                      } disabled:opacity-60`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected
                            ? "border-[#A30E2A] bg-[#A30E2A]"
                            : "border-[#D28A2D] bg-[#FFF5E4]"
                        }`}
                      >
                        {selected && (
                          <CheckCircle2 size={18} className="text-[#FFE8A8]" />
                        )}
                      </span>

                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mx-auto mt-8 flex w-full max-w-xl items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0 || submitMutation.isPending}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#FFF0D7] to-[#FBC784] px-4 py-3 font-serif font-semibold text-[#56221A] shadow-md disabled:cursor-not-allowed disabled:opacity-40 sm:px-7"
                >
                  <ArrowLeft size={18} />
                  Previous
                </button>

                {isLastQuestion ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!allAnswered || submitMutation.isPending}
                    className="flex items-center cursor-pointer gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#A30E2A] to-[#590719] px-6 py-3 font-serif font-semibold text-[#FFE8A8] shadow-md disabled:cursor-not-allowed disabled:opacity-40 sm:px-9"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit"}
                    <CheckCircle2 size={19} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedAnswer || submitMutation.isPending}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#A30E2A] to-[#590719] px-6 py-3 font-serif font-semibold text-[#FFE8A8] shadow-md disabled:cursor-not-allowed disabled:opacity-40 sm:px-9"
                  >
                    Next
                    <ArrowRight size={19} />
                  </button>
                )}
              </div>

              {feedback && (
                <div
                  role="alert"
                  className="mx-auto mt-5 flex max-w-xl items-center justify-center gap-2 rounded-xl bg-red-100/90 px-4 py-3 text-center font-serif text-sm text-red-800"
                >
                  <AlertCircle size={19} />
                  <span>{feedback}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Spiritual quote */}
        <aside className="hidden h-full min-h-0 flex-col lg:flex">
          <div className="mt-auto w-full">
            <QuoteCard />
          </div>
        </aside>
      </div>
    </div>
  );
};

const ReflectionChoiceCard = ({
  title,
  date,
  data,
  loading,
  error,
  icon: Icon,
  onSelect,
}) => {
  const available =
    data?.status === "available" &&
    Array.isArray(data.questions) &&
    data.questions.length === TOTAL_QUESTIONS;
  const completed = data?.status === "completed";
  const status = loading
    ? "Checking..."
    : error
      ? "Unable to load"
      : completed
        ? "Completed"
        : available
          ? "Available"
          : "Unavailable";

  return (
    <article className="relative overflow-hidden rounded-[26px] border-2 border-[#DDA56E]/80 bg-gradient-to-br from-[#FFF8E9]/95 via-[#FFF0D7]/95 to-[#F6D6A8]/95 p-4 text-center shadow-[0_12px_35px_rgba(93,31,22,0.18)] backdrop-blur-sm sm:p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#DDA56E]/35" />
      <div className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 rounded-full border border-[#DDA56E]/25" />
      <div className="relative mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[#DDA56E] bg-gradient-to-br from-[#FFE9B8] to-[#E6B56D] text-[#87152A] shadow-md">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h2 className="relative font-serif text-2xl font-bold text-[#791326]">
        {title}
      </h2>
      <p className="relative mt-2 flex items-center justify-center gap-2 font-serif text-sm text-[#75452E]">
        <CalendarDays size={15} /> {date || "Loading date..."}
      </p>
      <div className="relative mx-auto my-3 h-px w-3/4 bg-gradient-to-r from-transparent via-[#C68B48] to-transparent" />
      <p className="relative font-serif text-base text-[#633326]">
        Five questions • Yes or No
      </p>
      <div
        className={`relative mx-auto mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-serif text-sm font-semibold ${
          completed
            ? "border-emerald-700/30 bg-emerald-50 text-emerald-800"
            : available
              ? "border-[#DDA56E] bg-[#FFF8E9] text-[#87152A]"
              : "border-[#DDA56E]/50 bg-white/50 text-[#75452E]"
        }`}
      >
        {completed ? (
          <CheckCircle2 size={16} />
        ) : available ? (
          <ClipboardCheck size={16} />
        ) : (
          <LockKeyhole size={16} />
        )}
        {status}
      </div>
      <button
        type="button"
        disabled={!available}
        onClick={onSelect}
        className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#A30E2A] to-[#590719] px-5 py-3 font-serif font-semibold text-[#FFE8A8] shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {completed
          ? "Already Completed"
          : available
            ? "Begin Reflection"
            : loading
              ? "Loading..."
              : "Not Available"}
        {available && <ArrowRight size={18} />}
      </button>
      {error && (
        <p className="relative mt-3 text-sm text-red-800">
          {error.response?.data?.message || "Please try again."}
        </p>
      )}
    </article>
  );
};

const OwnerYesNoQuestionnaire = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const {
    data: todayData,
    isPending: todayPending,
    error: todayError,
    refetch: refetchToday,
  } = useQuery({
    queryKey: ["ownerReflectionToday", user?.uid],
    queryFn: async () =>
      (await axiosSecure.get("/owner/reflection/today")).data,
    enabled: !authLoading && !!user?.uid,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const yesterdayDate = todayData?.quizDate
    ? getPreviousQuizDate(todayData.quizDate)
    : null;

  const {
    data: yesterdayData,
    isPending: yesterdayPending,
    error: yesterdayError,
    refetch: refetchYesterday,
  } = useQuery({
    queryKey: ["ownerReflectionYesterday", user?.uid, yesterdayDate],
    queryFn: async () =>
      (
        await axiosSecure.get("/owner/reflection/today", {
          params: { quizDate: yesterdayDate },
        })
      ).data,
    enabled: !authLoading && !!user?.uid && !!yesterdayDate,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Show selection only when yesterday is unfinished
  const showSelection = yesterdayData?.status === "available";

  // Automatically open today when yesterday is completed
  const activeData = selectedDate === yesterdayDate ? yesterdayData : todayData;

  const chooseDate = (data) => {
    if (
      data?.status === "available" &&
      Array.isArray(data.questions) &&
      data.questions.length === TOTAL_QUESTIONS
    ) {
      setSelectedDate(data.quizDate);
    }
  };

  return (
    <main className="relative isolate h-full min-h-0 w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${mobileBg})` }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: `url(${desktopBg})` }}
      />
      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full items-center justify-center  px-3 py-3 sm:px-6 md:px-8 lg:px-10">
        {authLoading || todayPending || yesterdayPending ? (
          <p className="py-20 text-center font-serif text-2xl text-[#791326]">
            Loading daily reflection...
          </p>
        ) : todayError || yesterdayError ? (
          <div className="mx-auto max-w-lg rounded-2xl bg-[#FFF0D7] p-8 text-center text-[#87152A]">
            <AlertCircle className="mx-auto mb-3" size={36} />

            <p>
              {todayError?.response?.data?.message ||
                yesterdayError?.response?.data?.message ||
                "Failed to load daily reflection."}
            </p>

            <button
              type="button"
              onClick={() => {
                if (todayError) refetchToday();
                if (yesterdayError) refetchYesterday();
              }}
              className="mt-5 rounded-full bg-[#87152A] px-6 py-3 text-white"
            >
              Try Again
            </button>
          </div>
        ) : !showSelection && todayData?.status === "completed" ? (
          <ReflectionCompletion navigate={navigate} score={todayData.score} />
        ) : (!showSelection || selectedDate) &&
          activeData?.status === "available" ? (
          <OwnerReflectionSession
            key={`${user.uid}:${activeData.quizDate}`}
            uid={user.uid}
            initialData={activeData}
            onBack={() => setSelectedDate(null)}
            onCompleted={() => setSelectedDate(null)}
          />
        ) : (
          <div className="mx-auto w-full max-w-5xl py-2">
            <header className="mb-5 text-center">
              <h1 className="font-serif text-3xl font-bold text-[#791326] drop-shadow-[0_1px_2px_#fff2d5] sm:text-4xl lg:text-5xl">
                Daily Personal Reflection
              </h1>

              <p className="mt-2 font-serif text-base text-[#633326] sm:text-lg">
                Choose your day • Reflect, improve, grow
              </p>

              <div className="mx-auto mt-4 h-px w-48 bg-gradient-to-r from-transparent via-[#B9783E] to-transparent" />
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              <ReflectionChoiceCard
                title="Today's Reflection"
                date={todayData?.quizDate}
                data={todayData}
                loading={false}
                error={null}
                icon={Sun}
                onSelect={() => chooseDate(todayData)}
              />

              {yesterdayData?.status === "available" && (
                <ReflectionChoiceCard
                  title="Yesterday's Reflection"
                  date={yesterdayDate}
                  data={yesterdayData}
                  loading={false}
                  error={null}
                  icon={MoonStar}
                  onSelect={() => chooseDate(yesterdayData)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default OwnerYesNoQuestionnaire;
