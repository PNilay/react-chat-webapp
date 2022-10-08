import React from "react";
import Sidebar from "./Sidebar";
import "./Home.css";
import { useEffect, useState } from "react";

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
  const width = window.innerWidth;
  const location = useLocation();


  useEffect(() => {
    console.log("LOcation: ",location.pathname == "/");
  }, []);


  return (
    <div className="home">
      <div className="home__body">
          <Sidebar isDisplay={location.pathname == "/" }/>
          <Outlet />
      </div>
    </div>
  );
}

export default Home;
