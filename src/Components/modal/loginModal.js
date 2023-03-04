import { useRef, useState } from "react";
import "./loginModal.css";

export default function LoginModal({
  showLoginModal,
  setShowLoginModal,
  setUserId,
  setUserLoggedIn,
  getToDo,
  setUserAlias,
  setUserToken,
}) {
  const username = useRef();
  const password = useRef();

  //State for login
  const [invalidLogin, setInvalidLogin] = useState(false);

  //Conditionally render modal
  const loginModal = showLoginModal
    ? "modal loginModalVisible"
    : "modal loginModalHidden";
  //Conditionally set invalid login text
  const invalidLoginText = invalidLogin
    ? "invalidLoginVisible"
    : "invalidLoginHidden";

  //function to check credentials and login user
  function handleLoginUser() {
    const loginData = {
      username: username.current?.value,
      password: password.current?.value,
    };
    try {
      fetch("/todo/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
        .then((response) => {
          if (response.status === 401) {
            setInvalidLogin(true);
            setUserLoggedIn(false);
            setShowLoginModal(true);
            username.current.value = "";
            password.current.value = "";
            /* throw new Error("Invalid username or password"); */
          } else {
            console.log("User logged in");
            setUserLoggedIn(true);
            setUserAlias(username.current?.value);
            setInvalidLogin(false);
            username.current.value = "";
            password.current.value = "";
          }

          return response.json();
        })
        .then((data) => {
          if (data.userLogin != null) {
            setUserId(data.userLogin);
            setUserToken(data.token);
          }

          /* return; */
        })
        .then(() => {
          getToDo();
        }).catch(()=>{console.log("There was an invalid username or password")});
    } catch (err) {
      console.log('error from line 73')
      console.log(err);
    }
    setUserLoggedIn(true);
    setShowLoginModal(false);
  }

  //function to cancel login of user

  function handleLoginCancel() {
    setShowLoginModal(false);
  }

  //Enter key functionality
  function handleEnterKey(event){
    if(event.key === "Enter"){
      handleLoginUser()
    }
  }

  return (
    <div className={loginModal}>
      <div className="loginModalContainer">
        <h4>Login</h4>
        <input className="loginInput" placeholder="Username" ref={username} />
        <input
          className="loginInput"
          placeholder="Password"
          ref={password}
          type="password"
          onKeyDown={handleEnterKey}
        />
        <button onClick={handleLoginUser} className="loginButton" >
          Login
        </button>
        <button onClick={handleLoginCancel} className="cancelButton">
          Cancel
        </button>
        <h6 className={invalidLoginText}>Invalid username or password.</h6>
      </div>
    </div>
  );
}
