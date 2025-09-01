 import React from "react";
import { Outlet } from "react-router-dom";
import { Header3 } from "../layouts/Header3";
import { Footer } from "../layouts/Footer";

const MainLayout3 = () => {
    return (
     <div className="min-h-screen flex flex-col bg-black text-white">
      <Header3 />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer className="mt-auto w-full" />
    </div>
    );
  };
  

export default MainLayout3;