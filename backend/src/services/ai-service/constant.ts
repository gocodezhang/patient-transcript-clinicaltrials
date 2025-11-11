export const output = {
  patient: { name: "Unknown", age: 39, gender: "male", birthDate: "1984" },
  conditions: [
    {
      clinicalStatus: {
        coding: [{ system: null, code: null, display: "active" }],
        text: "active",
      },
      verificationStatus: {
        coding: [{ system: null, code: null, display: "confirmed" }],
        text: "confirmed",
      },
      category: [
        {
          coding: [
            { system: null, code: null, display: "encounter-diagnosis" },
          ],
          text: "encounter-diagnosis",
        },
      ],
      severity: {
        coding: [{ system: null, code: null, display: "severe" }],
        text: "severe",
      },
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "29857009",
            display: "Chest pain",
          },
        ],
        text: "Chest pain",
      },
      bodySite: [
        {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "51185008",
              display: "Left side of chest",
            },
          ],
          text: "Left side of chest",
        },
      ],
      onsetDateTime: "2023-10-01T08:00:00Z",
      abatementDateTime: null,
      recordedDate: "2023-10-02",
    },
  ],
  carePlans: [
    {
      status: "active",
      intent: "plan",
      title: "Chest Pain Management Plan",
      category: [
        {
          coding: [{ system: null, code: null, display: "treatment-plan" }],
          text: "treatment-plan",
        },
      ],
      description:
        "Management of acute chest pain symptoms, lifestyle modifications, and regular monitoring.",
      goal: [
        {
          lifecycleStatus: "active",
          category: [
            {
              coding: [{ system: null, code: null, display: "therapeutic" }],
              text: "therapeutic",
            },
          ],
          continuous: true,
          priority: "high-priority",
          description: "Reduce chest pain frequency and severity.",
          target: [
            {
              measure: {
                coding: [
                  { system: null, code: null, display: "Pain severity" },
                ],
                text: "Pain severity",
              },
            },
          ],
        },
      ],
      medication: null,
      period: { start: "2023-10-02T00:00:00Z", end: null },
      created: "2023-10-02",
    },
  ],
};
