
// import { useState } from "react";
// import { Link } from "react-router";
// import { Mail, LockKeyhole, Eye, EyeOff, UserRoundPlus } from "lucide-react";

// import desktopBg from "../../../assets/OmkarQuest_Temple_Om_2560x1440.png";
// import mobileBg from "../../../assets/OmkarQuest_Mobile_Login_Background_1080x2340_Phone.png";
// import desktopFrame from "../../../assets/OmkarQuest_Login_Field_Laptop_800x1100.png";
// import mobileFrame from "../../../assets/OmkarQuest_Login_Phone_600x840.png";
// import loginIcon from "../../../assets/omkar_lotus_transparent_200x200.png";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // Connect your authentication service here.
//     // Avoid logging passwords or other credentials.
//   };

//   return (
//     <main className="relative isolate h-dvh w-full overflow-hidden">
//       {/* Responsive background */}
//       <picture className="absolute inset-0 -z-10">
//         <source media="(min-width: 768px)" srcSet={desktopBg} />
//         <img
//           src={mobileBg}
//           alt=""
//           className="h-full w-full object-fit object-center"
//         />
//       </picture>

//       {/* Main layout */}
//       <div
//         className="
//           relative z-10
//           mx-auto flex min-h-dvh w-full
//           max-w-[1700px]
//           flex-col items-center justify-center
//           px-4 py-8
//           md:flex-row
//           md:justify-end
//           md:px-[5%]
//           lg:px-[6%]
//         "
//       >
//         {/* Desktop spiritual quote */}
//         <div
//           className="
//             hidden
//             md:absolute md:left-[33%] md:top-[23%]
//             md:flex md:w-[25%]
//             md:flex-col md:items-center
//             md:text-center
//             text-[#FFF2DC]
//           "
//         >
//           <div className="mb-5 flex w-full items-center gap-3 text-[#FFD36D]">
//             <span className="h-px flex-1 bg-[#EFC36A]" />
//             <span className="text-2xl">❖</span>
//             <span className="h-px flex-1 bg-[#EFC36A]" />
//           </div>

//           <blockquote
//             className="
//               cormorant-garamond
//               text-xl italic
//               leading-relaxed
//               lg:text-2xl
//               xl:text-3xl
//               drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)]
//             "
//           >
//             “The mind is restless and difficult to control, but it can be
//             trained through practice and detachment.”
//           </blockquote>

//           <p className="mt-4 font-serif text-base lg:text-lg">
//             — Bhagavad Gita (6.35)
//           </p>

//           <div className="mt-5 flex w-full items-center gap-3 text-[#FFD36D]">
//             <span className="h-px flex-1 bg-[#EFC36A]" />
//             <span className="text-2xl">❖</span>
//             <span className="h-px flex-1 bg-[#EFC36A]" />
//           </div>
//         </div>

//         {/* Login frame */}
//         <div
//           className="
//                     relative shrink-0

//                     w-[min(88vw,calc(78dvh*5/7))]
//                     aspect-[5/7]
//                     mt-[12dvh]

//                     md:mt-0
//                     md:-translate-y-8
//                     md:w-[min(38vw,calc(99dvh*8/11))]
//                     md:aspect-[8/11]
//   "
//         >
//           {/* Decorative frame image */}
//           <picture className="absolute inset-0">
//             <source media="(min-width: 768px)" srcSet={desktopFrame} />
//             <img
//               src={mobileFrame}
//               alt=""
//               aria-hidden="true"
//               className="h-full w-full object-fill"
//             />
//           </picture>

//           {/* Form content */}
//           <div
//             className="
//               absolute z-10
//               inset-x-[11%]
//               top-[6%] bottom-[12%]
//               flex flex-col
//               items-center justify-center
//               text-center
//               text-[#4A160E]
//             "
//           >
//             {/* Branding */}
//             <div className="mb-[2%]">
//               {/* <div className="text-3xl text-[#A95C0A]"></div> */}

//               <h1
//                 className="
//                 hidden md:block
//                   cormorant-garamond
//                   text-3xl font-bold
//                   mt-6
//                   sm:text-4xl
//                   md:text-[clamp(28px,2.7vw,48px)]
//                   leading-tight
//                 "
//               >
//                 OmkarQuest
//               </h1>

//               <div className="mt-1 flex items-center gap-2 text-[#D28A24]">
//                 <span className="h-px flex-1 bg-[#D28A24]" />
//                 <span>❖</span>
//                 <span className="h-px flex-1 bg-[#D28A24]" />
//               </div>
//             </div>

