import { Outlet } from "react-router";


const AuthLayout = () => {
    return (
      <div
//         className="
//     relative z-10
//     mx-auto flex h-full w-full
//     max-w-[1700px]
//     flex-col items-center justify-center
//     px-4
//     md:flex-row
//     md:justify-end
//     md:px-[5%]
//     lg:px-[6%]
//   "
      >
        <Outlet></Outlet>
      </div>
    );
};

export default AuthLayout;