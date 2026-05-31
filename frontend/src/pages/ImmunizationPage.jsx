import { useEffect, useState } from "react";
import axios from "axios";

function ImmunizationPage() {
  const [patients, setPatients] = useState([]);
  const [immunizations, setImmunizations] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const [form, setForm] = useState({
    vaccineName: "",
    occurrenceDateTime: "",
    status: "completed",
    lotNumber: "",
    location: ""
  });

  const fetchPatients = async () => {
    const response = await axios.get("http://localhost:5000/patients");
    setPatients(response.data.entry || []);
  };

  const fetchImmunizations = async () => {
    const response = await axios.get("http://localhost:5000/immunizations");
    setImmunizations(response.data.entry || []);
  };

  useEffect(() => {
    fetchPatients();
    fetchImmunizations();
  }, []);

  const selectedPatient = patients.find(
    (p) => p.resource.id === selectedPatientId
  )?.resource;

  const patientImmunizations = immunizations.filter((item) => {
    const ref = item.resource.patient?.reference;
    return ref === `Patient/${selectedPatientId}`;
  });

  const lastImmunizationDate =
    patientImmunizations.length > 0
      ? patientImmunizations
          .map((item) => item.resource.occurrenceDateTime)
          .filter(Boolean)
          .sort()
          .reverse()[0]
      : "-";

  const getPatientName = (patient) => {
    if (!patient) return "";
    return `${patient.name?.[0]?.given?.join(" ") || ""} ${
      patient.name?.[0]?.family || ""
    }`.trim();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/immunizations", {
      ...form,
      patientId: selectedPatientId
    });

    setForm({
      vaccineName: "",
      occurrenceDateTime: "",
      status: "completed",
      lotNumber: "",
      location: ""
    });

    fetchImmunizations();
    alert("Immunization saved");
  };

  return (
    <>
      <section className="card">
        <h2>Search Patient for Immunization</h2>

        <div className="grid two">
          <div className="field">
            <label>Select Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              <option value="">Select Patient</option>

              {patients.map((p) => {
                const patient = p.resource;

                return (
                  <option key={patient.id} value={patient.id}>
                    {getPatientName(patient) || "Unnamed Patient"} | Patient Internal ID:{" "}
                    {patient.id}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </section>

      {selectedPatient && (
        <>
          <section className="card">
            <h2>Patient Immunization Summary</h2>

            <p>
              <strong>Patient:</strong> {getPatientName(selectedPatient)}
            </p>

            <p>
              <strong>Patient Internal ID:</strong> {selectedPatient.id}
            </p>

            <p>
              <strong>Last Immunization Date:</strong> {lastImmunizationDate}
            </p>
          </section>

          <section className="card">
            <h2>Create Immunization Record</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid two">
                <div className="field">
                  <label>Vaccine Name</label>
                  <input
                    name="vaccineName"
                    value={form.vaccineName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Date Administered</label>
                  <input
                    type="date"
                    name="occurrenceDateTime"
                    value={form.occurrenceDateTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="completed">Completed</option>
                    <option value="entered-in-error">Entered in Error</option>
                    <option value="not-done">Not Done</option>
                  </select>
                </div>

                <div className="field">
                  <label>Lot Number</label>
                  <input
                    name="lotNumber"
                    value={form.lotNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit">Save Immunization</button>
            </form>
          </section>

          <section className="card">
            <h2>Saved Immunizations for Patient</h2>

            {patientImmunizations.length === 0 ? (
              <p>No immunizations found for this patient.</p>
            ) : (
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Patient Internal ID</th>
                    <th>Vaccine</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Lot Number</th>
                    <th>Location</th>
                  </tr>
                </thead>

                <tbody>
                  {patientImmunizations.map((item) => {
                    const imm = item.resource;

                    return (
                      <tr key={imm.id}>
                        <td>{imm.id}</td>
                        <td>{imm.vaccineCode?.text || "-"}</td>
                        <td>{imm.occurrenceDateTime || "-"}</td>
                        <td>{imm.status || "-"}</td>
                        <td>{imm.lotNumber || "-"}</td>
                        <td>{imm.location?.display || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default ImmunizationPage;