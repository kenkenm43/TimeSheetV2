import { useState, useEffect } from "react";

const useIdleTimer = async (timeout, onTimeout) => {
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetTimer = () => {
    setLastActivity(Date.now());
  };

  useEffect(() => {
    const handleEvents = () => {
      resetTimer();
    };

    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => window.addEventListener(event, handleEvents));

    const interval = setInterval(async () => {
      if (Date.now() - lastActivity >= timeout) {
        await onTimeout();
      }
    }, 1000);

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleEvents)
      );
      clearInterval(interval);
    };
  }, [lastActivity, timeout, onTimeout]);

  return resetTimer;
};

export default useIdleTimer;
