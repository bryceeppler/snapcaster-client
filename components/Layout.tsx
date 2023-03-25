import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type Props = {};

export default function Layout({ children }: React.PropsWithChildren<Props>) {
  return (
    <>
     <div
        className="header-bg"
      ></div>        
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
