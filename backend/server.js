const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const FHIR_BASE = "http://hapi-fhir:8080/fhir";

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
    const patient = {
      resourceType: "Patient",
      name: [
        {
          family: req.body.familyName,
          given: [req.body.givenName],
        },
      ],
      gender: req.body.gender,
      birthDate: req.body.birthDate,
      telecom: req.body.phone
        ? [
            {
              system: "phone",
              value: req.body.phone,
            },
          ]
        : [],
    };

    const response = await axios.post(`${FHIR_BASE}/Patient`, patient, {
      headers: { "Content-Type": "application/fhir+json" },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create patient" });
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

app.put("/patients/:id", async (req, res) => {
  try {
    const patient = {
      resourceType: "Patient",
      id: req.params.id,

      name: [
        {
          family: req.body.familyName,
          given: [
            req.body.givenName,
            req.body.middleName,
          ].filter(Boolean),
        },
      ],

      gender: req.body.gender,
      birthDate: req.body.birthDate,

      telecom: req.body.phone
        ? [
            {
              system: "phone",
              value: req.body.phone,
            },
          ]
        : [],

      address: req.body.address
        ? [
            {
              line: [req.body.address],
              city: req.body.city,
              state: req.body.province,
              postalCode: req.body.postalCode,
              country: req.body.country,
            },
          ]
        : [],
    };

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
    await axios.delete(
      `${FHIR_BASE}/Patient/${req.params.id}`
    );

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

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});