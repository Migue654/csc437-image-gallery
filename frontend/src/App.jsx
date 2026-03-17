// App.jsx
import { Routes, Route, useNavigate } from "react-router-dom";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { MainLayout } from "./MainLayout.jsx";
import { Valid_Routes } from "./shared/ValidRoutes.js";
import { useState } from "react";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

function App() {
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  function handleLogin(token){
    setAuthToken(token);
    navigate(Valid_Routes.HOME);
  }
  return (
    <Routes>
  <Route element={<MainLayout/>}>
    <Route path={Valid_Routes.HOME} element={
      <ProtectedRoute authToken={authToken}>
        <AllImages authToken={authToken} />
      </ProtectedRoute>
    } />
    <Route path="/images/:imageId" element={
      <ProtectedRoute authToken={authToken}>
        <ImageDetails authToken={authToken} />
      </ProtectedRoute>
    } />

    <Route path={Valid_Routes.UPLOAD} element={
      <ProtectedRoute authToken={authToken}>
        <UploadPage authToken={authToken} />
      </ProtectedRoute>
    } />

    <Route path={Valid_Routes.LOGIN} element={<LoginPage onLogin={handleLogin} />} />
    <Route path={Valid_Routes.REGISTER} element={<LoginPage isRegistering={true} onLogin={handleLogin} />} />

  </Route>
</Routes>
  );
}

export default App;
