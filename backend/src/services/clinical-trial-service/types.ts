export enum Operator {
  AND = "AND",
  OR = "OR",
}

export type SeachTerm = {
  term: string;
  operator: Operator;
};

export type ClinicalTrailSearchObject = {
  includes: SeachTerm[];
  excludes: SeachTerm[];
};

export type SearchPatient = {
  age: number;
  gender: "male" | "female" | "all";
};

export type ClinicalTrialSearchParams = {
  conditions: ClinicalTrailSearchObject;
  treatments: ClinicalTrailSearchObject;
  outcomeMeasures: ClinicalTrailSearchObject;
  patient: SearchPatient;
};
