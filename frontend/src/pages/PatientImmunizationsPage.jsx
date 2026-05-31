import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PatientImmunizationsPage() {
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [immunizations, setImmunizations] = useState([]);

  const [form, setForm] = useState({
    vaccineName: "",
    occurrenceDateTime: "",
    status: "completed",
    lotNumber: "",
    location: ""
  });

  const fetchPatient = async () => {
    const response = await axios.get(`http://localhost:5000/patients/${patientId}`);
    setPatient(response.data);
  };

  const fetchImmunizations = async () => {
    const response = await axios.get("http://localhost:5000/immunizations");
    const entries = response.data.entry || [];

    const filtered = entries.filter((item) => {
      return item.resource.patient?.reference === `Patient/${patientId}`;
    });

    setImmunizations(filtered);
  };

  useEffect(() => {
    fetchPatient();
    fetchImmunizations();
  }, [patientId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/immunizations", {
      ...form,
      patientId
    });

    setForm({
      vaccineName: "",
      occurrenceDateTime: "",
      status: "completed",
      lotNumber: "",
      location: ""
    });

    fetchImmunizations();
  };

  const patientName = patient
    ? `${patient.name?.[0]?.given?.join(" ") || ""} ${patient.name?.[0]?.family || ""}`.trim()
    : "";

  const lastImmunizationDate =
    immunizations.length > 0
      ? immunizations
          .map((item) => item.resource.occurrenceDateTime)
          .filter(Boolean)
          .sort()
          .reverse()[0]
      : "-";

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Immunizations</h1>
          <p>
            Patient: {patientName || "Loading..."} | Internal Patient ID: {patientId}
          </p>
        </div>
      </section>

      <section className="card">
        <h2>Immunization Summary</h2>
        <p><strong>Last Immunization Date:</strong> {lastImmunizationDate}</p>
      </section>

      <section className="card">
        <h2>Add Immunization</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid two">
            <div className="field">
              <label>Vaccine Name</label>
              <input name="vaccineName" value={form.vaccineName} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Date Administered</label>
              <input type="date" name="occurrenceDateTime" value={form.occurrenceDateTime} onChange={handleChange} required />
            </div>

            <div className="field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="completed">Completed</option>
                <option value="entered-in-error">Entered in Error</option>
                <option value="not-done">Not Done</option>
              </select>
            </div>

            <div className="field">
              <label>Lot Number</label>
              <input name="lotNumber" value={form.lotNumber} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} />
            </div>
          </div>

          <button type="submit">Save Immunization</button>
        </form>
      </section>

      <section className="card">
        <h2>Immunization History</h2>

        {immunizations.length === 0 ? (
          <p>No immunizations found for this patient.</p>
        ) : (
          <table className="patient-table">
            <thead>
              <tr>
                <th>Immunization ID</th>
                <th>Vaccine</th>
                <th>Date</th>
                <th>Status</th>
                <th>Lot Number</th>
                <th>Location</th>
              </tr>
            </thead>

            <tbody>
              {immunizations.map((item) => {
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
  );
}

export default PatientImmunizationsPage;