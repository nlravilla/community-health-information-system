import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PatientForm() {
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
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
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // 🚀 Add this line to see the payload before it leaves the browser
  console.log("✈️ FRONTEND SENDING TO BACKEND:", form);

  try {
    const response = await axios.post("http://localhost:5000/patients", form);
    alert("Patient created successfully");
    resetForm();
    navigate("/patients");
  } catch (err) {
    console.error(err);
    alert("Failed to create patient");
  }
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

  return (
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
              <label>Gender</label>
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
              <input name="phone" value={form.phone} onChange={handleChange} />
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
            {[
              "Immunization",
              "Nutrition",
              "Maternal Care",
              "TB",
              "HIV",
              "WASH",
            ].map((plan) => (
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
        <button type="submit">Register Patient</button>
      </form>
    </section>
  );
}

export default PatientForm;
