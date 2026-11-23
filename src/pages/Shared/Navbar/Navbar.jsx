import navbarOm from "../../../assets/omkar_200x200.png";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import loginIcon from "../../../assets/omkar_lotus_transparent_200x200.png";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  House,
  CalendarDays,
  BookOpen,
  //   Layers3,
  //   ChevronDown,
  ChartNoAxesColumnIncreasing,
  //   Bell,
  PencilLine,
  UserRound,
  Menu,
  X,
  //   ChevronRight,
  UserRoundPlus,
  LogOut,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarFailedUrl, setAvatarFailedUrl] = useState(null);
  const navigate = useNavigate();
  const { user, loading, logOut } = useAuth();
  const avatarUrl = user?.photoURL;
  const showAvatar = Boolean(avatarUrl && avatarFailedUrl !== avatarUrl);

  const handleLogOut = () => {
    logOut()
      .then(() => {
        // console.log("user logged out successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const navItems = [
    { name: "Home", path: "/", icon: House },
    {
      name: "Daily Quiz",
      path: "/dashboard/dailyQuestionnaire",
      icon: CalendarDays,
    },
    { name: "Wisdom", path: "/comingSoon", icon: BookOpen },
    // { name: "Journal", path: "/journal", icon: PencilLine },
    // { name: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    user
      ? {
          name: "Dashboard",
          path: "/dashboard",
          icon: LuLayoutDashboard,
        }
      : {
          name: "Journal",
          path: "/journal",
          icon: PencilLine,
        },
    {
      name: "My Progress",
      path: "/dashboard/my-progress",
      icon: ChartNoAxesColumnIncreasing,
    },
  ];

  return (
    <nav className="relative z-50 mx-auto w-[77%] max-w-[1500px] rounded-[30px] border-x border-b border-[#DCA93B] bg-[#100B19]/95 px-5 py-2 text-[#FFF2CF] shadow-[0_4px_25px_rgba(0,0,0,0.5)] backdrop-blur-md lg:px-8">
      <div className="flex items-center justify-between gap-4">
        {/* Brand */}
        <NavLink
          to="/"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={navbarOm}
            alt="Omkar Quest"
            className="
    w-10 h-10
    md:w-12 md:h-12
    object-contain
    drop-shadow-[0_0_8px_rgba(255,180,0,0.5)]
  "
          />

          <div className="flex flex-col">
            <span className="font-serif text-xl leading-tight text-[#FFE59A] md:text-2xl">
              Omkar Quest
            </span>
            <span className="font-serif text-[10px] leading-tight text-[#F7C94D] md:text-xs">
              Daily Spiritual Questionnaire
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 xl:flex">
          {navItems.slice(0, 3).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-3 py-2 font-serif text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-b from-[#FFF0A2] to-[#E5A52C] font-bold text-[#1B1110] shadow-[0_2px_8px_rgba(255,190,55,0.35)]"
                      : "text-[#FFF2CF] hover:bg-[#DCA93B]/15 hover:text-[#FFD86B]"
                  }`
                }
              >
                <Icon size={19} className="text-current" />
                {item.name}
              </NavLink>
            );
          })}

          {/* Learn Dharma Dropdown */}
          {/* <div className="dropdown dropdown-hover">
            <div
              tabIndex={0}
              role="button"
              className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 font-serif text-sm hover:bg-[#DCA93B]/15"
            >
              <Layers3 size={20} className="text-[#F5CC58]" />
              Learn Dharma
              <ChevronDown size={14} />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu z-50 mt-3 w-52 rounded-xl border border-[#DCA93B] bg-[#160D20] p-2 text-[#FFE6A1] shadow-xl"
            >
              <li>
                <NavLink to="/dharma/teachings">Sacred Teachings</NavLink>
              </li>
              <li>
                <NavLink to="/dharma/scriptures">Scriptures</NavLink>
              </li>
              <li>
                <NavLink to="/dharma/practices">Daily Practices</NavLink>
              </li>
            </ul>
          </div> */}

          {navItems.slice(3).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-3 py-2 font-serif text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-b from-[#FFF0A2] to-[#E5A52C] font-bold text-[#1B1110]"
                      : "hover:bg-[#DCA93B]/15 hover:text-[#FFD86B]"
                  }`
                }
              >
                <Icon size={19} className="text-[#F5CC58]" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Notifications */}
          {/* after login  */}
          {/* <button
            type="button"
            aria-label="Notifications"
            className="relative text-[#FFD65B] transition hover:scale-110"
          >
            <Bell size={24} strokeWidth={1.8} />

            <span className="absolute -right-1 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              1
            </span>
          </button> */}

          {/* Profile */}
          {/* <NavLink
            to="/profile"
            aria-label="My profile"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#FFD65B] text-[#FFD65B] transition hover:bg-[#FFD65B]/15 sm:flex"
          >
            <UserRound size={22} strokeWidth={1.6} />
          </NavLink> */}

          {/* before login  */}

          {user ? (
            <>
              <button
                onClick={handleLogOut}
                className="btn hidden sm:flex rounded-full border-[#E6A12B]  bg-gradient-to-b
    from-[#A51C34] via-[#790016] to-[#51000B] text-[#FFF2D6] shadow-[inset_0_2px_4px_rgba(255,210,90,0.2),0_3px_8px_rgba(70,0,0,0.35)] hover:border-[#FFE16A]
    hover:shadow-[0_0_6px_#FFD34D,0_0_15px_rgba(255,166,0,0.85),0_0_28px_rgba(255,125,0,0.45),inset_0_0_8px_rgba(255,200,70,0.3)]"
              >
                <LogOut />
                Sign Out
              </button>
              <NavLink
                to="/dashboard/profile"
                aria-label="My profile"
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#FFD65B] text-[#FFD65B] transition hover:bg-[#FFD65B]/15 sm:flex"
              >
                {showAvatar ? (
                  <img
                    src={avatarUrl}
                    alt="My profile"
                    referrerPolicy="no-referrer"
                    className="h-full w-full rounded-full object-cover"
                    onError={() => setAvatarFailedUrl(avatarUrl)}
                  />
                ) : (
                  <UserRound size={22} strokeWidth={1.6} />
                )}
              </NavLink>
            </>
          ) : (
            <>
              {/* login button  */}
              <button
                type="submit"
                onClick={() => navigate("/login")}
                className="
           hidden  
    group relative
    md:flex h-10 w-33
    items-center justify-center gap-
    overflow-hidden rounded-full
    border-2 border-[#E6A12B]
    bg-gradient-to-b
    from-[#A51C34]
    via-[#790016]
    to-[#51000B]
    px-9
    font-serif text-xl text-[#FFF2D6]
    transition-all duration-300

    shadow-[inset_0_2px_4px_rgba(255,210,90,0.2),0_3px_8px_rgba(70,0,0,0.35)]

    hover:border-[#FFE16A]
    hover:shadow-[0_0_6px_#FFD34D,0_0_15px_rgba(255,166,0,0.85),0_0_28px_rgba(255,125,0,0.45),inset_0_0_8px_rgba(255,200,70,0.3)]

    active:scale-[0.98]
    active:border-[#A92A18]
    active:from-[#650008]
    active:via-[#500005]
    active:to-[#380003]
    active:shadow-[inset_0_3px_9px_rgba(0,0,0,0.65)]
  "
              >
                {/* Inner golden border */}
                <span
                  className="
      pointer-events-none
      absolute inset-[4px]
      rounded-full
     
      transition-colors duration-300
      group-hover:border-[#FFE8A0]
      group-active:border-[#9C2415]
    "
                />

                {/* Lotus Icon */}
                <img
                  src={loginIcon}
                  alt=""
                  className="
      relative z-10
      h-8 w-8 object-contain
      drop-shadow-[0_0_5px_rgba(255,194,50,0.6)]
    "
                />

                {/* Vertical Divider */}
                {/* <span className="relative z-10 h-7 w-px bg-[#F5C45D]/80" /> */}

                {/* Button Text */}
                <span className="relative z-10 whitespace-nowrap">Log In</span>
              </button>

              {/* new account button  */}
              <button
                type="submit"
                onClick={() => navigate("/register")}
                className="
    
        hidden md:flex h-10 w-full
    items-center justify-center gap-2
    rounded-full
    border-2 border-[#E6A12B]
    bg-gradient-to-b
    from-[#A21A35]
    via-[#790018]
    to-[#490009]
    font-serif text-lg font-semibold
    text-[#FFF0D4]
    shadow-[0_4px_10px_rgba(145,55,0,0.25)]
    transition-all duration-300
    hover:border-[#FFE16A]
    hover:shadow-[0_0_8px_#FFD34D,0_0_18px_rgba(255,166,0,0.6)]
    active:scale-[0.98]
    sm:h-10
  "
              >
                <UserRoundPlus size={20} />
                Create Account
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#FFD65B] xl:hidden"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="absolute left-0 right-0 top-full mt-2 max-h-[75dvh] overflow-y-auto rounded-2xl border border-[#DCA93B] bg-[#120B1C]/98 p-4 shadow-2xl xl:hidden"
        >
          <div className="flex flex-col gap-1">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 font-serif text-[#FFE6A1] hover:bg-[#DCA93B]/15"
                >
                  <Icon size={20} />
                  {item.name}
                </NavLink>
              );
            })}

            <div className="my-1 border-t border-[#DCA93B]/30" />

            {/* <span className="flex items-center gap-3 px-4 py-2 font-serif text-[#FFD65B]">
              <Layers3 size={20} />
              Learn Dharma
            </span> */}

            {/* <NavLink
              to="/dharma/teachings"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-10 py-2 font-serif text-[#FFE6A1] hover:bg-[#DCA93B]/15"
            >
              Sacred Teachings
            </NavLink>

            <NavLink
              to="/dharma/scriptures"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-10 py-2 font-serif text-[#FFE6A1] hover:bg-[#DCA93B]/15"
            >
              Scriptures
            </NavLink>

            <NavLink
              to="/dharma/practices"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-10 py-2 font-serif text-[#FFE6A1] hover:bg-[#DCA93B]/15"
            >
              Daily Practices
            </NavLink> */}

            {/* <div className="my-1 border-t border-[#DCA93B]/30" /> */}

            {navItems
              .slice(3)
              .filter((item) => !loading || item.name !== "Dashboard")
              .map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 font-serif text-[#FFE6A1] hover:bg-[#DCA93B]/15"
                  >
                    <Icon size={20} />
                    {item.name}
                  </NavLink>
                );
              })}

            {/* Mobile / tablet account links; desktop actions remain unchanged */}
            {!loading && (
              <>
                <div className="my-2 border-t border-[#DCA93B]/30" />

                {user ? (
                  <>
                    <NavLink
                      to="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 font-serif text-[#FFE6A1] hover:bg-[#DCA93B]/15"
                    >
                      {showAvatar ? (
                        <img
                          src={avatarUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="h-5 w-5 rounded-full object-cover"
                          onError={() => setAvatarFailedUrl(avatarUrl)}
                        />
                      ) : (
                        <UserRound size={20} />
                      )}
                      My Profile
                    </NavLink>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogOut();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border border-[#E6A12B]/50 bg-gradient-to-r from-[#A51C34] to-[#51000B] px-4 py-3 text-left font-serif text-[#FFF2D6] transition hover:border-[#FFE16A] hover:shadow-[0_0_12px_rgba(255,166,0,0.35)]"
                    >
                      <LogOut size={20} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg border border-[#E6A12B]/50 bg-gradient-to-r from-[#A51C34] to-[#51000B] px-4 py-3 font-serif text-[#FFF2D6] transition hover:border-[#FFE16A]"
                    >
                      <img
                        src={loginIcon}
                        alt=""
                        className="h-6 w-6 object-contain"
                      />
                      Log In
                    </NavLink>

                    <NavLink
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg border border-[#E6A12B]/50 bg-gradient-to-r from-[#A21A35] to-[#490009] px-4 py-3 font-serif text-[#FFF2D6] transition hover:border-[#FFE16A]"
                    >
                      <UserRoundPlus size={20} />
                      Create Account
                    </NavLink>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
