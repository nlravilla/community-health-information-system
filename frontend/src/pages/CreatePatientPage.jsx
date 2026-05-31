import PatientForm from "../components/PatientForm";

function CreatePatientPage() {
  return (
    <>
      <section className="page-header">
        <div>
          <h1>Create Patient</h1>
          <p>Creates a new Patient in the system</p>
        </div>
      </section>

      <PatientForm />
    </>
  );
}

export default CreatePatientPage;