// import { useState } from "react";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";

// const QuizGroupSelection = ({ onSelected }) => {
//   const axiosSecure = useAxiosSecure();

//   const [quizGroup, setQuizGroup] = useState("male");
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const handleContinue = async () => {
//     setSaving(true);
//     setError("");

//     try {
//       const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

//       const response = await axiosSecure.patch("/users/me/quiz-group", {
//         quizGroup,
//         timeZone,
//       });

//       console.log("Questionnaire selection:", response.data);

//       const profileResponse = await axiosSecure.get("/users/me");

//       onSelected(profileResponse.data);
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Failed to save questionnaire selection",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-md p-6">
//       <h2 className="mb-4 text-2xl font-semibold">Choose Your Questionnaire</h2>

//       <p className="mb-6">
//         Select the questionnaire you would like to answer daily.
//       </p>

//       <div className="mb-6 space-y-3">
//         <label className="flex items-center gap-3">
//           <input
//             type="radio"
//             name="quizGroup"
//             value="male"
//             checked={quizGroup === "male"}
//             onChange={() => setQuizGroup("male")}
//           />
//           Male Questionnaire
//         </label>

//         <label className="flex items-center gap-3">
//           <input
//             type="radio"
//             name="quizGroup"
//             value="female"
//             checked={quizGroup === "female"}
//             onChange={() => setQuizGroup("female")}
//           />
//           Female Questionnaire
//         </label>
//       </div>

//       {error && <p className="mb-4 text-red-600">{error}</p>}

//       <button
//         type="button"
//         onClick={handleContinue}
//         disabled={saving}
//         className="rounded-lg bg-amber-700 px-6 py-3 text-white disabled:opacity-50"
//       >
//         {saving ? "Saving..." : "Continue"}
//       </button>
//     </div>
//   );
// };

// export default QuizGroupSelection;


import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// Adjust these paths to match your existing quiz images
import desktopBg from "../../../assets/DashboardImages/quizBackLaptop.png";
import mobileBg from "../../../assets/DashboardImages/quizBack_1000x1300.png";

const QuizGroupSelection = ({ onSelected }) => {
  const axiosSecure = useAxiosSecure();

  const [quizGroup, setQuizGroup] = useState("male");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    setSaving(true);
    setError("");

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await axiosSecure.patch("/users/me/quiz-group", {
        quizGroup,
        timeZone,
      });

      console.log("Questionnaire selection:", response.data);

      const profileResponse = await axiosSecure.get("/users/me");

      onSelected(profileResponse.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save questionnaire selection",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="relative isolate lg:justify-start lg:pl-[8%] lg:pt-[10%] flex h-full min-h-0 w-full items-center justify-center overflow-hidden px-4 py-6">
      {/* Responsive background images */}
      {/* <picture className="pointer-events-none absolute inset-0 -z-10">
        <source media="(min-width: 1024px)" srcSet={desktopBg} />

        <img src={mobileBg} alt="" className="h-full w-full object-cover" />
      </picture> */}

      {/* Questionnaire selection card */}
      <div className="w-full max-w-md rounded-3xl border border-[#DDA56E] bg-[#FFF0D7]/90 px-6 py-8 shadow-[0_15px_45px_rgba(65,10,25,0.22)] backdrop-blur-md sm:px-9">
        {/* Heading */}
        <div className="mb-7 text-center">
          <h2
            className="font-serif text-3xl font-bold text-[#87152A] sm:text-4xl"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Tell us your Gender
          </h2>

          {/* Decorative divider */}
          <div className="my-4 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C18A43]" />

            <span className="text-xl text-[#B97738]">✦</span>

            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C18A43]" />
          </div>

          <p className="text-sm leading-relaxed text-[#80533B]">
            Select the questionnaire you would like to answer daily.
          </p>
        </div>

        {/* Selection options */}
        <div className="space-y-4">
          {[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ].map((option) => {
            const selected = quizGroup === option.value;

            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-300 ${
                  selected
                    ? "border-[#B97738] bg-[#F6D9A8] shadow-sm"
                    : "border-[#DDA56E]/50 bg-white/45 hover:border-[#B97738] hover:bg-[#F9E6C6]"
                }`}
              >
                <input
                  type="radio"
                  name="quizGroup"
                  value={option.value}
                  checked={selected}
                  onChange={() => setQuizGroup(option.value)}
                  disabled={saving}
                  className="radio radio-sm border-[#B97738] checked:border-[#87152A] checked:bg-[#87152A]"
                />

                <span className="font-serif text-lg font-semibold text-[#67162A]">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <p role="alert" className="mt-5 text-center text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Continue button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={saving}
          className="mt-7 w-full cursor-pointer rounded-xl border border-[#E7BD75] bg-gradient-to-r from-[#87152A] to-[#601024] px-6 py-3.5 font-semibold tracking-wide text-[#FFE8A8] shadow-md transition-all duration-300 hover:from-[#A12440] hover:to-[#75162F] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Continue"}
        </button>

        {/* Bottom decoration */}
        <p className="mt-6 text-center font-serif text-sm italic text-[#986B42]">
          A journey of reflection and growth
        </p>
      </div>
    </main>
  );
};

export default QuizGroupSelection;

