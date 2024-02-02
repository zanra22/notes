import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Container from "@mui/material/Container";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import EnterResetPasswordScreen from "./screens/EnterResetPasswordScreen";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<SplashScreen />} exact />
            <Route path="/auth">
              <Route path="login" element={<LoginScreen />} />
              <Route path="register" element={<RegisterScreen />} />
              <Route path="verify-otp" element={<OTPVerificationScreen />} />
              <Route path="reset-password" element={<ResetPasswordScreen />} />
              <Route
                path="reset-password/form"
                element={<EnterResetPasswordScreen />}
              />
            </Route>
            <Route path='*' element={<Navigate to='/' />}></Route>
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
