jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import LoginRegister from "./pages/LoginRegister";
import Projects from "./pages/Projects";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}


---
