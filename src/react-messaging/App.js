import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Home from "./components/Home";
import Chatbox from "./pages/Chatbox";
import { useStateValue } from "./reactContext/StateProvider";
import AddGroup from "./components/AddGroup";
import GroupChatbox from "./pages/GroupChatbox";
import AboutChat from "./components/AboutChat";
import AttractionList from "./components/AttractionList";
import PollsList from "./components/PollsList";


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
              <Route exact path= 'group/:userId/' element={<GroupChatbox />} />
              <Route exact path= 'add_group' element={<AddGroup />} />
              <Route exact path= 'aboutChat/:userId/' element={<AboutChat />} />
              <Route exact path= 'attractions/:userId/' element={<AttractionList />} />
              <Route exact path= 'polls/:userId/' element={<PollsList />} />


            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
