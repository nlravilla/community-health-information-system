import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function PatientDetailsPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await axios.get(
        `http://localhost:5000/patients/${patientId}`,
      );

      setPatient(response.data);
    };

    fetchPatient();
  }, [patientId]);

  if (!patient) {
    return <section className="card">Loading patient...</section>;
  }

  const patientName = `${patient.name?.[0]?.given?.join(" ") || ""} ${
    patient.name?.[0]?.family || ""
  }`.trim();

  const carePlans =
    patient.extension
      ?.filter(
        (ext) =>
          ext.url ===
          "http://chis.local/fhir/StructureDefinition/patient-care-plan",
      )
      ?.map((ext) => ext.valueString) || [];

  return (
    <>
      <section className="page-header">
        <div>
          <h1>{patientName || "Unnamed Patient"}</h1>
          <p>Patient Internal ID: {patient.id}</p>
        </div>

        <div className="actions-menu">
          <button
            className="actions-btn"
            onClick={() => setShowActions(!showActions)}
          >
            Actions ▾
          </button>

          {showActions && (
            <div className="actions-dropdown">
              <button onClick={() => navigate(`/patients/${patientId}/edit`)}>
                Edit Patient
              </button>

              <button>Delete Patient</button>

              <button
                onClick={() =>
                  navigate(`/patients/${patientId}/appointments/new`)
                }
              >
                Schedule Appointment
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="card">
        <h2>Demographics</h2>

        <p>
          <strong>Gender:</strong> {patient.gender || "-"}
        </p>

        <p>
          <strong>Date of Birth:</strong> {patient.birthDate || "-"}
        </p>

        <p>
          <strong>Phone:</strong> {patient.telecom?.[0]?.value || "-"}
        </p>
      </section>

      <section className="card">
        <h2>Patient Care Plans</h2>

        {carePlans.length === 0 ? (
          <p>No care plans selected for this patient.</p>
        ) : (
          <div className="workflow-buttons">
            {carePlans.map((plan) => (
              <button
                key={plan}
                onClick={() => {
                  if (plan === "Immunization") {
                    navigate(`/patients/${patientId}/immunizations`);
                  } else {
                    alert(`${plan} page is coming later`);
                  }
                }}
              >
                {plan}
              </button>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default PatientDetailsPage;
