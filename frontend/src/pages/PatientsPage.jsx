import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PatientSearchResults from "../components/PatientSearchResults";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchPatients = async () => {
    const response = await axios.get("http://localhost:5000/patients");
    setPatients(response.data.entry || []);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const patient = p.resource;

    const name = `${patient.name?.[0]?.given?.join(" ") || ""} ${
      patient.name?.[0]?.family || ""
    }`.toLowerCase();

    const id = patient.id?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return name.includes(search) || id.includes(search);
  });

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Patients</h1>
          <p>Search patients and open patient-specific workflows.</p>
        </div>

        <button onClick={() => navigate("/patients/new")}>
          + New Patient
        </button>
      </section>

      <section className="card">
        <div className="field">
          <label>Search Patient</label>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name or Patient Internal ID"
          />
        </div>
      </section>

      <PatientSearchResults patients={filteredPatients} />
    </>
  );
}

export default PatientsPage;