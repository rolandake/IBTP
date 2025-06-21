import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import ProjectForm from "./pages/ProjectForm";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route tableau de bord */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* Route création de projet */}
        <Route
          path="/projects/new"
          element={
            <RequireAuth>
              <ProjectForm />
            </RequireAuth>
          }
        />

        {/* Route édition de projet */}
        <Route
          path="/projects/:id/edit"
          element={
            <RequireAuth>
              <ProjectForm />
            </RequireAuth>
          }
        />

        {/* Autres routes éventuelles */}
      </Routes>
    </Router>
  );
}
