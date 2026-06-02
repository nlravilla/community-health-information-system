import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PatientImmunizationsPage() {
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [immunizations, setImmunizations] = useState([]);
  const [editingImmunizationId, setEditingImmunizationId] = useState(null);

  const [form, setForm] = useState({
    vaccineName: "",
    occurrenceDateTime: "",
    status: "completed",
    lotNumber: "",
    location: "",
  });

  const fetchPatient = async () => {
    const response = await axios.get(
      `http://localhost:5000/patients/${patientId}`,
    );
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

  const resetForm = () => {
    setForm({
      vaccineName: "",
      occurrenceDateTime: "",
      status: "completed",
      lotNumber: "",
      location: "",
    });

    setEditingImmunizationId(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (imm) => {
    setEditingImmunizationId(imm.id);

    setForm({
      vaccineName: imm.vaccineCode?.text || "",
      occurrenceDateTime: imm.occurrenceDateTime || "",
      status: imm.status || "completed",
      lotNumber: imm.lotNumber || "",
      location: imm.location?.display || "",
    });
  };

  const handleDelete = async (immunizationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this immunization?",
    );

    if (!confirmed) return;

    await axios.delete(`http://localhost:5000/immunizations/${immunizationId}`);

    fetchImmunizations();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      patientId,
    };

    if (editingImmunizationId) {
      await axios.put(
        `http://localhost:5000/immunizations/${editingImmunizationId}`,
        payload,
      );

      alert("Immunization updated successfully");
    } else {
      await axios.post("http://localhost:5000/immunizations", payload);

      alert("Immunization saved successfully");
    }

    resetForm();
    fetchImmunizations();
  };

  const patientName = patient
    ? `${patient.name?.[0]?.given?.join(" ") || ""} ${
        patient.name?.[0]?.family || ""
      }`.trim()
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
            Patient: {patientName || "Loading..."} | Internal Patient ID:{" "}
            {patientId}
          </p>
        </div>
      </section>

      <section className="card">
        <h2>Immunization Summary</h2>
        <p>
          <strong>Last Immunization Date:</strong> {lastImmunizationDate}
        </p>
      </section>

      <section className="card">
        <h2>
          {editingImmunizationId ? "Edit Immunization" : "Add Immunization"}
        </h2>

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
              <select name="status" value={form.status} onChange={handleChange}>
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

          <div className="workflow-buttons">
            <button type="submit">
              {editingImmunizationId ? "Save Changes" : "Save Immunization"}
            </button>

            {editingImmunizationId && (
              <button type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
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
                <th>Actions</th>
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
                    <td className="actions-cell">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(imm);
                        }}
                        className="action-link"
                      >
                        Edit
                      </a>

                      <span className="action-separator"> | </span>

                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(imm.id);
                        }}
                        className="delete-link"
                      >
                        Delete
                      </a>
                    </td>
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
