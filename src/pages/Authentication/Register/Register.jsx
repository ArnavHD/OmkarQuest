// import { useState } from "react";
// import { Link } from "react-router";
// import { Mail, LockKeyhole, Eye, EyeOff, UserRound, LogIn } from "lucide-react";

// import desktopBg from "../../../assets/OmkarQuest_Temple_Om_2560x1440.png";
// import mobileBg from "../../../assets/OmkarQuest_Mobile_Login_Background_1080x2340_Phone.png";
// import desktopFrame from "../../../assets/OmkarQuest_Login_Field_Laptop_800x1100.png";
// import mobileFrame from "../../../assets/OmkarQuest_Login_Phone_600x840.png";
// import loginIcon from "../../../assets/omkar_lotus_transparent_200x200.png";

// const Register = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = (e) => {
//     e.preventDefault();

//     // Connect your registration service here.
//     // Do not log passwords or credentials.
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

//         {/* Registration frame */}
//         <div
//           className="
//             relative shrink-0
//             w-[min(88vw,calc(78dvh*5/7))]
//             aspect-[5/7]
//             mt-[12dvh]
//             md:mt-0
//             md:-translate-y-8
//             md:w-[min(38vw,calc(99dvh*8/11))]
//             md:aspect-[8/11]
//           "
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
//             <div className="mb-[0%]">
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

//               <div className=" flex items-center gap-2 text-[#D28A24]">
//                 <span className="h-px flex-1 bg-[#D28A24]" />
//                 <span>❖</span>
//                 <span className="h-px flex-1 bg-[#D28A24]" />
//               </div>
//             </div>

//             {/* Heading */}
//             <div className="mb-[2%]">
//               <h2
//                 className="
//                   font-serif font-bold
//                   text-2xl sm:text-3xl
//                   md:text-[clamp(24px,2.3vw,38px)]
//                 "
//               >
//                 Begin Your Journey
//               </h2>
//             </div>

//             {/* Registration form */}
//             <form
//               onSubmit={handleRegister}
//               className="flex w-full flex-col gap-3 sm:gap-4"
//             >
//               {/* Full Name */}
//               <label
//                 className="
//                   flex h-10 items-center gap-3
//                   rounded-xl
//                   border border-[#D88C39]
//                   bg-[#FFF0D3]/65
//                   px-3
//                   focus-within:ring-2
//                   focus-within:ring-[#E9A63D]/60
//                   sm:h-12
//                   md:h-12
//                 "
//               >
//                 <UserRound size={20} className="shrink-0 text-[#6C2416]" />

//                 <input
//                   type="text"
//                   placeholder="Enter your full name"
//                   autoComplete="name"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
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

//               {/* Email */}
//               <label
//                 className="
//                   flex h-10 items-center gap-3
//                   rounded-xl
//                   border border-[#D88C39]
//                   bg-[#FFF0D3]/65
//                   px-3
//                   focus-within:ring-2
//                   focus-within:ring-[#E9A63D]/60
//                   sm:h-12
//                   md:h-12
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
//                   flex h-10 items-center gap-3
//                   rounded-xl
//                   border border-[#D88C39]
//                   bg-[#FFF0D3]/65
//                   px-3
//                   focus-within:ring-2
//                   focus-within:ring-[#E9A63D]/60
//                   sm:h-12
//                   md:h-12
//                 "
//               >
//                 <LockKeyhole size={20} className="shrink-0 text-[#6C2416]" />

//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Create a password"
//                   autoComplete="new-password"
//                   required
//                   minLength={8}
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

//               {/* Terms */}
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
//                     checked={agreeTerms}
//                     onChange={(e) => setAgreeTerms(e.target.checked)}
//                     required
//                     className="
//                       checkbox checkbox-xs
//                       border-[#8D351F]
//                       [--chkbg:#850D24]
//                       [--chkfg:#FFE9B1]
//                     "
//                   />
//                   <span>I agree to the Terms & Privacy Policy</span>
//                 </label>
//               </div>

//               {/* Register button */}
//               <button
//                 type="submit"
//                 className="
//                     flex h-11 w-full
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
//                 {/* <span className="text-2xl text-[#FFD66B]"> */}
//                 <img src={loginIcon} alt="" className="w-11 h-11 md:w-14 md:h-14" />
//                 {/* </span> */}
//                 Create My Account
//               </button>

//               {/* Divider */}
//               <div className="flex items-center gap-3 my-0">
//                 <span className="h-px flex-1 bg-[#D8A46B]" />
//                 <span className="font-serif text-base leading-none">or</span>
//                 <span className="h-px flex-1 bg-[#D8A46B]" />
//               </div>

//               {/* Login button */}
//               <Link
//                 to="/login"
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
//                 <LogIn className="hidden md:block" size={19} />
//                 Already Have an Account? Log In
//               </Link>
//             </form>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Register;

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Mail, LockKeyhole, Eye, EyeOff, UserRound, LogIn } from "lucide-react";

