import React from "react";
import Sidebar from "./Sidebar";
import "./Home.css";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Link,
    Outlet,
    useParams,
    NavLink,
    useNavigate,
    useLocation,
  } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <div className="home__body">
        <Sidebar />
        <Outlet />
      </div>
      </div>

  );
}

export default Home;
