import React from "react";

const ErrorPage = () => {
  return (
    <section className="w-full mx-auto">
      <h1>ไม่มีหน้านี้</h1>
      <br />
      <p>คลิกปุ่มกลับเพื่อกลับไปหน้าแรก</p>
      <div className="flexGrow">
        <button className="text-blue-700 hover:text-blue-800 " onClick={goBack}>
          กลับ
        </button>
      </div>
    </section>
  );
};

export default ErrorPage;