import desktopBg from "../../../assets/OmkarQuest_Temple_Om_2560x1440.png";
import mobileBg from "../../../assets/OmkarQuest_Mobile_Login_Background_1080x2340_Phone.png";
import desktopFrame from "../../../assets/OmkarQuest_Login_Field_Laptop_800x1100.png";
import mobileFrame from "../../../assets/OmkarQuest_Login_Phone_600x840.png";
import loginIcon from "../../../assets/omkar_lotus_transparent_200x200.png";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { createUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      agreeTerms: false,
    },
  });
  const axiosSecure = useAxiosSecure();

  const handleRegister = (data) => {
    // console.log("Form name:", data.name);

    createUser(data.email, data.password)
      .then(async (result) => {
        // Step 1: Save the name in Firebase
        await updateProfile(result.user, {
          displayName: data.name.trim(),
        });

        // Step 2: Refresh the Firebase ID token
        await result.user.getIdToken(true);

        // Step 3: Save user to MongoDB
        const response = await axiosSecure.post("/users");

        // console.log("MongoDB response:", response.data);

        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Registration error:", error);
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

        {/* Registration frame */}
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
            <div className="mb-[0%]">
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

              <div className="flex items-center gap-2 text-[#D28A24]">
                <span className="h-px flex-1 bg-[#D28A24]" />
                <span>❖</span>
                <span className="h-px flex-1 bg-[#D28A24]" />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-[2%]">
              <h2
                className="
                  font-serif font-bold
                  text-2xl sm:text-3xl
                  md:text-[clamp(24px,2.3vw,38px)]
                "
              >
                Begin Your Journey
              </h2>
            </div>

            {/* Registration form */}
            <form
              onSubmit={handleSubmit(handleRegister)}
              noValidate
              className="flex w-full flex-col gap-3 sm:gap-4"
            >
              {/* Full Name */}
              <div className="w-full">
                <label
                  className={`
                    flex h-10 items-center gap-3
                    rounded-xl border
                    ${errors.name ? "border-red-600" : "border-[#D88C39]"}
                    bg-[#FFF0D3]/65
                    px-3
                    focus-within:ring-2
                    focus-within:ring-[#E9A63D]/60
                    sm:h-12
                    md:h-12
                  `}
                >
                  <UserRound size={20} className="shrink-0 text-[#6C2416]" />

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    {...register("name", {
                      required: "Full name is required",
                      validate: (value) =>
                        value.trim().length > 0 || "Full name is required",
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

                {errors.name && (
                  <p
                    role="alert"
                    className="mt-1 text-left text-xs font-medium text-red-600"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="w-full">
                <label
                  className={`
                    flex h-10 items-center gap-3
                    rounded-xl border
                    ${errors.email ? "border-red-600" : "border-[#D88C39]"}
                    bg-[#FFF0D3]/65
                    px-3
                    focus-within:ring-2
                    focus-within:ring-[#E9A63D]/60
                    sm:h-12
                    md:h-12
                  `}
                >
                  <Mail size={20} className="shrink-0 text-[#6C2416]" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
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

                {errors.email && (
                  <p
                    role="alert"
                    className="mt-1 text-left text-xs font-medium text-red-600"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="w-full">
                <label
                  className={`
                    flex h-10 items-center gap-3
                    rounded-xl border
                    ${errors.password ? "border-red-600" : "border-[#D88C39]"}
                    bg-[#FFF0D3]/65
                    px-3
                    focus-within:ring-2
                    focus-within:ring-[#E9A63D]/60
                    sm:h-12
                    md:h-12
                  `}
                >
                  <LockKeyhole size={20} className="shrink-0 text-[#6C2416]" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
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

                {errors.password && (
                  <p
                    role="alert"
                    className="mt-1 text-left text-xs font-medium text-red-600"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              {/* <div className="w-full">
                <label
                  className="
                    flex cursor-pointer items-center gap-2
                    text-left text-[11px]
                    sm:text-xs md:text-sm
                  "
                >
                  <input
                    type="checkbox"
                    {...register("agreeTerms", {
                      required: "You must agree to the Terms & Privacy Policy",
                    })}
                    className="
                      checkbox checkbox-xs
                      border-[#8D351F]
                      [--chkbg:#850D24]
                      [--chkfg:#FFE9B1]
                    "
                  />

                  <span>I agree to the Terms & Privacy Policy</span>
                </label>

                {errors.agreeTerms && (
                  <p
                    role="alert"
                    className="mt-1 text-left text-xs font-medium text-red-600"
                  >
                    {errors.agreeTerms.message}
                  </p>
                )}
              </div> */}

              {/* Register button */}
              <button
                type="submit"
                className="
                  flex h-11 w-full
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
                <img
                  src={loginIcon}
                  alt=""
                  className="w-11 h-11 md:w-14 md:h-14"
                />
                Create My Account
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-0">
                <span className="h-px flex-1 bg-[#D8A46B]" />
                <span className="font-serif text-base leading-none">or</span>
                <span className="h-px flex-1 bg-[#D8A46B]" />
              </div>

              {/* Login button */}
              <Link
                to="/login"
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
                <LogIn className="hidden md:block" size={19} />
                Already Have an Account? Log In
              </Link>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
