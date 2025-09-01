import React from "react";
import { Outlet } from "react-router-dom";
import { Header2 } from "../layouts/Header2";
import { Footer } from "../layouts/Footer";

const MainLayout2 = () => {
    return (
      <div className="min-h-screen flex flex-col">
        <Header2 />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer className="mt-auto" />
      </div>
    );
  };
  

export default MainLayout2;