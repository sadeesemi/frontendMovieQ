import React from "react";
import { Outlet } from "react-router-dom";
import { Header1 } from "../layouts/Header1";
import { Footer } from "../layouts/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header1/>
      
      <div className="flex-grow">
        <Outlet />
      </div>


      <div className="mt-auto">
      <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
