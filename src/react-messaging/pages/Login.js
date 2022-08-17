import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { actionTypes } from "../reactContext/Reducer";
import { useStateValue } from "../reactContext/StateProvider";

import "./Login.css";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../../firebase";
import { setDoc, doc, Timestamp, updateDoc } from "firebase/firestore";

function Login() {
  const [{}, dispatch] = useStateValue();

  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

  const { email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setData({ ...data, error: null, loading: true });

    if (!email || !password) {
      setData({ ...data, error: "All fields are required!" });
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });

      setData({
        email: "",
        password: "",
        error: null,
        loading: false,
      });

      dispatch({
        type: actionTypes.SET_USER,
        user: result.user,
      });

      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      setData({ ...data, error: errorMessage, loading: false });
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__text">
          <div className="login__title">ACCOUNT LOGIN</div>
          <form className="login__form" onSubmit={handleSubmit}>
            <div className="input__container">
              <label htmlFor="email" className="form__label">
                Email
              </label>

              <div className="input__box">
                <input
                  type="text"
                  name="email"
                  placeholder="abc@xyz.com"
                  value={email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input__container">
              <label htmlFor="passowrd" className="form__label">
                Password
              </label>
              <div className="input__box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="btn__container">
              <Button type="submit" disabled={loading}>
                <LockOpenIcon /> {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>

          <div className="link__signup">
            Don't have an account?
            <Link to="/signup">SignUp</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
