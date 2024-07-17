import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../index.css";
import Toastify from "../components/Toastify/index.tsx";
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <CookiesProvider>
      <BrowserRouter>
        <Toastify />
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
    {/* <App /> */}
  </>
);
