/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import Link from "next/link";
import MobileNav from "../../molecule/MobileNav/MobileNav";
import DashboardLogo from "@/components/molecule/dashboardLogo/dashboardLogo";
import DashboardAvatar from "@/components/molecule/dashboardAvatar/dashboardAvatar";

export default function TopDashboard() {
  return (
    <header className="main-header">
      {/* Header Lower */}
      <div className="header-lower">
        <div className="container2">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-container flex justify-space align-center">
                {/* Logo Box */}
                <div className="logo-box flex">
                  <DashboardLogo color="dark" />
                </div>
                <div className="nav-outer flex align-center"></div>
                <div
                  className="mobile-nav-toggler mobile-button"
                  onClick={() =>
                    document.body.classList.add("mobile-menu-visible")
                  }
                >
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Header Lower */}
      {/* Mobile Menu  */}
      <div
        className="close-btn"
        onClick={() => document.body.classList.remove("mobile-menu-visible")}
      >
        <span className="icon flaticon-cancel-1" />
      </div>
      <div className="mobile-menu">
        <div
          className="menu-backdrop"
          onClick={() => document.body.classList.remove("mobile-menu-visible")}
        />
        <nav className="menu-box">
          <div className="nav-logo">
            <DashboardLogo color="dark" />
          </div>
          <div className="bottom-canvas">
            <DashboardAvatar />
            <MobileNav />
          </div>
        </nav>
      </div>
      {/* End Mobile Menu */}
    </header>
  );
}

