import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./aos.css/";
import { Provider } from "react-redux";
import store from "./store.jsx";
import { AuthContextProvider } from "./store/auth-context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </Provider>
);
