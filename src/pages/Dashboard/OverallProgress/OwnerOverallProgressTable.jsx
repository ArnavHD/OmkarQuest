import { useMemo, useRef, useState } from "react";
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

const RANGE_OPTIONS = [
  { value: "1m", label: "1 Month" },
  { value: "2m", label: "2 Months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
  { value: "2y", label: "2 Years" },
  { value: "lifetime", label: "Lifetime" },
  { value: "month", label: "Select Month" },
];
const DAY_MS = 86400000;
const toUTC = (date) => Date.parse(`${date}T00:00:00Z`);
const addDays = (date, n) =>
  new Date(toUTC(date) + n * DAY_MS).toISOString().slice(0, 10);
const getCurrentMonth = () => new Date().toISOString().slice(0, 7);
const formatDate = (date) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
const formatMonth = (month) =>
  new Date(`${month}-01T12:00:00Z`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
const monthEnd = (month) => {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
};
const subtractMonths = (date, count) => {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - count - 1, 1));
  const last = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(d, last));
  return target.toISOString().slice(0, 10);
};
const buildMonths = (first, today) => {
  if (!first || !today || first > today) return [];
  const months = [];
  let month = first.slice(0, 7);
  while (month <= today.slice(0, 7)) {
    months.push({ value: month, label: formatMonth(month) });
    const [y, m] = month.split("-").map(Number);
    month = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 7);
  }
  return months.reverse();
};
const formatAnswer = (value) =>
  value === "yes"
    ? "Yes"
    : value === "no"
      ? "No"
      : value == null
        ? "—"
        : String(value);
const fixedColumn =
  "w-[175px] min-w-[175px] max-w-[175px] sm:w-[280px] sm:min-w-[280px] sm:max-w-[280px] lg:w-[390px] lg:min-w-[390px] lg:max-w-[390px]";

