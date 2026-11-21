import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Table2,
} from "lucide-react";

import desktopBg from "../../../assets/DashboardImages/laptopDashBg.png";
import mobileBg from "../../../assets/Omkar_Quest_Mobile_Background_1080x2340.png";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MAX_SCORE = 38;

const RANGE_OPTIONS = [
  { value: "1m", label: "1 Month" },
  { value: "2m", label: "2 Months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
  { value: "2y", label: "2 Years" },
  { value: "lifetime", label: "Lifetime" },
  { value: "month", label: "Select Month" },
];

const getCurrentMonth = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
};

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (dateString) =>
  parseDate(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

const formatMonth = (monthString) => {
  const [year, month] = monthString.split("-").map(Number);

  return new Date(year, month - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

const formatAnswer = (value) => {
  if (value === "yes") return "হ্যাঁ";
  if (value === "no") return "না";

  return String(value);
};

const getAvailableMonths = (history) => {
  if (!history.length) return [];

  const firstDate = parseDate(history[0].quizDate);
  const today = new Date();

  const cursor = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);

  const lastMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const months = [];

  while (cursor <= lastMonth) {
    const value = `${cursor.getFullYear()}-${String(
      cursor.getMonth() + 1,
    ).padStart(2, "0")}`;

    months.push({
      value,
      label: formatMonth(value),
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months.reverse();
};

const ProgressTable = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  const [timeRange, setTimeRange] = useState("1m");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  // Fetch summary history to populate the month selector
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["quizHistory", user?.uid],
    enabled: !authLoading && !!user?.uid,
    queryFn: async () => {
      const response = await axiosSecure.get("/quiz/history");
      return response.data;
    },
  });

  // Fetch detailed answers for the selected range
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["quizAnswerHistory", user?.uid, timeRange, selectedMonth],
    enabled: !authLoading && !!user?.uid,
    queryFn: async () => {
      const params = new URLSearchParams({
        range: timeRange,
      });

      if (timeRange === "month") {
        params.set("month", selectedMonth);
      }

      const response = await axiosSecure.get(
        `/quiz/answer-history?${params.toString()}`,
      );

      return response.data;
    },
  });

  const summaryHistory = useMemo(
    () =>
      [...(summaryData?.history ?? [])].sort((a, b) =>
        a.quizDate.localeCompare(b.quizDate),
      ),
    [summaryData?.history],
  );

  const availableMonths = useMemo(
    () => getAvailableMonths(summaryHistory),
    [summaryHistory],
  );

  const questions = Array.isArray(data?.questions) ? data.questions : [];

  const history = Array.isArray(data?.history) ? data.history : [];

  // Map each day's answers by questionKey for fast lookup
  const preparedHistory = useMemo(
    () =>
      history.map((attempt) => ({
        ...attempt,
        answerMap: new Map(
          (attempt.answers ?? []).map((answer) => [answer.questionKey, answer]),
        ),
      })),
    [history],
  );

  // Scroll the answer columns using buttons
  const scrollAnswers = (direction) => {
    const element = document.getElementById("omkar-answer-table-scroll");

    if (!element) return;

    element.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  if (authLoading || isLoading || summaryLoading) {
    return (
      <div className="flex h-full items-center justify-center text-[#87152A]">
        Loading your answer history...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-red-400">Unable to load questionnaire history.</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full bg-[#87152A] px-5 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="relative isolate flex h-full min-h-0 w-full flex-col overflow-hidden">
      {/* Responsive background */}
      <picture className="pointer-events-none absolute inset-0 -z-10">
        <source media="(min-width: 1024px)" srcSet={desktopBg} />

        <img src={mobileBg} alt="" className="h-full w-full object-cover" />
      </picture>

      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-3 px-2 py-2 sm:px-4 sm:py-3 lg:px-6">
        {/* Page heading */}
        <header className="relative flex shrink-0 items-center justify-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-progress")}
            className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border border-[#DDA56E] bg-[#FFF0D7]/90 text-[#87152A] transition hover:bg-[#F5D9A9]"
            aria-label="Back to My Progress"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="text-center">
            <h1 className="font-serif text-xl font-bold text-[#87152A] sm:text-3xl lg:text-4xl">
              My Answer History
            </h1>

            <p className="mt-1 hidden text-sm text-[#80533B] lg:block">
              Reflect on your answers throughout your spiritual journey.
            </p>
          </div>
        </header>

        {/* Main table card */}
        <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[#DDA56E] bg-[#FFF0D7]/90 p-2 shadow-md backdrop-blur-sm sm:p-3">
          {/* Toolbar */}
          <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Table2 size={19} className="text-[#87152A]" />

              <h2 className="font-serif text-sm font-bold text-[#87152A] sm:text-lg">
                Questionnaire Records
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays
                size={16}
                className="hidden text-[#87152A] sm:block"
              />

              <select
                value={timeRange}
                onChange={(event) => setTimeRange(event.target.value)}
                className="rounded-lg border border-[#DDA56E] bg-[#FFF7E9] px-2 py-1.5 text-xs font-semibold text-[#87152A] outline-none"
              >
                {RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {timeRange === "month" && (
                <select
                  value={selectedMonth}
                  onChange={(event) => {
                    setSelectedMonth(event.target.value);
                  }}
                  className="max-w-36 rounded-lg border border-[#DDA56E] bg-[#FFF7E9] px-2 py-1.5 text-xs font-semibold text-[#87152A] outline-none"
                >
                  {availableMonths.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#202020]" />
                <span className="text-[#80533B]">Earned points</span>
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#C43C44]" />
                <span className="text-[#80533B]">Zero points</span>
              </span>
            </div>

            <span className="text-[#80533B]">
              {history.length} completed {history.length === 1 ? "day" : "days"}
            </span>
          </div>

          {/* Table */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-[#DDA56E] bg-[#FFF9EF]/90">
            {questions.length === 0 ? (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[#80533B]">
                No questionnaire questions are available.
              </div>
            ) : (
              <div
                id="omkar-answer-table-scroll"
                className="h-full w-full overflow-auto overscroll-contain"
              >
                <table className="w-max min-w-full border-separate border-spacing-0 text-left font-sans">
                  <thead>
                    <tr>
                      {/* Fixed question heading */}
                      <th className="sticky left-0 top-0 z-30 w-[175px] min-w-[175px] max-w-[175px] border-b border-r border-[#DDA56E] bg-[#F5D9A9] px-3 py-3 text-xs font-bold text-[#87152A] sm:w-[280px] sm:min-w-[280px] sm:max-w-[280px] lg:w-[390px] lg:min-w-[390px] lg:max-w-[390px]">
                        Questions
                      </th>

                      {preparedHistory.map((attempt) => (
                        <th
                          key={attempt.quizDate}
                          className="sticky top-0 z-20 min-w-[90px] border-b border-r border-[#E7CFAC] bg-[#F5D9A9] px-2 py-3 text-center text-xs font-bold text-[#87152A] sm:min-w-[110px]"
                        >
                          {formatDate(attempt.quizDate)}
                        </th>
                      ))}

                      {preparedHistory.length === 0 && (
                        <th className="sticky top-0 border-b border-[#E7CFAC] bg-[#F5D9A9] px-4 py-3 text-center text-xs text-[#80533B]">
                          No submissions
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {questions.map((question) => (
                      <tr key={question.questionKey}>
                        {/* Fixed question cell */}
                        <th
                          scope="row"
                          className="sticky left-0 z-10 w-[175px] min-w-[175px] max-w-[175px] border-b border-r border-[#E7CFAC] bg-[#FFF0D7] px-2 py-3 align-middle text-xs font-medium leading-relaxed text-[#67162A] sm:w-[280px] sm:min-w-[280px] sm:max-w-[280px] sm:px-3 lg:w-[390px] lg:min-w-[390px] lg:max-w-[390px]"
                        >
                          {/* <span className="mr-1 font-bold text-[#B97738]">
                            {index + 1}.
                          </span> */}

                          {question.text}
                        </th>

                        {preparedHistory.map((attempt) => {
                          const answer = attempt.answerMap.get(
                            question.questionKey,
                          );

                          const earnedPoints = answer?.earnedPoints;

                          const hasAnswer = answer !== undefined;

                          // Special rule for Question 3
                          const isQuestion3 =
                            question.questionKey === "male_003";

                          const earned = isQuestion3
                            ? Number(answer?.value) === 4
                            : Number(earnedPoints) > 0;

                          return (
                            <td
                              key={`${attempt.quizDate}-${question.questionKey}`}
                              className="min-w-[90px] border-b border-r border-[#E7CFAC] px-2 py-3 text-center align-middle sm:min-w-[110px]"
                            >
                              {hasAnswer ? (
                                <span
                                  className={`font-sans text-xs font-semibold tabular-nums sm:text-sm ${
                                    earned ? "text-[#202020]" : "text-[#C43C44]"
                                  }`}
                                  title={`Earned ${earnedPoints} point(s)`}
                                >
                                  {formatAnswer(answer.value)}
                                </span>
                              ) : (
                                <span className="text-[#A78A73]">—</span>
                              )}
                            </td>
                          );
                        })}

                        {preparedHistory.length === 0 && (
                          <td className="px-4 py-3 text-center text-[#A78A73]">
                            —
                          </td>
                        )}
                      </tr>
                    ))}

                    {/* Daily total score */}
                    <tr>
                      <th
                        scope="row"
                        className="sticky bottom-0 left-0 z-20 border-r border-t border-[#DDA56E] bg-[#F5D9A9] px-3 py-3 text-xs font-bold text-[#87152A]"
                      >
                        Daily Total Score
                      </th>

                      {preparedHistory.map((attempt) => (
                        <td
                          key={`score-${attempt.quizDate}`}
                          className="sticky bottom-0 z-10 border-r border-t border-[#DDA56E] bg-[#F5D9A9] px-2 py-3 text-center font-sans text-xs font-bold tabular-nums text-[#87152A] sm:text-sm"
                        >
                          {attempt.score} / {attempt.maxScore ?? MAX_SCORE}
                        </td>
                      ))}

                      {preparedHistory.length === 0 && (
                        <td className="sticky bottom-0 border-t border-[#DDA56E] bg-[#F5D9A9] px-4 py-3 text-center text-xs">
                          —
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom navigation */}
          <div className="mt-2 flex shrink-0 items-center justify-between gap-2">
            <p className="text-[10px] text-[#80533B] sm:text-xs">
              Scroll horizontally to compare dates.
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollAnswers(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDA56E] bg-[#FFF7E9] text-[#87152A] transition hover:bg-[#F5D9A9]"
                aria-label="Scroll to previous dates"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => scrollAnswers(1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDA56E] bg-[#FFF7E9] text-[#87152A] transition hover:bg-[#F5D9A9]"
                aria-label="Scroll to next dates"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {isFetching && (
            <p className="mt-1 text-center text-[10px] text-[#80533B]">
              Updating history...
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProgressTable;
