import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ReactECharts from "echarts-for-react";

import desktopBg from "../../../assets/DashboardImages/laptopDashBg.png";
import mobileBg from "../../../assets/Omkar_Quest_Mobile_Background_1080x2340.png";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  ChartNoAxesCombined,
  Flower2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const MAX_SCORE = 38;

// -----------------------------
// Date helpers
// -----------------------------

const parseDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (dateString, includeYear = false) => {
  return parseDate(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(includeYear ? { year: "numeric" } : {}),
  });
};

const getCurrentMonth = () => {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
};

const getMonthName = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);

  return new Date(year, month - 1, 1).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
};

const getRangeStart = (endExclusive, monthsBack) => {
  const target = new Date(
    endExclusive.getFullYear(),
    endExclusive.getMonth() - monthsBack,
    1,
  );

  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();

  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(endExclusive.getDate(), lastDay),
  );
};

// -----------------------------
// Main component
// -----------------------------

const MyProgress = () => {
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [chartType, setChartType] = useState(() => {
    try {
      return localStorage.getItem("omkar-progress-chart") === "bar"
        ? "bar"
        : "line";
    } catch {
      return "line";
    }
  });

  const [timeRange, setTimeRange] = useState("journey");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  // -----------------------------
  // Fetch questionnaire history
  // -----------------------------

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["quizHistory", user?.uid],
    enabled: !authLoading && !!user?.uid,

    queryFn: async () => {
      const response = await axiosSecure.get("/quiz/history");
      return response.data;
    },
  });

  // Profile is the only place where this threshold can be edited.
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.uid],
    enabled: !authLoading && Boolean(user?.uid),
    queryFn: async () => (await axiosSecure.get("/users/me")).data,
    staleTime: 30_000,
  });

  const configuredSafetyLine = Number(profile?.safetyLine?.spiritual);
  const safetyLine =
    Number.isInteger(configuredSafetyLine) &&
    configuredSafetyLine >= 32 &&
    configuredSafetyLine <= 38
      ? configuredSafetyLine
      : 32;

  const history = useMemo(() => {
    return [...(data?.history ?? [])].sort((a, b) =>
      a.quizDate.localeCompare(b.quizDate),
    );
  }, [data?.history]);

  const changeChartType = (type) => {
    setChartType(type);

    try {
      localStorage.setItem("omkar-progress-chart", type);
    } catch {
      // Chart still works if localStorage is unavailable.
    }
  };

  // -----------------------------
  // Calendar month options
  // -----------------------------

  const availableMonths = useMemo(() => {
    if (!history.length) return [];

    const cursor = parseDate(history[0].quizDate);
    cursor.setDate(1);

    const today = new Date();

    const end = new Date(today.getFullYear(), today.getMonth(), 1);

    const months = [];

    while (cursor <= end) {
      const key = `${cursor.getFullYear()}-${String(
        cursor.getMonth() + 1,
      ).padStart(2, "0")}`;

      months.push({
        value: key,
        label: getMonthName(key),
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }

    return months.reverse();
  }, [history]);

  // -----------------------------
  // Date range
  // -----------------------------

  const dateRange = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate;
    let endDate = new Date(today);

    if (timeRange === "journey") {
      // 20 previous days + today + 9 upcoming days.
      // Today sits at approximately 70% of the graph.
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 20);

      endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 9);
    } else if (timeRange === "month") {
      const [year, month] = selectedMonth.split("-").map(Number);

      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);

      // Keep the full calendar month, including future days.
    } else if (timeRange === "lifetime") {
      startDate = history.length
        ? parseDate(history[0].quizDate)
        : new Date(today);
    } else {
      const monthsBack = {
        "1m": 1,
        "6m": 6,
        "1y": 12,
        "2y": 24,
      };

      const endExclusive = new Date(today);
      endExclusive.setDate(endExclusive.getDate() + 1);

      startDate = getRangeStart(endExclusive, monthsBack[timeRange] ?? 1);
    }

    return { startDate, endDate };
  }, [timeRange, selectedMonth, history]);

  // -----------------------------
  // Daily scores and statuses
  // -----------------------------

  const dailyData = useMemo(() => {
    if (!history.length) return [];

    const todayKey = toDateKey(new Date());

    const scores = new Map(
      history.map((item) => [item.quizDate, Number(item.score)]),
    );

    const result = [];
    const cursor = new Date(dateRange.startDate);

    while (cursor <= dateRange.endDate) {
      const date = toDateKey(cursor);
      const hasScore = scores.has(date);

      let status;

      if (hasScore) {
        status = "completed";
      } else if (date < todayKey) {
        status = "missed";
      } else if (date === todayKey) {
        status = "today";
      } else {
        status = "upcoming";
      }

      result.push({
        date,
        score: hasScore ? scores.get(date) : null,
        status,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  }, [history, dateRange]);

  // -----------------------------
  // Aggregation type
  // -----------------------------

  const aggregation = useMemo(() => {
    if (timeRange === "6m" || timeRange === "1y") {
      return "weekly";
    }

    if (timeRange === "2y" || timeRange === "lifetime") {
      return "monthly";
    }

    return "daily";
  }, [timeRange]);

  // -----------------------------
  // Chart data
  // -----------------------------

  const chartData = useMemo(() => {
    if (aggregation === "daily") {
      return dailyData.map((item) => ({
        key: item.date,
        label: item.date,
        score: item.score,
        status: item.status,
        startDate: item.date,
        endDate: item.date,
      }));
    }

    const buckets = new Map();

    dailyData.forEach((item) => {
      const date = parseDate(item.date);

      let bucketKey;

      if (aggregation === "weekly") {
        const monday = new Date(date);
        const weekday = (monday.getDay() + 6) % 7;

        monday.setDate(monday.getDate() - weekday);
        bucketKey = toDateKey(monday);
      } else {
        bucketKey = item.date.slice(0, 7);
      }

      if (!buckets.has(bucketKey)) {
        buckets.set(bucketKey, {
          key: bucketKey,
          startDate: item.date,
          endDate: item.date,
          sum: 0,
          count: 0,
        });
      }

      const bucket = buckets.get(bucketKey);

      bucket.endDate = item.date;

      if (item.score !== null) {
        bucket.sum += item.score;
        bucket.count += 1;
      }
    });

    return [...buckets.values()].map((bucket) => ({
      key: bucket.key,
      startDate: bucket.startDate,
      endDate: bucket.endDate,

      score: bucket.count
        ? Number((bucket.sum / bucket.count).toFixed(1))
        : null,

      label: aggregation === "weekly" ? bucket.startDate : bucket.key,
    }));
  }, [dailyData, aggregation]);

  // -----------------------------
  // Month heading
  // -----------------------------

  const chartMonthTitle = useMemo(() => {
    if (!chartData.length) return "";

    const firstDate = chartData[0].startDate;
    const lastDate = chartData[chartData.length - 1].endDate;

    const firstMonth = firstDate.slice(0, 7);
    const lastMonth = lastDate.slice(0, 7);

    if (firstMonth === lastMonth) {
      return getMonthName(firstMonth);
    }

    return `${getMonthName(firstMonth)} – ${getMonthName(lastMonth)}`;
  }, [chartData]);

  // -----------------------------
  // Summary calculations
  // -----------------------------

  const averageScore = history.length
    ? (
        history.reduce((sum, item) => sum + Number(item.score), 0) /
        history.length
      ).toFixed(1)
    : "0";

  // -----------------------------
  // ECharts configuration
  // -----------------------------

  const buildChartOption = (isMobile) => {
    const isDaily = aggregation === "daily";
    const isJourney = timeRange === "journey";

    const formatXAxis = (value) => {
      if (isDaily) {
        if (isMobile) {
          return String(Number(value.split("-")[2]));
        }

        return formatDate(value);
      }

      if (aggregation === "weekly") {
        return isMobile
          ? formatDate(value).replace(" ", "\n")
          : formatDate(value);
      }

      return getMonthName(value).replace(" ", "\n");
    };

    const formatTooltip = (params) => {
      const point = params.find(
        (item) =>
          item.seriesName === "Spiritual Score" ||
          item.seriesName === "Average Spiritual Score",
      );

      if (!point) return "";

      const item = chartData[point.dataIndex];
      if (!item) return "";

      let title;

      if (aggregation === "daily") {
        title = formatDate(item.startDate, true);
      } else if (aggregation === "weekly") {
        title = `${formatDate(
          item.startDate,
          true,
        )} – ${formatDate(item.endDate, true)}`;
      } else {
        title = getMonthName(item.key);
      }

      if (item.status === "missed") {
        return `<strong>${title}</strong><br/>No questionnaire submitted`;
      }

      if (item.status === "today") {
        return `<strong>${title}</strong><br/>Today's questionnaire is pending`;
      }

      if (item.status === "upcoming") {
        return `<strong>${title}</strong><br/>Upcoming day`;
      }

      if (item.score === null) {
        return `<strong>${title}</strong><br/>No questionnaire submitted`;
      }

      return `
        <strong>${title}</strong>
        <br/>
        ${isDaily ? "Score" : "Average score"}: ${item.score} / ${MAX_SCORE}
        <br/>Safety line: ${safetyLine} / ${MAX_SCORE}
        ${
          isDaily && item.status === "completed"
            ? `<br/><strong style="color:${item.score < safetyLine ? "#B91C1C" : "#277344"}">${item.score < safetyLine ? "Below safety line" : "Meets safety line"}</strong>`
            : "<br/>Safety status applies to individual completed days"
        }
      `;
    };

    const scoreSeries = {
      name:
        aggregation === "daily" ? "Spiritual Score" : "Average Spiritual Score",

      type: chartType,

      data: chartData.map((item) => {
        if (item.score == null) return null;
        // Safety flags apply only to completed individual days, not averages.
        const below =
          isDaily && item.status === "completed" && item.score < safetyLine;
        return {
          value: item.score,
          ...(below
            ? {
                itemStyle: {
                  color: "#D64545",
                  borderColor: "#FFCCCC",
                  borderWidth: chartType === "line" ? 2 : 0,
                  borderRadius: chartType === "bar" ? [3, 3, 0, 0] : 0,
                },
              }
            : {}),
        };
      }),

      markLine: {
        silent: true,
        symbol: ["none", "none"],
        animation: false,
        lineStyle: {
          color: "#C62828",
          width: chartType === "bar" ? 3 : 2,
          type: chartType === "bar" ? "dashed" : "solid",
        },
        label: {
          show: true,
          position: "insideEndTop",
          formatter: `Safety ${safetyLine}/38`,
          color: "#B91C1C",
          fontWeight: "bold",
          fontSize: isMobile ? 9 : 11,
          backgroundColor: "rgba(255,247,233,0.88)",
          padding: [2, 4],
          borderRadius: 3,
        },
        data: [{ yAxis: safetyLine }],
      },

      smooth: chartType === "line" ? 0.35 : false,
      connectNulls: false,

      symbol: "circle",
      symbolSize: isMobile ? 5 : 9,
      showSymbol: true,

      label: {
        show: true,
        position: "top",
        distance: isMobile ? 4 : 9,

        formatter: (params) => (params.value == null ? "" : `${params.value}`),

        color: "#87152A",
        fontSize: isMobile ? 8 : 11,
        fontWeight: "bold",

        backgroundColor: "#FFF0D7",
        borderColor: "#DDA56E",
        borderWidth: 1,
        borderRadius: 4,

        padding: isMobile ? [1, 2] : [3, 6],
      },

      labelLayout: {
        hideOverlap: true,
      },

      lineStyle: {
        color: "#87152A",
        width: isMobile ? 2 : 3,
      },

      itemStyle: {
        color: chartType === "bar" ? "#B97738" : "#87152A",

        borderColor: "#F5D58C",
        borderWidth: chartType === "line" ? 2 : 0,

        borderRadius: chartType === "bar" ? [3, 3, 0, 0] : 0,
      },

      areaStyle:
        chartType === "line"
          ? {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,

                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(185,119,56,0.35)",
                  },
                  {
                    offset: 1,
                    color: "rgba(255,240,215,0.02)",
                  },
                ],
              },
            }
          : undefined,

      barMaxWidth: isMobile ? 7 : 22,
      barMinHeight: 2,
      barCategoryGap: "20%",

      z: 3,
    };

    const missedDaysSeries = {
      name: "Missed Days",
      type: "scatter",

      data: isDaily
        ? chartData
            .map((item, index) =>
              item.status === "missed" ? [index, 0] : null,
            )
            .filter(Boolean)
        : [],

      symbol: "circle",
      symbolSize: 1,

      itemStyle: {
        opacity: 0,
      },

      label: {
        show: true,
        formatter: "×",
        position: "top",
        distance: 0,

        color: "#B56D67",
        fontSize: isMobile ? 13 : 16,
        fontWeight: "bold",
      },

      tooltip: {
        show: false,
      },

      z: 10,
    };

    const upcomingDaysSeries = {
      name: "Upcoming Days",
      type: "scatter",

      data: isJourney
        ? chartData
            .map((item, index) =>
              item.status === "upcoming" || item.status === "today"
                ? [index, 0]
                : null,
            )
            .filter(Boolean)
        : [],

      symbol: "emptyCircle",
      symbolSize: isMobile ? 4 : 6,

      itemStyle: {
        color: "#DDA56E",
        opacity: 0.6,
      },

      tooltip: {
        show: false,
      },

      z: 5,
    };

    return {
      backgroundColor: "transparent",

      animationDuration: 700,
      animationDurationUpdate: 400,

      tooltip: {
        trigger: "axis",
        confine: true,

        backgroundColor: "#FFF7E9",
        borderColor: "#DDA56E",
        borderWidth: 1,

        textStyle: {
          color: "#67162A",
          fontSize: isMobile ? 11 : 13,
        },

        formatter: formatTooltip,
      },

      grid: {
        left: isMobile ? 4 : 12,
        right: isMobile ? 4 : 15,
        top: isMobile ? 35 : 45,
        bottom: isMobile ? 8 : 20,
        containLabel: true,
      },

      xAxis: {
        type: "category",
        data: chartData.map((item) => item.label),

        boundaryGap: chartType === "bar",

        axisLine: {
          lineStyle: {
            color: "#C9A77A",
          },
        },

        axisTick: {
          show: false,
        },

        axisLabel: {
          color: "#80533B",
          fontSize: isMobile ? 8 : 11,
          interval: "auto",
          hideOverlap: true,
          formatter: formatXAxis,
        },
      },

      yAxis: {
        type: "value",
        min: 0,
        max: MAX_SCORE,
        splitNumber: isMobile ? 4 : 6,

        axisLabel: {
          color: "#80533B",
          fontSize: isMobile ? 10 : 11,
        },

        splitLine: {
          lineStyle: {
            color: "#E7CFAC",
            type: "dashed",
          },
        },
      },

      // No zoom slider or horizontal scrolling.
      series: [scoreSeries, missedDaysSeries, upcomingDaysSeries],
    };
  };

  // -----------------------------
  // Loading / error states
  // -----------------------------

  if (authLoading || isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-[#87152A]">
        Loading your spiritual progress...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-red-700">Unable to load your progress.</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full bg-[#87152A] px-6 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  // -----------------------------
  // Main UI
  // -----------------------------

  return (
    <main className="relative isolate flex h-full min-h-0 w-full flex-col overflow-hidden">
      {/* Responsive background */}
      <picture className="pointer-events-none absolute inset-0 -z-10">
        <source media="(min-width: 1024px)" srcSet={desktopBg} />

        <img src={mobileBg} alt="" className="h-full w-full object-cover" />
      </picture>

      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-2 px-2 py-2 sm:gap-3 sm:px-4 sm:py-3 lg:px-6">
        {/* Page heading */}
        <header className="shrink-0 text-center">
          <h1 className="font-serif text-xl font-bold text-[#87152A] sm:text-3xl lg:text-4xl">
            My Spiritual Progress
          </h1>

          <p className="mt-1 hidden text-sm text-[#80533B] lg:block">
            Every day is another step in your spiritual journey.
          </p>
        </header>

        {/* Desktop summary cards */}
        <div className="hidden shrink-0 grid-cols-3 gap-3 lg:grid">
          <SummaryCard
            title="Total Attempts"
            value={data?.totalAttempts ?? history.length}
          />

          <SummaryCard
            title="Completed Days"
            value={data?.completedDays ?? history.length}
          />

          <AverageScoreCard score={averageScore} />
        </div>

        {/* Chart section */}
        <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[#DDA56E] bg-[#FFF0D7]/90 p-2 shadow-md backdrop-blur-sm sm:p-3">
          {/* Desktop chart heading */}
          <div className="mb-2 hidden shrink-0 items-center justify-between lg:flex">
            <h2 className="font-serif text-xl font-bold text-[#87152A]">
              Daily Spiritual Growth
            </h2>

            <span className="text-xs font-semibold text-[#B91C1C]">
              Safety {safetyLine} / {MAX_SCORE}
            </span>
          </div>

          {/* Compact toolbar */}
          <div className="mb-2 flex shrink-0 items-center justify-between gap-1.5">
            {/* Chart type controls */}
            <div className="flex shrink-0 items-center rounded-lg border border-[#DDA56E] bg-white/70 p-0.5">
              <button
                type="button"
                onClick={() => navigate("/dashboard/progress-table")}
                className="rounded-md px-2 py-1.5 text-[10px] font-semibold text-[#87152A] hover:bg-[#F6D9A8] sm:px-3 sm:text-xs"
              >
                Table
              </button>

              <span className="mx-0.5 h-4 w-px bg-[#DDA56E]/60" />

              {["line", "bar"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => changeChartType(type)}
                  aria-pressed={chartType === type}
                  className={`rounded-md px-2 py-1.5 text-[10px] font-semibold capitalize transition-all sm:px-3 sm:text-xs ${
                    chartType === type
                      ? "bg-[#87152A] text-[#FFE8A8]"
                      : "text-[#87152A] hover:bg-[#F6D9A8]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Time range controls */}
            <div className="flex min-w-0 items-center gap-1">
              <select
                value={timeRange}
                onChange={(event) => setTimeRange(event.target.value)}
                aria-label="Chart time range"
                className="min-w-0 max-w-[110px] rounded-lg border border-[#DDA56E] bg-[#FFF7E9] px-1.5 py-1.5 text-[10px] font-semibold text-[#87152A] outline-none sm:max-w-[135px] sm:text-xs"
              >
                <option value="journey">Journey</option>
                <option value="1m">1 Month</option>
                <option value="6m">6 Months</option>
                <option value="1y">1 Year</option>
                <option value="2y">2 Years</option>
                <option value="lifetime">Lifetime</option>
                <option value="month">Select Month</option>
              </select>

              {timeRange === "month" && (
                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  aria-label="Select calendar month"
                  className="min-w-0 max-w-[105px] rounded-lg border border-[#DDA56E] bg-[#FFF7E9] px-1 py-1.5 text-[10px] font-semibold text-[#87152A] outline-none sm:max-w-[155px] sm:text-xs"
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

          {/* Month heading and status legend */}
          <div className="mb-1 flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <h3 className="font-serif text-sm font-semibold text-[#87152A] sm:text-base">
              {chartMonthTitle}
            </h3>

            <span className="text-[10px] font-semibold text-[#B91C1C] lg:hidden">
              Safety {safetyLine}/{MAX_SCORE}
            </span>

            {aggregation === "daily" && (
              <div className="flex items-center gap-2 text-[10px] text-[#80533B]">
                <span className="flex items-center gap-1">
                  <span className="font-bold text-[#B56D67]">×</span>
                  Missed
                </span>

                {timeRange === "journey" && (
                  <span className="flex items-center gap-1">
                    <span className="font-bold text-[#B97738]">○</span>
                    Upcoming
                  </span>
                )}
              </div>
            )}

            {aggregation !== "daily" && (
              <span className="text-[10px] text-[#80533B]">
                {aggregation === "weekly"
                  ? "Weekly average scores"
                  : "Monthly average scores"}
              </span>
            )}
          </div>

          {/* Mobile chart */}
          <div className="min-h-0 flex-1 lg:hidden">
            {history.length === 0 ? (
              <EmptyChart />
            ) : (
              <ReactECharts
                key={`mobile-${chartType}-${timeRange}-${selectedMonth}`}
                option={buildChartOption(true)}
                notMerge={true}
                lazyUpdate={true}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                opts={{ renderer: "svg" }}
              />
            )}
          </div>

          {/* Desktop chart */}
          <div className="hidden min-h-0 flex-1 lg:block">
            {history.length === 0 ? (
              <EmptyChart />
            ) : (
              <ReactECharts
                key={`desktop-${chartType}-${timeRange}-${selectedMonth}`}
                option={buildChartOption(false)}
                notMerge={true}
                lazyUpdate={true}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                opts={{ renderer: "svg" }}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

// -----------------------------
// Reusable components
// -----------------------------

const EmptyChart = () => (
  <div className="flex h-full items-center justify-center px-3 text-center text-sm text-[#80533B]">
    Complete your first questionnaire to see your progress.
  </div>
);

const SummaryCard = ({ title, value }) => (
  <div className="rounded-xl border border-[#DDA56E] bg-[#FFF0D7]/90 px-3 py-3 text-center shadow-sm">
    <p className="text-sm font-medium text-[#80533B]">{title}</p>

    <p className="mt-1 font-serif text-3xl font-bold text-[#87152A]">{value}</p>
  </div>
);

const AverageScoreCard = ({ score }) => {
  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border border-[#DDA56E] bg-[#FFF0D7]/90 px-3 py-2 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5D9A9]">
        <ChartNoAxesCombined size={19} className="text-[#87152A]" />
      </div>

      <div className="text-left">
        <p className="text-xs font-medium text-[#80533B]">Average Score</p>

        <p className="font-sans text-2xl font-bold leading-tight text-[#87152A]">
          {score}
          <span className="ml-1 text-sm font-normal text-[#80533B]">/ 38</span>
        </p>
      </div>
    </div>
  );
};

export default MyProgress;
