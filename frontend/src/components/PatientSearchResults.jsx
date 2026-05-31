import { useNavigate } from "react-router-dom";

function PatientSearchResults({ patients }) {
  const navigate = useNavigate();

  const getPatientName = (patient) => {
    return `${patient.name?.[0]?.given?.join(" ") || ""} ${
      patient.name?.[0]?.family || ""
    }`.trim();
  };

  return (
    <section className="card">
      <h2>Patient Search Results</h2>

      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <table className="patient-table">
          <thead>
            <tr>
              <th>Internal Patient ID</th>
              <th>Patient Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => {
              const patient = p.resource;

              return (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{getPatientName(patient) || "Unnamed Patient"}</td>
                  <td>{patient.gender || "unknown"}</td>
                  <td>{patient.birthDate || "-"}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      View Patient
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default PatientSearchResults;