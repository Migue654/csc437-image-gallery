import React from "react";
import { MainLayout } from "./MainLayout.jsx";
import "./LoginPage.css";
import { Link } from "react-router";
import { useActionState } from "react";

export function LoginPage({ isRegistering, onLogin }) {
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();
    const emailInputId = React.useId();

    const [result,formAction,isPending]= useActionState(async (prevState,formData)=>{
                const username = formData.get("username");
                const password = formData.get("password");
                const email = formData.get("email");

                if(isRegistering){
                const respose = await fetch ("/api/users",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        email
                    })
                })
                if (respose.status == 409){
                    return "Username Already taken";
                }
                if(!respose.ok){
                    console.log(respose.status, await respose.text()); // add this
                    return "An error occurred. Please try again.";
                }
                const { token } = await respose.json();
                onLogin(token);
                }
                else{
                    const response = await fetch("/api/auth/tokens", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });
                if (response.status === 401) {
                    return "Invalid username or password";
                }
                if (!response.ok) {
                    return "Something went wrong, please try again";
                }
                const { token } = await response.json();
                onLogin(token);
                }




            },
            null
        );

    return (
        <>
            <h2>{isRegistering ? "Register a new account" : "Login" }</h2>
            <form className="LoginPage-form" action={formAction}>
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId}  name="username" disabled={isPending} required/>
                {isRegistering && (
                    <>
                        <label htmlFor={emailInputId}>Email</label>
                        <input id={emailInputId} name="email" type="email" disabled={isPending} required />
                    </>
                )}

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} type="password" name="password" disabled={isPending} required />
                {result && <p style={{ color: "red" }} aria-live="polite">{result}</p>}
                <input type="submit" value="Submit" disabled={isPending} />
            </form>
            {isRegistering ? (
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            ) : (
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            )}
        </>
    );
}
