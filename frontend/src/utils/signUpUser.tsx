import axios from "axios";
import validateUserInput from "./validateUserInput";
import { toast } from "react-toastify";
import { devLogger } from "./devLogger";

async function signUpUser(
  usernameRef: React.RefObject<HTMLInputElement>,
  emailRef: React.RefObject<HTMLInputElement>,
  passwordRef: React.RefObject<HTMLInputElement>,
  setInputErrorMsg: React.Dispatch<React.SetStateAction<string>>,
  switchTab: () => void
) {
  const username = usernameRef.current?.value ?? "";
  const email = emailRef.current?.value ?? "";
  const password = passwordRef.current?.value ?? "";

  const errorMsg = validateUserInput(username, email, password);

  if (errorMsg) {
    setInputErrorMsg(errorMsg);
    return;
  }

  try {
    const baseUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000/api/v1";
    const url = `${baseUrl}/auth/signup`;
    // Only log environment/endpoint in development and never include user payload
    devLogger.debug("signUp URL:", url);
    const result = await axios.post(
      url,
      {
        username,
        email,
        password,
      },
      { withCredentials: true }
    );

    if (result.data.success) {
      switchTab();
    }
  } catch (error: unknown) {
    console.error(error);
    let message = "Error signing up";

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

export default signUpUser;