export default function OwnerOverallProgressTable() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();
  const scrollRef = useRef(null);
  const [timeRange, setTimeRange] = useState("1m");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  const metadataQuery = useQuery({
    queryKey: ["ownerOverallMetadata", user?.uid],
    enabled: !authLoading && !!user?.uid,
    queryFn: async () =>
      (await axiosSecure.get("/owner/progress/metadata")).data,
    staleTime: 60000,
  });
  const today = metadataQuery.data?.today;
  const firstAttemptDate = metadataQuery.data?.firstAttemptDate;
  const availableMonths = useMemo(
    () => buildMonths(firstAttemptDate, today),
    [firstAttemptDate, today],
  );
  const effectiveMonth = availableMonths.some(
    (month) => month.value === selectedMonth,
  )
    ? selectedMonth
    : (today?.slice(0, 7) ?? selectedMonth);
  const range = useMemo(() => {
    if (!today) return null;
    if (timeRange === "month")
      return {
        startDate: `${effectiveMonth}-01`,
        endDate: [monthEnd(effectiveMonth), today].sort()[0],
      };
    if (timeRange === "lifetime")
      return { startDate: firstAttemptDate ?? today, endDate: today };
    const months = { "1m": 1, "2m": 2, "6m": 6, "1y": 12, "2y": 24 };
    return {
      startDate: subtractMonths(today, months[timeRange] ?? 1),
      endDate: today,
    };
  }, [today, firstAttemptDate, timeRange, effectiveMonth]);

  const historyQuery = useQuery({
    queryKey: [
      "ownerOverall40QuestionHistory",
      user?.uid,
      timeRange,
      effectiveMonth,
      range?.startDate,
      range?.endDate,
    ],
    enabled:
      !authLoading &&
      !!user?.uid &&
      !!range &&
      range.startDate <= range.endDate,
    queryFn: async () => {
      // The regular endpoint uses its existing range/month contract.
      const regularParams = { range: timeRange };
      if (timeRange === "month") regularParams.month = effectiveMonth;
      const regularRequest = axiosSecure.get("/quiz/answer-history", {
        params: regularParams,
      });
      const reflectionRequests = [];
      const overallRequests = [];
      // Overall endpoint has a 3660-day cap. Chunk to avoid silently dropping history.
      // Reflection history uses the same bounded chunks for predictable request sizes.
      for (let cursor = range.startDate; cursor <= range.endDate; ) {
        const chunkEnd = addDays(cursor, 3659);
        const endDate = chunkEnd < range.endDate ? chunkEnd : range.endDate;
        const params = { startDate: cursor, endDate };
        reflectionRequests.push(
          axiosSecure.get("/owner/reflection/answer-history", { params }),
        );
        overallRequests.push(
          axiosSecure.get("/owner/progress/overall", { params }),
        );
        cursor = addDays(endDate, 1);
      }
      const [regularResponse, reflectionResponses, overallResponses] =
        await Promise.all([
          regularRequest,
          Promise.all(reflectionRequests),
          Promise.all(overallRequests),
        ]);
      return {
        regular: regularResponse.data,
        reflectionQuestions: reflectionResponses[0]?.data?.questions ?? [],
        reflectionHistory: reflectionResponses.flatMap(
          (response) => response.data?.history ?? [],
        ),
        overallDays: overallResponses.flatMap(
          (response) => response.data?.days ?? [],
        ),
      };
    },
  });

  const regularQuestions = Array.isArray(historyQuery.data?.regular?.questions)
    ? historyQuery.data.regular.questions
    : [];
  const reflectionQuestions = useMemo(
    () =>
      [...(historyQuery.data?.reflectionQuestions ?? [])].sort(
        (a, b) => a.order - b.order,
      ),
    [historyQuery.data?.reflectionQuestions],
  );
  const records = useMemo(() => {
    const map = new Map();
    const ensure = (date) => {
      if (!date || !range || date < range.startDate || date > range.endDate)
        return null;
      if (!map.has(date))
        map.set(date, {
          quizDate: date,
          regular: null,
          reflection: null,
          overall: null,
        });
      return map.get(date);
    };
    for (const attempt of historyQuery.data?.regular?.history ?? []) {
      const record = ensure(attempt.quizDate);
      if (record) record.regular = attempt;
    }
    for (const attempt of historyQuery.data?.reflectionHistory ?? []) {
      const record = ensure(attempt.quizDate);
      if (record) record.reflection = attempt;
    }
    for (const day of historyQuery.data?.overallDays ?? []) {
      if (!(day.completedCount > 0)) continue;
      const record = ensure(day.quizDate);
      if (record) record.overall = day;
    }
    return [...map.values()]
      .sort((a, b) => a.quizDate.localeCompare(b.quizDate))
      .map((record) => ({
        ...record,
        regularAnswers: new Map(
          (record.regular?.answers ?? []).map((answer) => [
            answer.questionKey,
            answer,
          ]),
        ),
        reflectionAnswers: new Map(
          (record.reflection?.answers ?? []).map((answer) => [
            answer.questionKey,
            answer,
          ]),
        ),
      }));
  }, [historyQuery.data, range]);

  const renderQuestionRow = (question, type, index) => (
    <tr key={`${type}-${question.questionKey}`}>
      <th
        scope="row"
        className={`sticky left-0 z-10 ${fixedColumn} border-b border-r border-[#E7CFAC] bg-[#FFF0D7] px-2 py-3 text-xs font-medium leading-relaxed text-[#67162A] sm:px-3`}
      >
        {type === "reflection"
          ? `${index + 36}) ${String(question.text ?? "").replace(/^\s*\d+\s*[).]\s*/, "")}`
          : question.text}
      </th>
      {records.map((record) => {
        const answer = (
          type === "reflection"
            ? record.reflectionAnswers
            : record.regularAnswers
        ).get(question.questionKey);
        const earned =
          type === "reflection"
            ? Number(answer?.score) > 0
            : question.questionKey === "male_003"
              ? Number(answer?.value) === 4
              : Number(answer?.earnedPoints) > 0;
        const points =
          type === "reflection" ? answer?.score : answer?.earnedPoints;
        return (
          <td
            key={`${record.quizDate}-${question.questionKey}`}
            className="min-w-[90px] border-b border-r border-[#E7CFAC] px-2 py-3 text-center align-middle sm:min-w-[110px]"
          >
            {answer ? (
              <span
                title={`Earned ${points ?? 0} point(s)`}
                className={`text-xs font-semibold tabular-nums sm:text-sm ${earned ? "text-[#202020]" : "text-[#C43C44]"}`}
              >
                {formatAnswer(answer.value)}
              </span>
            ) : (
              <span className="text-[#A78A73]">—</span>
            )}
          </td>
        );
      })}
      {records.length === 0 && (
        <td className="px-4 py-3 text-center text-[#A78A73]">—</td>
      )}
    </tr>
  );

  const scoreRows = [
    { key: "regular", label: "Spiritual Score", max: 38 },
    { key: "reflection", label: "Reflection Score", max: 5 },
    { key: "math", label: "Mathematics Score", max: 5 },
    { key: "overall", label: "Overall Score", max: 48 },
  ];
  const getScore = (record, key, max) => {
    const day = record.overall;
    if (key === "overall")
      return day?.fullyCompleted && day.overallScore != null
        ? `${day.overallScore} / 48`
        : "—";
    if (day?.[key]?.completed) return `${day[key].score} / ${max}`;
    // Answer-history documents are a fallback if the score summary is missing.
    if (key === "regular" && record.regular?.score != null)
      return `${record.regular.score} / 38`;
    if (key === "reflection" && record.reflection?.score != null)
      return `${record.reflection.score} / 5`;
    return "—";
  };

  if (
    authLoading ||
    metadataQuery.isLoading ||
    (range && historyQuery.isLoading)
  )
    return (
      <div className="flex h-full items-center justify-center text-[#87152A]">
        Loading your answer history...
      </div>
    );
  if (metadataQuery.isError || historyQuery.isError)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-red-500">Unable to load overall answer history.</p>
        <button
          type="button"
          onClick={() => {
            metadataQuery.refetch();
            historyQuery.refetch();
          }}
          className="rounded-full bg-[#87152A] px-5 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <main className="relative isolate flex h-full min-h-0 w-full flex-col overflow-hidden">
      <picture className="pointer-events-none absolute inset-0 -z-10">
        <source media="(min-width: 1024px)" srcSet={desktopBg} />
        <img src={mobileBg} alt="" className="h-full w-full object-cover" />
      </picture>
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-3 px-2 py-2 sm:px-4 sm:py-3 lg:px-6">
        <header className="relative flex shrink-0 items-center justify-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard/overall-progress")}
            className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border border-[#DDA56E] bg-[#FFF0D7]/90 text-[#87152A] transition hover:bg-[#F5D9A9]"
            aria-label="Back to Overall Progress"
          >
            <ArrowLeft size={17} />
          </button>
          <div className="text-center">
            <h1 className="font-serif text-xl font-bold text-[#87152A] sm:text-3xl lg:text-4xl">
              My Overall Answer History
            </h1>
            <p className="mt-1 hidden text-sm text-[#80533B] lg:block">
              Reflect on your answers throughout your spiritual journey.
            </p>
          </div>
        </header>
        <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[#DDA56E] bg-[#FFF0D7]/90 p-2 shadow-md backdrop-blur-sm sm:p-3">
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
                  value={effectiveMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
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
              {records.length} active {records.length === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-[#DDA56E] bg-[#FFF9EF]/90">
            <div
              ref={scrollRef}
              className="h-full w-full overflow-auto overscroll-contain"
            >
              <table className="w-max min-w-full border-separate border-spacing-0 text-left font-sans">
                <thead>
                  <tr>
                    <th
                      className={`sticky left-0 top-0 z-30 ${fixedColumn} border-b border-r border-[#DDA56E] bg-[#F5D9A9] px-3 py-3 text-xs font-bold text-[#87152A]`}
                    >
                      Questions
                    </th>
                    {records.map((record) => (
                      <th
                        key={record.quizDate}
                        className="sticky top-0 z-20 min-w-[90px] border-b border-r border-[#E7CFAC] bg-[#F5D9A9] px-2 py-3 text-center text-xs font-bold text-[#87152A] sm:min-w-[110px]"
                      >
                        {formatDate(record.quizDate)}
                      </th>
                    ))}
                    {records.length === 0 && (
                      <th className="sticky top-0 border-b border-[#E7CFAC] bg-[#F5D9A9] px-4 py-3 text-center text-xs text-[#80533B]">
                        No submissions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {regularQuestions.map((question, index) =>
                    renderQuestionRow(question, "regular", index),
                  )}
                  {reflectionQuestions.map((question, index) =>
                    renderQuestionRow(question, "reflection", index),
                  )}
                  {scoreRows.map(({ key, label, max }) => (
                    <tr key={key}>
                      <th
                        scope="row"
                        className={`sticky left-0 ${key === "overall" ? "bottom-0 z-20 border-t border-[#DDA56E] bg-[#F5D9A9] font-bold" : "z-10 bg-[#FFF0D7] font-semibold"} ${fixedColumn} border-b border-r border-[#E7CFAC] px-3 py-3 text-xs text-[#87152A]`}
                      >
                        {label}
                      </th>
                      {records.map((record) => (
                        <td
                          key={`${key}-${record.quizDate}`}
                          className={`min-w-[90px] border-b border-r border-[#E7CFAC] px-2 py-3 text-center text-xs font-bold tabular-nums text-[#87152A] sm:min-w-[110px] sm:text-sm ${key === "overall" ? "sticky bottom-0 z-10 border-t border-[#DDA56E] bg-[#F5D9A9]" : ""}`}
                        >
                          {getScore(record, key, max)}
                        </td>
                      ))}
                      {records.length === 0 && (
                        <td className="px-4 py-3 text-center text-[#A78A73]">
                          —
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-2 flex shrink-0 items-center justify-between gap-2">
            <p className="text-[10px] text-[#80533B] sm:text-xs">
              Scroll horizontally to compare dates.
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  scrollRef.current?.scrollBy({
                    left: -320,
                    behavior: "smooth",
                  })
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDA56E] bg-[#FFF7E9] text-[#87152A] transition hover:bg-[#F5D9A9]"
                aria-label="Scroll to previous dates"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() =>
                  scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDA56E] bg-[#FFF7E9] text-[#87152A] transition hover:bg-[#F5D9A9]"
                aria-label="Scroll to next dates"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          {historyQuery.isFetching && (
            <p className="mt-1 text-center text-[10px] text-[#80533B]">
              Updating history...
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
