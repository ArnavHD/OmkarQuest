import { useEffect, useState } from "react";

import QuizGroupSelection from "../QuizGroupSelection/QuizGroupSelection";
import QuizContent from "../QuizContent/QuizContent";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

import desktopBg from "../../../assets/DashboardImages/laptopDashBg.png";
import mobileBg from "../../../assets/DashboardImages/dashBoardPhoneBg.png";

const DailyQuestionnaire = () => {
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await axiosSecure.get("/users/me");

        if (active) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [axiosSecure]);

  return (
    <main className="relative isolate min-h-dvh w-full overflow-x-hidden">
      {/* Mobile background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat md:hidden"
        style={{
          backgroundImage: `url(${mobileBg})`,
        }}
      />

      {/* Desktop background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{
          backgroundImage: `url(${desktopBg})`,
        }}
      />

      {/* Page content */}
      <div className="relative z-10 mx-auto flex min-h-dvh w-full items-start justify-center px-3 py-6 sm:px-6 md:px-8 lg:px-10">
        {loading ? (
          <p className="text-center text-amber-100">Loading questionnaire...</p>
        ) : !profile ? (
          <p className="text-center text-amber-100">
            Unable to load your profile.
          </p>
        ) : profile.quizGroup === null ? (
          <QuizGroupSelection onSelected={setProfile} />
        ) : (
          <QuizContent />
        )}
      </div>
    </main>
  );
};

export default DailyQuestionnaire;
