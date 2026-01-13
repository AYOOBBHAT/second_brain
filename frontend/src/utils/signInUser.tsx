import axios from "axios";
import { toast } from "react-toastify";
import validator from "validator";
import { addUser } from "../config/redux/userSlice";
import { AppDispatch } from "../config/redux/store";
import { NavigateFunction } from "react-router-dom";
import { devLogger } from "./devLogger";
import { getApiUrl, normalizeBackendBase } from "./api"

async function signInUser(
  usernameRef: React.RefObject<HTMLInputElement>,
  passwordRef: React.RefObject<HTMLInputElement>,
  setInputErrorMsg: React.Dispatch<React.SetStateAction<string>>,
  navigate: NavigateFunction,
  dispatch: AppDispatch
) {
  const usernameOrEmail = usernameRef.current?.value ?? "";
  const password = passwordRef.current?.value ?? "";

  if (!validator.isStrongPassword(password)) {
    setInputErrorMsg("password must be strong.");
    return;
  }

  try {
    const rawBase = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000/api/v1";
    const sanitizedBase = normalizeBackendBase(rawBase);
    if (rawBase !== sanitizedBase) devLogger.debug("sanitized backend baseUrl", { rawBase, sanitizedBase });
    const url = getApiUrl("/auth/signin");
    devLogger.debug("signIn URL:", url);
    const result = await axios.post(
      url,
      {
        username: usernameOrEmail,
        email: usernameOrEmail,
        password,
      },
      { withCredentials: true }
    );

    if (result.data.success) {
      // Avoid logging user PII to console; only emit a non-sensitive success message
      devLogger.debug("sign in successful");
      dispatch(addUser(result.data.data));
      localStorage.setItem("isLoggedIn", result.data.data.email);
      navigate("/dashboard");
    }
  } catch (error: unknown) {
    console.error(error);
    let message = "Error signing in";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message ?? message;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    setInputErrorMsg(String(message));
    toast.error(String(message));
  }
}

export default signInUser;
