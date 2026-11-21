// import React from 'react';

// import { UserRoundPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";

const SocialLogin = () => {
    const { signInWithGoogle } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || "/";

    const handleGoogleSignIn = () =>{
        signInWithGoogle()
        .then(result =>{
            console.log(result.user);

            navigate(from, {replace: true})
        })
        .catch(error =>{
            console.error(error);
        })
    }
    return (
      <button
        onClick={handleGoogleSignIn}
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
        {/* <UserRoundPlus size={19} /> */}
        <FcGoogle size={19} />
        Login with Google
      </button>
    );
};

export default SocialLogin;