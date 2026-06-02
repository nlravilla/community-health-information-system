const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const FHIR_BASE = "http://hapi-fhir:8080/fhir";

const CARE_PLAN_EXTENSION_URL =
  "http://chis.local/fhir/StructureDefinition/patient-care-plan";

function buildCarePlanExtensions(carePlans) {
  return (
    carePlans?.map((plan) => ({
      url: CARE_PLAN_EXTENSION_URL,
      valueString: plan,
    })) || []
  );
}

function buildPatientResource(body, patientId = null) {
  const patient = {
    resourceType: "Patient",

    name: [
      {
        family: body.familyName,
        given: [body.givenName, body.middleName].filter(Boolean),
      },
    ],

    gender: body.gender,
    birthDate: body.birthDate,

    telecom: body.phone
      ? [
          {
            system: "phone",
            value: body.phone,
          },
        ]
      : [],

    address: body.address
      ? [
          {
            line: [body.address],
            city: body.city,
            state: body.province,
            postalCode: body.postalCode,
            country: body.country,
          },
        ]
      : [],

    extension: buildCarePlanExtensions(body.carePlans),
  };

  if (patientId) {
    patient.id = patientId;
  }

  return patient;
}

app.get("/patients", async (req, res) => {
  try {
    const response = await axios.get(`${FHIR_BASE}/Patient`);
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

app.get("/patients/:id", async (req, res) => {
  try {
    const response = await axios.get(`${FHIR_BASE}/Patient/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch patient" });
  }
});

app.post("/patients", async (req, res) => {
  try {
    const patient = buildPatientResource(req.body);

    const response = await axios.post(`${FHIR_BASE}/Patient`, patient, {
      headers: { "Content-Type": "application/fhir+json" },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create patient" });
  }
});

app.put("/patients/:id", async (req, res) => {
  try {
    const patient = buildPatientResource(req.body, req.params.id);

    const response = await axios.put(
      `${FHIR_BASE}/Patient/${req.params.id}`,
      patient,
      {
        headers: {
          "Content-Type": "application/fhir+json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to update patient",
    });
  }
});

app.delete("/patients/:id", async (req, res) => {
  try {
    await axios.delete(`${FHIR_BASE}/Patient/${req.params.id}`);

    res.json({
      message: "Patient deleted successfully",
    });
  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      error: "Failed to delete patient",
    });
  }
});

app.get("/immunizations", async (req, res) => {
  try {
    const response = await axios.get(`${FHIR_BASE}/Immunization`);
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch immunizations" });
  }
});

app.post("/immunizations", async (req, res) => {
  try {
    const immunization = {
      resourceType: "Immunization",
      status: req.body.status || "completed",
      vaccineCode: {
        text: req.body.vaccineName,
      },
      patient: {
        reference: `Patient/${req.body.patientId}`,
      },
      occurrenceDateTime: req.body.occurrenceDateTime,
      lotNumber: req.body.lotNumber,
      location: req.body.location
        ? {
            display: req.body.location,
          }
        : undefined,
      primarySource: true,
    };

    const response = await axios.post(`${FHIR_BASE}/Immunization`, immunization, {
      headers: {
        "Content-Type": "application/fhir+json",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create immunization" });
  }
});

app.put("/immunizations/:id", async (req, res) => {
  try {
    const immunization = {
      resourceType: "Immunization",
      id: req.params.id,
      status: req.body.status || "completed",
      vaccineCode: {
        text: req.body.vaccineName,
      },
      patient: {
        reference: `Patient/${req.body.patientId}`,
      },
      occurrenceDateTime: req.body.occurrenceDateTime,
      lotNumber: req.body.lotNumber,
      location: req.body.location
        ? {
            display: req.body.location,
          }
        : undefined,
      primarySource: true,
    };

    const response = await axios.put(
      `${FHIR_BASE}/Immunization/${req.params.id}`,
      immunization,
      {
        headers: {
          "Content-Type": "application/fhir+json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to update immunization" });
  }
});

app.delete("/immunizations/:id", async (req, res) => {
  try {
    await axios.delete(`${FHIR_BASE}/Immunization/${req.params.id}`);

    res.json({
      message: "Immunization deleted successfully",
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to delete immunization" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});