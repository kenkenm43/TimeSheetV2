/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import useRecovery from "../../context/RecoveryProvider";
import { resetPassword } from "../../services/authServices";
import OtpInput from "react-otp-input";

const OTPinput = () => {
  const { email, otp, setOTP, setPage } = useRecovery();

  const [timerCount, setTimer] = React.useState(60);
  const [OTPinput, setOTPinput] = useState<string>("");
  const [disable, setDisable] = useState(true);

  const resendOTP = async () => {
    try {
      if (disable) return;
      await resetPassword({ recipient_email: email, OTP: otp });
      await setDisable(true);
      await alert("A new OTP has succesfully been sent to your email.");
      await setTimer(60);
    } catch (error) {
      return error;
    }
  };

  function verfiyOTP() {
    if (parseInt(OTPinput) === otp) {
      setPage("reset");
      return;
    }
    alert(
      "The code you have entered is not correct, try again or re-send the link"
    );
    return;
  }

  React.useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);
  const handleChange = (code: any) => {
    setOTPinput(code);
  };
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {email}</p>
            </div>
          </div>

          <div>
            <form>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-center mx-auto w-full max-w-xs ">
                  {/* <div className="w-16 h-16 ">
                    <input
                      maxLength="1"
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          e.target.value,
                          OTPinput[1],
                          OTPinput[2],
                          OTPinput[3],
                        ])
                      }
                    ></input>
                  </div>
*/}
                  <OtpInput
                    value={OTPinput}
                    onChange={handleChange}
                    numInputs={4}
                    renderSeparator={<span style={{ width: "8px" }}>-</span>}
                    shouldAutoFocus={true}
                    inputStyle={{
                      border: "1px solid",
                      borderRadius: "12px",
                      width: "54px",
                      height: "54px",
                      fontSize: "12px",
                      color: "#000",
                      fontWeight: "400",
                      caretColor: "blue",
                    }}
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <a
                      onClick={() => verfiyOTP()}
                      className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                    >
                      Verify Account
                    </a>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't recieve code?</p>{" "}
                    <a
                      className="flex flex-row items-center"
                      style={{
                        color: disable ? "gray" : "blue",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                      }}
                      onClick={() => resendOTP()}
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPinput;
