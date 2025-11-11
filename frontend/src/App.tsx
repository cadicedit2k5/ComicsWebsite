import { BrowserRouter, Routes, Route } from "react-router";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ComicsPage from "./pages/ComicsPage";
import { Toaster } from "sonner"
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {

  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}> //Bọc lớp con bên trong để bảo vệ
            <Route path="/" element={<ComicsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default App;
