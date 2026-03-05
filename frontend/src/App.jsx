// App.jsx
import { Routes, Route } from "react-router-dom";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { MainLayout } from "./MainLayout.jsx";
import { Valid_Routes } from "./shared/ValidRoutes.js";
function App() {
  return (
    <Routes>
    <Route element={<MainLayout/>}>
      <Route path={Valid_Routes.HOME} element={<AllImages />} />
      <Route path="/images/:imageId" element={<ImageDetails />} />
      <Route path={Valid_Routes.UPLOAD} element={<UploadPage />} />
      <Route path={Valid_Routes.LOGIN} element={<LoginPage />} />
    </Route>
    </Routes>
  );
}

export default App;
