import React, { useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: ""
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(signedInUser);
        console.log(displayName, photoURL, email);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      });
  };
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(res => {
        const signedOutUser = {
          name: "",
          photo: "",
          email: "",
          password: "",
          error: "",
          isSignedIn: false,
          isValid: false,
          existingUser: false
        };
        setUser(signedOutUser);
      })
      .catch(err => {});
  };
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = myPass => /\d/.test(myPass);

  const switchForm = e => {
    const createdUser = { ...user };
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
    console.log(e.target.checked);
  };
  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    let isValid = true;
    if (e.target.name === "email") {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === "password") {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  };
  const createAccount = event => {
    if (user.isValid) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.error = err.message;
          setUser(createdUser);
        });
    } else {
      console.log("form is not valid", {
        email: user.email,
        password: user.password
      });
    }
    event.preventDefault();
    event.target.reset();
  };

  const signInUser = event => {
    if (user.isValid) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message, user.email, user.password);
          const createdUser = { ...user };
          createdUser.error = err.message;
          setUser(createdUser);
        });
    }
    event.preventDefault();
    event.target.reset();
  };
  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      {user.isSignedIn && (
        <div>
          <p>Welcome: {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="userPhoto" />
        </div>
      )}

      <h1>Our Own Authentication</h1>
      <input
        type="checkbox"
        name="switchForm"
        onChange={switchForm}
        id="switchForm"
      />
      <label htmlFor="switchForm">Existing User ?</label>
      {user.error && <p style={{ color: "red" }}>{user.error}</p>}
      <form
        onSubmit={signInUser}
        style={{ display: user.existingUser ? "block" : "none" }}
      >
        <input
          type="text"
          onBlur={handleChange}
          name="email"
          placeholder="put your email here"
          required
        />
        <br />
        <input
          type="password"
          onBlur={handleChange}
          name="password"
          placeholder="your password"
          required
        />
        <br />
        <input type="submit" value="Sign In " />
      </form>
      <form
        onSubmit={createAccount}
        style={{ display: user.existingUser ? "none" : "block" }}
      >
        <input
          type="text"
          onBlur={handleChange}
          name="name"
          placeholder="put your name here"
          required
        />
        <br />
        <input
          type="text"
          onBlur={handleChange}
          name="email"
          placeholder="put your email here"
          required
        />
        <br />
        <input
          type="password"
          onBlur={handleChange}
          name="password"
          placeholder="your password"
          required
        />
        <br />
        <input type="submit" value="create accout" />
      </form>
    </div>
  );
}

export default App;