//             {/* Welcome */}
//             <div className="mb-[7%]">
//               <h2
//                 className="
//                   font-serif font-bold
//                   text-2xl sm:text-3xl
//                   md:text-[clamp(24px,2.3vw,38px)]
//                 "
//               >
//                 Welcome Back
//               </h2>

//               {/* <p className="mt-1 font-serif text-xs sm:text-sm md:text-base">
//                 Continue your spiritual journey
//               </p> */}
//             </div>

//             {/* Login form */}
//             <form
//               onSubmit={handleLogin}
//               className="flex w-full flex-col gap-3 sm:gap-4"
//             >
//               {/* Email */}
//               <label
//                 className="
//                   flex h-11 items-center gap-3
//                   rounded-xl
//                   border border-[#D88C39]
//                   bg-[#FFF0D3]/65
//                   px-3
//                   focus-within:ring-2
//                   focus-within:ring-[#E9A63D]/60
//                   sm:h-12
//                   md:h-14
//                 "
//               >
//                 <Mail size={20} className="shrink-0 text-[#6C2416]" />

//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="
//                     w-full min-w-0
//                     bg-transparent
//                     text-sm text-[#4A160E]
//                     outline-none
//                     placeholder:text-[#866C5E]
//                     md:text-base
//                   "
//                 />
//               </label>

//               {/* Password */}
//               <label
//                 className="
//                   flex h-11 items-center gap-3
//                   rounded-xl
//                   border border-[#D88C39]
//                   bg-[#FFF0D3]/65
//                   px-3
//                   focus-within:ring-2
//                   focus-within:ring-[#E9A63D]/60
//                   sm:h-12
//                   md:h-14
//                 "
//               >
//                 <LockKeyhole size={20} className="shrink-0 text-[#6C2416]" />

//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   autoComplete="current-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="
//                     w-full min-w-0
//                     bg-transparent
//                     text-sm text-[#4A160E]
//                     outline-none
//                     placeholder:text-[#866C5E]
//                     md:text-base
//                   "
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                   className="shrink-0 text-[#6C2416]"
//                 >
//                   {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//                 </button>
//               </label>

//               {/* Remember / Forgot */}
//               <div
//                 className="
//                   flex items-center justify-between
//                   gap-2 text-[11px]
//                   sm:text-xs md:text-sm
//                 "
//               >
//                 <label className="flex cursor-pointer items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                     className="
//                       checkbox checkbox-xs
//                       border-[#8D351F]
//                       [--chkbg:#850D24]
//                       [--chkfg:#FFE9B1]
//                     "
//                   />
//                   Remember me
//                 </label>

//                 <Link
//                   to="/forgot-password"
//                   className="text-[#B51C13] hover:underline"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               {/* Login button */}
//               <button
//                 type="submit"
//                 className="
//                   mt-2 flex h-12 w-full
//                   items-center justify-center gap-3
//                   rounded-full
//                   border-2 border-[#E6A12B]
//                   bg-gradient-to-b
//                   from-[#A21A35]
//                   via-[#790018]
//                   to-[#490009]
//                   font-serif text-xl
//                   text-[#FFF0D4]
//                   shadow-[0_4px_10px_rgba(145,55,0,0.25)]
//                   transition-all duration-300
//                   hover:scale-[1.02]
//                   hover:shadow-[0_0_18px_rgba(245,174,49,0.6)]
//                   active:scale-[0.98]
//                   sm:h-14
//                 "
//               >
//                 <span className="text-2xl text-[#FFD66B]">
//                   <img src={loginIcon} alt="" className="w-14 h-14" />
//                 </span>
//                 Log In
//               </button>

//               {/* Divider */}
//               <div className="my-1 flex items-center gap-3">
//                 <span className="h-px flex-1 bg-[#D8A46B]" />
//                 <span className="font-serif text-base">or</span>
//                 <span className="h-px flex-1 bg-[#D8A46B]" />
//               </div>

//               {/* Register button */}
//               <Link
//                 to="/register"
//                 className="
//                   flex h-11 w-full
//                   items-center justify-center gap-2
//                   rounded-full
//                   border border-[#A62B1A]
//                   bg-[#FFF1D7]/30
//                   font-serif text-sm font-semibold
//                   text-[#5A1C13]
//                   transition-all duration-300
//                   hover:bg-[#FFE0A3]/70
//                   sm:h-12 sm:text-base
//                 "
//               >
//                 <UserRoundPlus size={19} />
//                 Create New Account
//               </Link>
//             </form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Login;



