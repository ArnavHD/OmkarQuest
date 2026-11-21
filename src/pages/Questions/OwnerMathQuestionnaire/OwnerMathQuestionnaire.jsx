import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Calculator,
  RefreshCw,
  Sun,
  MoonStar,
  CalendarDays,
  LockKeyhole,
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
  const date = new Date(Date.UTC(year, month - 1, day - 1));
  return date.toISOString().slice(0, 10);
};

const TOTAL_QUESTIONS = 5;
const DRAFT_PREFIX = "omkar-owner-math";

const getDraftKey = (uid, quizDate) => `${DRAFT_PREFIX}:${uid}:${quizDate}`;

const formatNumber = (number) => Number(number).toLocaleString("en-US");

const getOperationSymbol = (operation) => {
  if (operation === "addition") return "+";
  if (operation === "subtraction") return "−";
  return "×";
};

const readDraft = (uid, quizDate) => {
  try {
    const saved = localStorage.getItem(getDraftKey(uid, quizDate));
    if (!saved) return null;

    const draft = JSON.parse(saved);

    if (
      typeof draft.challengeToken !== "string" ||
      !draft.problem ||
      !Number.isInteger(draft.currentQuestion) ||
      draft.currentQuestion < 1 ||
      draft.currentQuestion > TOTAL_QUESTIONS
    ) {
      return null;
    }

    return draft;
  } catch {
    return null;
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

const MathCompletion = ({ navigate }) => (
  <div className="mx-auto flex min-h-[65vh] w-full max-w-xl flex-col items-center justify-center px-3">
    <div className="w-full rounded-3xl border-2 border-[#DDA56E] bg-[#FFF0D7]/95 px-6 py-10 text-center text-[#87152A] shadow-xl backdrop-blur-sm">
      <CheckCircle2 className="mx-auto mb-4 text-green-700" size={56} />

      <h2 className="font-serif text-3xl font-bold">
        Mathematics Challenge Completed!
      </h2>

      <p className="mt-4 font-serif text-lg text-[#56221A]">
        You have successfully completed all five calculations.
      </p>

      <p className="mt-5 font-serif text-4xl font-bold text-[#87152A]">5 / 5</p>

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

const OwnerMathSession = ({
  initialData,
  uid,
  onBack,
  onCompleted,
  showBackButton,
}) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const storageKey = getDraftKey(uid, initialData.quizDate);

  const [session, setSession] = useState(() => {
    const draft = readDraft(uid, initialData.quizDate);

    return (
      draft || {
        quizDate: initialData.quizDate,
        currentQuestion: initialData.currentQuestion,
        problem: initialData.problem,
        challengeToken: initialData.challengeToken,
      }
    );
  });

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(false);
  const [nextData, setNextData] = useState(null);
  const [completed, setCompleted] = useState(false);

  const completedCount = correct
    ? session.currentQuestion
    : session.currentQuestion - 1;

  const percentage = Math.round((completedCount / TOTAL_QUESTIONS) * 100);

  useEffect(() => {
    if (!completed) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(session));
      } catch (error) {
        console.error("Failed to save math draft:", error);
      }
    }
  }, [session, storageKey, completed]);

  const checkMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosSecure.post("/owner/math/check", {
        challengeToken: session.challengeToken,
        answer: Number(answer.trim()),
      });

      return response.data;
    },

    onSuccess: (data) => {
      if (!data.correct) {
        setFeedback({
          type: "error",
          message: data.message || "Incorrect. Try again!",
        });
        return;
      }

      setCorrect(true);
      setNextData(data);
      setFeedback({
        type: "success",
        message: data.message || "Correct!",
      });
    },

    onError: (error) => {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Unable to verify your answer.",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (completionToken) => {
      const response = await axiosSecure.post("/owner/math/submit", {
        completionToken,
      });

      return response.data;
    },

    onSuccess: () => {
      localStorage.removeItem(storageKey);

      queryClient.invalidateQueries({ queryKey: ["ownerMathToday", uid] });
      queryClient.invalidateQueries({ queryKey: ["ownerMathYesterday", uid] });
      setCompleted(true);
      onCompleted?.();
    },

    onError: (error) => {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to save today's score. Please try again.",
      });
    },
  });

  const handleCheck = (event) => {
    event.preventDefault();

    if (correct || checkMutation.isPending) return;

    const trimmed = answer.trim();

    if (!/^-?\d+$/.test(trimmed)) {
      setFeedback({
        type: "error",
        message: "Please enter a valid whole number.",
      });
      return;
    }

    const numericAnswer = Number(trimmed);

    if (!Number.isSafeInteger(numericAnswer)) {
      setFeedback({
        type: "error",
        message: "Please enter a valid whole number.",
      });
      return;
    }

    checkMutation.mutate();
  };

  const handleNext = () => {
    if (!correct || !nextData || nextData.finished) return;

    setSession((previous) => ({
      ...previous,
      currentQuestion: nextData.currentQuestion,
      problem: nextData.problem,
      challengeToken: nextData.challengeToken,
    }));

    setAnswer("");
    setCorrect(false);
    setNextData(null);
    setFeedback(null);
  };

  const handleFinish = () => {
    if (!correct || !nextData?.completionToken) return;

    submitMutation.mutate(nextData.completionToken);
  };

  const restartChallenge = () => {
    localStorage.removeItem(storageKey);
    window.location.reload();
  };

  if (completed) {
    return <MathCompletion navigate={navigate} />;
  }

  const { problem, currentQuestion } = session;
  const operationSymbol = getOperationSymbol(problem.operation);

  return (
    <div className="mx-auto w-full max-w-7xl pb-8">
      {showBackButton && (
        <button
          type="button"
          onClick={onBack}
          disabled={checkMutation.isPending || submitMutation.isPending}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DDA56E] bg-[#FFF0D7]/90 px-5 py-2 font-serif font-semibold text-[#791326] shadow-md transition hover:bg-[#F8D99C] disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Back to Selection
        </button>
      )}
      {/* Heading */}
      <header className="mb-5 px-3 text-center text-[#791326] drop-shadow-[0_1px_2px_#fff2d5]">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
          Daily Mathematics Challenge
        </h1>

        <p className="mt-2 font-serif text-base text-[#4B2118] sm:text-lg">
          Focus <span className="mx-2">◆</span>
          Calculate <span className="mx-2">◆</span>
          Persevere <span className="mx-2">◆</span>
          Grow
        </p>
      </header>

      <div className="grid items-start gap-4 lg:translate-y-24 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_310px]">
        <main className="relative z-0 min-w-0">
          {/* Progress */}
          <div className="absolute z-10 mb-3 w-full -translate-y-12 rounded-[20px] border-2 border-[#E7A654] bg-[#FFF0D7]/95 px-4 py-2 shadow-md lg:-translate-y-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="whitespace-nowrap font-serif text-sm font-semibold text-[#522016] sm:text-base">
                Question {currentQuestion} of {TOTAL_QUESTIONS}
              </span>

              <div className="min-w-24 flex-1">
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
            style={{
              backgroundImage: `url(${questionCardBg})`,
            }}
          >
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-[length:100%_100%] lg:hidden"
              style={{
                backgroundImage: `url(${mobileQuizBg})`,
              }}
            />

            <div
              className="absolute inset-0 hidden bg-center bg-no-repeat bg-[length:100%_100%] lg:block"
              style={{
                backgroundImage: `url(${questionCardBg})`,
              }}
            />

            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              <div className="mb-20 text-center sm:mb-25" />

              <h2 className="mx-auto mb-2 max-w-2xl text-center font-sans text-2xl font-bold leading-snug text-[#87152A] sm:text-3xl">
                {formatNumber(problem.firstNumber)}
                <span className="mx-3 text-[#B86A20]">{operationSymbol}</span>
                {formatNumber(problem.secondNumber)}
              </h2>

              <form onSubmit={handleCheck} className="mx-auto w-full max-w-xl">
                <label
                  htmlFor="owner-math-answer"
                  className="mb-3 block text-center font-serif text-base text-[#7C4A30]"
                >
                  Enter your answer
                </label>

                <input
                  id="owner-math-answer"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    setFeedback(null);
                  }}
                  disabled={correct || checkMutation.isPending}
                  placeholder="Your calculation result"
                  className="w-full rounded-2xl border-2 border-[#DDA56E] bg-[#FFF1DB]/90 px-5 py-4 text-center font-sans text-xl font-semibold text-[#87152A] outline-none transition focus:border-[#A30E2A] focus:ring-2 focus:ring-[#DDA56E]/50 disabled:opacity-70"
                />

                {feedback && (
                  <div
                    role="status"
                    className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-center font-serif text-sm ${
                      feedback.type === "success"
                        ? "bg-green-100/90 text-green-800"
                        : "bg-red-100/90 text-red-800"
                    }`}
                  >
                    {feedback.type === "success" ? (
                      <CheckCircle2 size={19} />
                    ) : (
                      <AlertCircle size={19} />
                    )}

                    <span>{feedback.message}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={restartChallenge}
                    disabled={
                      checkMutation.isPending || submitMutation.isPending
                    }
                    className="flex items-center gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#FFF0D7] to-[#FBC784] px-4 py-3 font-serif font-semibold text-[#56221A] shadow-md disabled:opacity-40 sm:px-7"
                  >
                    <RefreshCw size={18} />
                    Restart
                  </button>

                  {!correct ? (
                    <button
                      type="submit"
                      disabled={checkMutation.isPending || !answer.trim()}
                      className="flex items-center gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#A30E2A] to-[#590719] px-6 py-3 font-serif font-semibold text-[#FFE8A8] shadow-md disabled:cursor-not-allowed disabled:opacity-40 sm:px-9"
                    >
                      {checkMutation.isPending ? "Checking..." : "Check Answer"}
                      <ArrowRight size={19} />
                    </button>
                  ) : nextData?.finished ? (
                    <button
                      type="button"
                      onClick={handleFinish}
                      disabled={submitMutation.isPending}
                      className="flex items-center gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#A30E2A] to-[#590719] px-6 py-3 font-serif font-semibold text-[#FFE8A8] shadow-md disabled:opacity-40 sm:px-9"
                    >
                      {submitMutation.isPending
                        ? "Submitting..."
                        : "Submit 5/5"}
                      <CheckCircle2 size={19} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#A30E2A] to-[#590719] px-6 py-3 font-serif font-semibold text-[#FFE8A8] shadow-md sm:px-9"
                    >
                      Next
                      <ArrowRight size={19} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        </main>

        <aside className="hidden h-full min-h-0 flex-col lg:flex">
          <div className="mt-auto w-full">
            <QuoteCard />
          </div>
        </aside>
      </div>
    </div>
  );
};

const ChallengeChoiceCard = ({
  title,
  date,
  data,
  loading,
  error,
  icon: Icon,
  onSelect,
}) => {
  const available = data?.status === "available";
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
    <article className="group relative overflow-hidden rounded-[28px] border-2 border-[#DDA56E]/80 bg-gradient-to-br from-[#FFF8E9]/95 via-[#FFF0D7]/95 to-[#F6D6A8]/95 p-6 text-center shadow-[0_12px_35px_rgba(93,31,22,0.18)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_16px_40px_rgba(93,31,22,0.25)] sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#DDA56E]/35" />
      <div className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 rounded-full border border-[#DDA56E]/25" />
      <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#DDA56E] bg-gradient-to-br from-[#FFE9B8] to-[#E6B56D] text-[#87152A] shadow-md">
        <Icon size={38} strokeWidth={1.5} />
      </div>
      <h2 className="relative font-serif text-2xl font-bold text-[#791326] sm:text-3xl">
        {title}
      </h2>
      <p className="relative mt-2 flex items-center justify-center gap-2 font-serif text-sm text-[#75452E]">
        <CalendarDays size={15} /> {date || "Loading date..."}
      </p>
      <div className="relative mx-auto my-5 h-px w-3/4 bg-gradient-to-r from-transparent via-[#C68B48] to-transparent" />
      <p className="relative font-serif text-base text-[#633326]">
        Five questions • 5 / 5 to complete
      </p>
      <div
        className={`relative mx-auto mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-serif text-sm font-semibold ${
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
          <Calculator size={16} />
        ) : (
          <LockKeyhole size={16} />
        )}
        {status}
      </div>
      <button
        type="button"
        disabled={!available}
        onClick={onSelect}
        className="relative cursor-pointer mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-[#D78B3D] bg-gradient-to-b from-[#A30E2A] to-[#590719] px-5 py-3 font-serif font-semibold text-[#FFE8A8] shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {completed
          ? "Already Completed"
          : available
            ? "Begin Challenge"
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

const OwnerMathQuestionnaire = () => {
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
    queryKey: ["ownerMathToday", user?.uid],
    queryFn: async () => (await axiosSecure.get("/owner/math/today")).data,
    enabled: !authLoading && !!user?.uid,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Use the server's date (based on the owner's configured timezone).
  const yesterdayDate = todayData?.quizDate
    ? getPreviousQuizDate(todayData.quizDate)
    : null;

  const {
    data: yesterdayData,
    isPending: yesterdayPending,
    error: yesterdayError,
    refetch: refetchYesterday,
  } = useQuery({
    queryKey: ["ownerMathYesterday", user?.uid, yesterdayDate],
    queryFn: async () =>
      (
        await axiosSecure.get("/owner/math/today", {
          params: { quizDate: yesterdayDate },
        })
      ).data,
    enabled: !authLoading && !!user?.uid && !!yesterdayDate,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Offer a choice only while yesterday's catch-up is unfinished.
  const showSelection = yesterdayData?.status === "available";

  const activeData = selectedDate === yesterdayDate ? yesterdayData : todayData;

  const chooseDate = (data) => {
    if (data?.status === "available") setSelectedDate(data.quizDate);
  };

  return (
    <main className="relative isolate min-h-dvh w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${mobileBg})` }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: `url(${desktopBg})` }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full items-start justify-center px-3 py-6 sm:px-6 md:px-8 lg:px-10">
        {authLoading || todayPending || yesterdayPending ? (
          <p className="py-20 text-center font-serif text-2xl text-[#791326]">
            Loading mathematics challenges...
          </p>
        ) : todayError || yesterdayError ? (
          <div className="mx-auto max-w-lg rounded-2xl bg-[#FFF0D7] p-8 text-center text-[#87152A]">
            <AlertCircle className="mx-auto mb-3" size={36} />
            <p>
              {todayError?.response?.data?.message ||
                yesterdayError?.response?.data?.message ||
                "Failed to load mathematics challenges"}
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
          <MathCompletion navigate={navigate} />
        ) : (!showSelection || selectedDate) &&
          activeData?.status === "available" ? (
          <OwnerMathSession
            key={`${user.uid}:${activeData.quizDate}`}
            uid={user.uid}
            initialData={activeData}
            onBack={() => setSelectedDate(null)}
            onCompleted={() => setSelectedDate(null)}
            showBackButton={showSelection}
          />
        ) : (
          <div className="mx-auto w-full max-w-5xl py-6">
            <header className="mb-4 text-center">
              <h1 className="font-serif text-3xl font-bold text-[#791326] drop-shadow-[0_1px_2px_#fff2d5] sm:text-4xl lg:text-5xl">
                Mathematics Challenge
              </h1>
              <p className="mt-3 font-serif text-base text-[#633326] sm:text-lg">
                Choose your day • Focus, calculate, persevere
              </p>
              <div className="mx-auto mt-5 h-px w-48 bg-gradient-to-r from-transparent via-[#B9783E] to-transparent" />
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              <ChallengeChoiceCard
                title="Today's Challenge"
                date={todayData?.quizDate}
                data={todayData}
                loading={false}
                error={null}
                icon={Sun}
                onSelect={() => chooseDate(todayData)}
              />
              {yesterdayData?.status === "available" && (
                <ChallengeChoiceCard
                  title="Yesterday's Challenge"
                  date={yesterdayDate}
                  data={yesterdayData}
                  loading={yesterdayPending}
                  error={yesterdayError}
                  icon={MoonStar}
                  onSelect={() => chooseDate(yesterdayData)}
                />
              )}
            </div>

            {yesterdayError && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => refetchYesterday()}
                  className="rounded-full border border-[#DDA56E] bg-[#FFF0D7] px-6 py-2 font-serif text-[#87152A]"
                >
                  Retry yesterday's challenge
                </button>
              </div>
            )}
            <p className="mt-8 text-center font-serif text-sm text-[#75452E]">
              Completed challenges cannot be submitted again.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default OwnerMathQuestionnaire;
