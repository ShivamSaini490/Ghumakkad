// Starts a countdown timer for OTP (default 60 seconds)
export const startOtpTimer = (setTimer, duration = 60) => {
  let timeLeft = duration;

  const intervalId = setInterval(() => {
    timeLeft -= 1;
    setTimer(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(intervalId);
    }
  }, 1000);

  return intervalId; // return id so it can be cleared manually if needed
};

// Optional: format timer to MM:SS (for display purposes)
export const formatTime = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};
