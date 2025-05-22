import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import AuthGuard from "./components/AuthGuard ";

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
              <Dashboard />
            </>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
