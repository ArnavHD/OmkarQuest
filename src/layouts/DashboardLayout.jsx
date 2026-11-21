// import React from "react";
// import { NavLink, Outlet } from "react-router";

// const DashboardLayout = () => {
//   return (
//     <div className="drawer lg:drawer-open">
//       <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
//       <div className="drawer-content flex flex-col ">
//         {/* Navbar */}
//         <div className="navbar bg-base-300 w-full lg:hidden">
//           <div className="flex-none ">
//             <label
//               htmlFor="my-drawer-3"
//               aria-label="open sidebar"
//               className="btn btn-square btn-ghost drawer-button"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 className="inline-block h-6 w-6 stroke-current"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 ></path>
//               </svg>
//             </label>
//           </div>
//           <div className="mx-2 flex-1 px-2 ">Dashboard</div>
//         </div>
//         {/* Page content here */}
//        <Outlet></Outlet>
//         {/* Page content here */}
//       </div>
//       <div className="drawer-side">
//         <label
//           htmlFor="my-drawer-3"
//           aria-label="close sidebar"
//           className="drawer-overlay"
//         ></label>
//         <ul className="menu bg-base-200 min-h-full w-80 p-4">
//           {/* Sidebar content here */}
//           <li>
//             <NavLink to={"/"}>Home</NavLink>
//           </li>
//           <li>
//             <a>Sidebar Item 2 x2</a>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


import { NavLink, Outlet } from "react-router";
import sidebarbg from "../assets/DashboardImages/DashboardSidebar.png"
import DashboardLogo from "../pages/Dashboard/DashboardLogo/DashboardLogo";
import { ArrowLeft, BookOpenText, Calculator, ChartColumnIncreasing, ChartNoAxesCombined, ClipboardCheck, House, UserRound } from "lucide-react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const DashboardLayout = () => {

const { user, loading: authLoading } = useAuth();
const axiosSecure = useAxiosSecure();

const { data: profile, isPending: profileLoading } = useQuery({
  queryKey: ["userProfile", user?.uid],
  enabled: !authLoading && !!user?.uid,
  queryFn: async () => {
    const response = await axiosSecure.get("/users/me");
    return response.data;
  },
});

const isOwner = profile?.role === "owner";

  return (
    <div className="drawer h-dvh overflow-hidden lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        {/* Mobile navbar */}
        <div className="navbar w-full shrink-0 bg-base-300 lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost drawer-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          <div className="mx-2 flex-1 px-2">Dashboard</div>
        </div>

        {/* Dashboard page */}
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      {/* Sidebar */}
      <div className="drawer-side z-50 lg:h-dvh">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <div className="relative min-h-full w-[min(80vw,320px)] lg:w-80 overflow-hidden lg:h-full">
          {/* Background image — mobile and desktop */}
          <img
            src={sidebarbg}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-fill"
          />

          {/* Sidebar navigation */}

          <div className="relative z-10 flex h-full min-h-0 w-full flex-col px-4 py-5">
            {/* Dashboard Logo */}
            <div className="shrink-0">
              <DashboardLogo />
            </div>

            {/* Navigation Heading */}
            <div className="mb-4 px-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E9BE77]">
                Spiritual Journey
              </p>

              <div className="mt-2 h-px w-full bg-gradient-to-r from-[#DDA56E]/70 to-transparent" />
            </div>

            {/* Navigation Links */}

            <nav className="flex min-h-0 flex-1 flex-col gap-1.5 ">
              {profileLoading ? (
                <div className="flex justify-center py-5">
                  <span className="loading loading-spinner text-[#E9BE77]" />
                </div>
              ) : (
                <>
                  {[
                    {
                      to: "/dashboard",
                      label: "Dashboard",
                      icon: House,
                      end: true,
                    },
                    {
                      to: "/dashboard/dailyQuestionnaire",
                      label: "Daily Questionnaire",
                      icon: BookOpenText,
                    },
                    {
                      to: "/dashboard/my-progress",
                      label: "My Progress",
                      icon: ChartNoAxesCombined,
                    },
                    {
                      to: "/dashboard/owner-math",
                      label: "Mathematics Challenge",
                      icon: Calculator,
                      ownerOnly: true,
                    },
                    {
                      to: "/dashboard/owner-reflection",
                      label: "Daily Reflection",
                      icon: ClipboardCheck,
                      ownerOnly: true,
                    },
                    {
                      to: "/dashboard/overall-progress",
                      label: "Overall Progress",
                      icon: ChartColumnIncreasing,
                      ownerOnly: true,
                    },
                    {
                      to: "/dashboard/profile",
                      label: "My Profile",
                      icon: UserRound,
                    },
                  ]
                    .filter((item) => !item.ownerOnly || isOwner)
                    .map(({ to, label, icon: Icon, end }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                          `group flex shrink-0 items-center gap-3 rounded-lg border
         px-3.5 py-2 text-[15px] font-medium
         transition-all duration-300
         ${
           isActive
             ? "border-[#F0C67B] bg-gradient-to-r from-[#F8D99C] to-[#DDA56E] text-[#651225] shadow-[0_3px_12px_rgba(0,0,0,0.15)]"
             : "border-transparent text-[#F9E2B8] hover:border-[#DDA56E]/40 hover:bg-[#FFF0D7]/10 hover:text-[#FFE8A8]"
         }`
                        }
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.8}
                          className="shrink-0 transition-transform duration-300 group-hover:scale-105"
                        />

                        <span className="font-serif leading-5">{label}</span>
                      </NavLink>
                    ))}
                </>
              )}
            </nav>

            {/* Bottom Section */}
            {/* <div className="mt-auto shrink-0 pt-5">
              <div className="mb-4 h-px bg-gradient-to-r from-transparent via-[#DDA56E]/60 to-transparent" />

              <NavLink
                to="/"
                className="group flex items-center gap-3 rounded-xl border border-[#DDA56E]/30 bg-[#FFF0D7]/5 px-4 py-3 text-[#F9E2B8] transition-all duration-300 hover:border-[#DDA56E] hover:bg-[#FFF0D7]/15"
              >
                <ArrowLeft
                  size={19}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />

                <span className="font-serif text-[17px]">Back to Home</span>
              </NavLink>

              <p className="mt-5 text-center font-serif text-xs italic tracking-wide text-[#E9BE77]/75">
                ॐ Peace • Wisdom • Growth
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
