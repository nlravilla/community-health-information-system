import { useEffect, useState } from "react";
import axios from "axios";
import PatientSearchResults from "../components/PatientSearchResults";

function PatientSearchPage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await axios.get("http://localhost:5000/patients");
      setPatients(response.data.entry || []);
    };

    fetchPatients();
  }, []);

  return <PatientSearchResults patients={patients} />;
}

export default PatientSearchPage;