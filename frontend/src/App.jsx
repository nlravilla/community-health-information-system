import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";

import PatientsPage from "./pages/PatientsPage";
import CreatePatientPage from "./pages/CreatePatientPage";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import PatientImmunizationsPage from "./pages/PatientImmunizationsPage";
import ReportsPage from "./pages/ReportsPage";
import EditPatientPage from "./pages/EditPatientPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />

        <div className="main-area">
          <TopNav />

          <main className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/patients" />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/patients/new" element={<CreatePatientPage />} />
              <Route path="/patients/:patientId" element={<PatientDetailsPage />} />
              <Route path="/patients/:patientId/immunizations" element={<PatientImmunizationsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/patients/:patientId/edit" element={<EditPatientPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;