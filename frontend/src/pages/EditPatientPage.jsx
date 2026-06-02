import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CARE_PLAN_EXTENSION_URL =
  "http://chis.local/fhir/StructureDefinition/patient-care-plan";

const CARE_PLAN_OPTIONS = [
  "Immunization",
  "Nutrition",
  "Maternal Care",
  "TB",
  "HIV",
  "WASH",
];

function EditPatientPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    givenName: "",
    middleName: "",
    familyName: "",
    gender: "",
    birthDate: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Philippines",
    carePlans: [],
  });

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await axios.get(
        `http://localhost:5000/patients/${patientId}`
      );

      const patient = response.data;

      const carePlans =
        patient.extension
          ?.filter((ext) => ext.url === CARE_PLAN_EXTENSION_URL)
          ?.map((ext) => ext.valueString) || [];

      setForm({
        givenName: patient.name?.[0]?.given?.[0] || "",
        middleName: patient.name?.[0]?.given?.[1] || "",
        familyName: patient.name?.[0]?.family || "",
        gender: patient.gender || "",
        birthDate: patient.birthDate || "",
        phone: patient.telecom?.[0]?.value || "",
        address: patient.address?.[0]?.line?.[0] || "",
        city: patient.address?.[0]?.city || "",
        province: patient.address?.[0]?.state || "",
        postalCode: patient.address?.[0]?.postalCode || "",
        country: patient.address?.[0]?.country || "Philippines",
        carePlans,
      });
    };

    fetchPatient();
  }, [patientId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCarePlanChange = (e) => {
    const { value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      carePlans: checked
        ? [...prev.carePlans, value]
        : prev.carePlans.filter((plan) => plan !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/patients/${patientId}`, form);

      alert("Patient updated successfully");
      navigate(`/patients/${patientId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update patient");
    }
  };

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Edit Patient</h1>
          <p>Patient Internal ID: {patientId}</p>
        </div>
      </section>

      <section className="card">
        <h2>Patient Information</h2>

        <form onSubmit={handleSubmit}>
          <div className="section">
            <h3>Full Name</h3>

            <div className="grid three">
              <div className="field">
                <label>First Name</label>
                <input
                  name="givenName"
                  value={form.givenName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Middle Name</label>
                <input
                  name="middleName"
                  value={form.middleName}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Family Name</label>
                <input
                  name="familyName"
                  value={form.familyName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Demographics</h3>

            <div className="grid two">
              <div className="field">
                <label>Sex</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div className="field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Contact Details</h3>

            <div className="grid three">
              <div className="field">
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>City</label>
                <input name="city" value={form.city} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Province</label>
                <input
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Postal Code</label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Patient Care Plans</h3>

            <div className="checkbox-grid">
              {CARE_PLAN_OPTIONS.map((plan) => (
                <label className="checkbox-card" key={plan}>
                  <input
                    type="checkbox"
                    value={plan}
                    checked={form.carePlans.includes(plan)}
                    onChange={handleCarePlanChange}
                  />
                  <span>{plan}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="workflow-buttons">
            <button type="submit">Save Changes</button>
            <button
              type="button"
              onClick={() => navigate(`/patients/${patientId}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default EditPatientPage;