import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Mail, LockKeyhole, Eye, EyeOff, UserRoundPlus } from "lucide-react";

import desktopBg from "../../../assets/OmkarQuest_Temple_Om_2560x1440.png";
import mobileBg from "../../../assets/OmkarQuest_Mobile_Login_Background_1080x2340_Phone.png";
import desktopFrame from "../../../assets/OmkarQuest_Login_Field_Laptop_800x1100.png";
import mobileFrame from "../../../assets/OmkarQuest_Login_Phone_600x840.png";
import loginIcon from "../../../assets/omkar_lotus_transparent_200x200.png";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const locatoin = useLocation();
const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    criteriaMode: "all",
  });

  const handleLogin = (data) => {
    // Connect your authentication service here.
    // data.email and data.password contain the form values.
    // Avoid logging passwords or credentials.
    signIn(data.email, data.password)
    .then(result =>{
        // console.log(result.user);
        navigate(from, {replace: true})
    })
    .catch(error =>{
        console.error(error);
    });
  };



  return (
    <main className="relative isolate h-dvh w-full overflow-hidden">
      {/* Responsive background */}
      <picture className="absolute inset-0 -z-10">
        <source media="(min-width: 768px)" srcSet={desktopBg} />

        <img
          src={mobileBg}
          alt=""
          className="h-full w-full object-fit object-center"
        />
      </picture>

      {/* Main layout */}
      <div
        className="
          relative z-10
          mx-auto flex min-h-dvh w-full
          max-w-[1700px]
          flex-col items-center justify-center
          px-4 py-8
          md:flex-row
          md:justify-end
          md:px-[5%]
          lg:px-[6%]
        "
      >
        {/* Desktop spiritual quote */}
        <div
          className="
            hidden
            md:absolute md:left-[33%] md:top-[23%]
            md:flex md:w-[25%]
            md:flex-col md:items-center
            md:text-center
            text-[#FFF2DC]
          "
        >
          <div className="mb-5 flex w-full items-center gap-3 text-[#FFD36D]">
            <span className="h-px flex-1 bg-[#EFC36A]" />
            <span className="text-2xl">❖</span>
            <span className="h-px flex-1 bg-[#EFC36A]" />
          </div>

          <blockquote
            className="
              cormorant-garamond
              text-xl italic
              leading-relaxed
              lg:text-2xl
              xl:text-3xl
              drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)]
            "
          >
            “The mind is restless and difficult to control, but it can be
            trained through practice and detachment.”
          </blockquote>

          <p className="mt-4 font-serif text-base lg:text-lg">
            — Bhagavad Gita (6.35)
          </p>

          <div className="mt-5 flex w-full items-center gap-3 text-[#FFD36D]">
            <span className="h-px flex-1 bg-[#EFC36A]" />
            <span className="text-2xl">❖</span>
            <span className="h-px flex-1 bg-[#EFC36A]" />
          </div>
        </div>

        {/* Login frame */}
        <div
          className="
            relative shrink-0

            w-[min(88vw,calc(78dvh*5/7))]
            aspect-[5/7]
            mt-[12dvh]

            md:mt-0
            md:-translate-y-8
            md:w-[min(38vw,calc(99dvh*8/11))]
            md:aspect-[8/11]
          "
        >
          {/* Decorative frame image */}
          <picture className="absolute inset-0">
            <source media="(min-width: 768px)" srcSet={desktopFrame} />

            <img
              src={mobileFrame}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-fill"
            />
          </picture>

          {/* Form content */}
          <div
            className="
              absolute z-10
              inset-x-[11%]
              top-[6%] bottom-[12%]
              flex flex-col
              items-center justify-center
              text-center
              text-[#4A160E]
            "
          >
            {/* Branding */}
            <div className="mb-[2%]">
              <h1
                className="
                  hidden md:block
                  cormorant-garamond
                  text-3xl font-bold
                  mt-6
                  sm:text-4xl
                  md:text-[clamp(28px,2.7vw,48px)]
                  leading-tight
                "
              >
                OmkarQuest
              </h1>

              <div className="mt-1 flex items-center gap-2 text-[#D28A24]">
                <span className="h-px flex-1 bg-[#D28A24]" />
                <span>❖</span>
                <span className="h-px flex-1 bg-[#D28A24]" />
              </div>
            </div>

            {/* Welcome */}
            <div className="mb-[7%]">
              <h2
                className="
                  font-serif font-bold
                  text-2xl sm:text-3xl
                  md:text-[clamp(24px,2.3vw,38px)]
                "
              >
                Welcome Back
              </h2>
            </div>

            {/* Login form */}
            <form
              onSubmit={handleSubmit(handleLogin)}
              noValidate
              className="flex w-full flex-col sm:gap-0"
            >
              {/* Email */}
              <div className="w-full mb-2 sm:mb-4">
                <label
                  className={`
                    flex h-11 items-center gap-3
                    rounded-xl
                    border
                    ${errors.email ? "border-red-600" : "border-[#D88C39]"}
                    bg-[#FFF0D3]/65
                    px-3
                    focus-within:ring-2
                    focus-within:ring-[#E9A63D]/60
                    sm:h-12
                    md:h-14
                  `}
                >
                  <Mail size={20} className="shrink-0 text-[#6C2416]" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className="
                      w-full min-w-0
                      bg-transparent
                      text-sm text-[#4A160E]
                      outline-none
                      placeholder:text-[#866C5E]
                      md:text-base
                    "
                  />
                </label>

                {/* Email error */}
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="
                      mt-1 text-left
                      text-xs font-medium
                      text-red-600
                    "
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="w-full mb-2">
                <label
                  className={`
                    flex h-11 items-center gap-3
                    rounded-xl
                    border
                    ${errors.password ? "border-red-600" : "border-[#D88C39]"}
                    bg-[#FFF0D3]/65
                    px-3
                    focus-within:ring-2
                    focus-within:ring-[#E9A63D]/60
                    sm:h-12
                    md:h-14
                  `}
                >
                  <LockKeyhole size={20} className="shrink-0 text-[#6C2416]" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="
                      w-full min-w-0
                      bg-transparent
                      text-sm text-[#4A160E]
                      outline-none
                      placeholder:text-[#866C5E]
                      md:text-base
                    "
                  />

                  {/* Password visibility */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="shrink-0 text-[#6C2416]"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </label>

                {/* Password errors */}
                {errors.password && (
                  <p className="mt-1 text-left text-xs font-medium text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember / Forgot */}
              <div
                className="
                  flex items-center justify-between
                  gap-2 text-[11px] mb-3
                  sm:text-xs md:text-sm
                "
              >
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="
                      checkbox checkbox-xs
                      border-[#8D351F]
                      [--chkbg:#850D24]
                      [--chkfg:#FFE9B1]
                    "
                  />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[#B51C13] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="
                  sm:mt-2 flex h-12 w-full mb-0
                  items-center justify-center gap-3
                  rounded-full
                  border-2 border-[#E6A12B]
                  bg-gradient-to-b
                  from-[#A21A35]
                  via-[#790018]
                  to-[#490009]
                  font-serif text-xl
                  text-[#FFF0D4]
                  shadow-[0_4px_10px_rgba(145,55,0,0.25)]
                  transition-all duration-300
                  hover:scale-[1.02]
                  hover:shadow-[0_0_18px_rgba(245,174,49,0.6)]
                  active:scale-[0.98]
                  sm:h-14
                "
              >
                <span className="text-2xl text-[#FFD66B]">
                  <img src={loginIcon} alt="" className="w-12 h-12 sm:w-14 sm:h-14" />
                </span>
                Log In
              </button>
              <div className="flex justify-start p-0 items-center">
                <p>
                  <small>
                    New to this webstie?{" "}
                    <Link to={"/register"} className="btn btn-link text-xs p-0">
                      Create new Account
                    </Link>
                  </small>
                </p>
              </div>

              {/* Divider */}
              <div className="my-1 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#D8A46B]" />
                <span className="font-serif text-base">or</span>
                <span className="h-px flex-1 bg-[#D8A46B]" />
              </div>

              {/* Register button */}
              {/* <Link
                to="/register"
                className="
                  flex h-11 w-full
                  items-center justify-center gap-2
                  rounded-full
                  border border-[#A62B1A]
                  bg-[#FFF1D7]/30
                  font-serif text-sm font-semibold
                  text-[#5A1C13]
                  transition-all duration-300
                  hover:bg-[#FFE0A3]/70
                  sm:h-12 sm:text-base
                "
              >
                <UserRoundPlus size={19} />
                Create New Account
              </Link> */}
            </form>
              <SocialLogin></SocialLogin>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
