import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import AuthGuard from "./components/AuthGuard ";
import Profile from "./views/Profile";
import Meal from "./views/Meal";

function App() {
  return (
    <BrowserRouter>
      <AuthGuard />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element=
          {
            <>
              <Navbar />
              <Meal />
            </>
          } />

        <Route path="/profile" element={
          <>
            <Navbar />
            <Profile />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
