import React, { useState } from "react";
import { Button } from "@material-ui/core";
import "./Signup.css";
import LockIcon from "@material-ui/icons/Lock";
import { Link, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

function SignUp() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

  const { name, email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setData({ ...data, error: null, loading: true });

    if (!name || !email || !password) {
      setData({ ...data, error: "All fields are required!" });
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        password,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: false,
      });

      setData({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
      });

      navigate("/login");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      setData({ ...data, error: errorMessage, loading: false });
    }
  };
  return (
    <div className="signup">
      <div className="signup__container">
        <div className="signup__text">
          <div className="signup__title">REGISTER ACCOUNT</div>
          <form className="signup__form" onSubmit={handleSubmit}>
            <div className="input__container">
              <label htmlFor="name" className="form__label">
                Name
              </label>
              <div className="input__box">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={handleChange}
                />
              </div>
            </div>

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

            {error ? <p className="error">{error}</p> : null}
            <div className="btn__container">
              <Button type="submit" disabled={loading}>
                <LockIcon /> {loading ? "Registering..." : "Create account"}
              </Button>
            </div>
          </form>

          <div className="link__login">
            Already have an account?
            <Link to="/login">LogIn</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
