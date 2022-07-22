import "./App.css";
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
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Home from "./components/Home";
import Chatbox from "./pages/Chatbox";
import { useStateValue } from "./reactContext/StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <>
      {!user ? (
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate replace to="/login" />} />
          </Routes>
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />}>
              <Route exact path= 'chat/:userId/' element={<Chatbox />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {/* <Route path="/chat/:userId" element={<Chatbox />} /> */}

            {/* <Route path="/myapp" element={<Navigate replace to="/" />} /> */}
            {/* <Route path="/navigation" element={<Navigate to="/" />} /> */}
          </Routes>
        </Router>
      )}
    </>

    // <Router>
    //   <Routes>
    //     {/* <Route exact path="/" element={<Home />} /> */}
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/signup" element={<SignUp />} />
    //     <Route path="/myapp" element={<Navigate replace to="/" />} />
    //     <Route path="/navigation" element={<Navigate to="/" />} />
    //   </Routes>
    // </Router>
  );
}

export default App;
