import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import "./i18nextInit";
import { Suspense } from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Suspense fallback={<div>Loading...</div>}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Suspense>
);
