import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import keycloak from "../api/keycloak";

const INACTIVITY_LIMIT = 5 * 60 * 1000;

function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    let logoutTimer;

    const logoutUser = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");

      if (keycloak.authenticated) {
        keycloak.logout({
          redirectUri: `${window.location.origin}/login`,
        });
      } else {
        navigate("/login", { replace: true });
      }
    };

    const resetTimer = () => {
      clearTimeout(logoutTimer);

      logoutTimer = setTimeout(() => {
        logoutUser();
      }, INACTIVITY_LIMIT);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(logoutTimer);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate]);
}

export default useAutoLogout;