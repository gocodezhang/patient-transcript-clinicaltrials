import { groupBy, partition } from "lodash";
import { ClinicalTrailSearchObject, Operator, SeachTerm } from "./types";

export const DefaultOperator = Operator.AND;

export function buildSearchExpressionFromSearchObject(
  object: ClinicalTrailSearchObject
) {
  const { includes, excludes } = object;
  const includesByOperator = groupBy(includes, (t) => t.operator);
  const excludesByOperator = groupBy(excludes, (t) => t.operator);

  const includesExpression = [];
  for (const [operator, searchTerms] of Object.entries(includesByOperator)) {
    includesExpression.push(
      `(${buildQueryExpression(
        searchTerms.map((t) => t.term),
        operator as Operator
      )})`
    );
  }

  const excludesExpression = [];
  for (const [operator, searchTerms] of Object.entries(excludesByOperator)) {
    excludesExpression.push(
      `(${buildQueryExpression(
        searchTerms.map((t) => t.term),
        operator as Operator
      )})`
    );
  }

  const finalExpression = [];
  for (const subExpression of [includesExpression, excludesExpression]) {
    const builtExpression = subExpression.join(` ${DefaultOperator} `);
    if (builtExpression) {
      finalExpression.push(builtExpression);
    }
  }
  return finalExpression.join(" NOT ");
}

function buildQueryExpression(searchTerms: string[], operator: Operator) {
  return searchTerms.map((term) => buildPhrase(term)).join(` ${operator} `);
}

export function buildFieldExpression(
  searchTerm: string,
  fields: string[],
  operator = "OR"
): string {
  // Build AREA expressions for each field
  const areaExpressions = fields.map(
    (field) => `AREA[${field}]${buildPhrase(searchTerm)}`
  );

  // Combine with operator
  return areaExpressions.join(` ${operator} `);
}

function buildPhrase(term: string) {
  const isSingleword = term.split(" ").length === 1;

  return isSingleword ? term : `"${term}"`;
}

export function ageToStandAgeGroup(age: number) {
  if (age <= 17) return "CHILD";
  else if (age >= 18 && age <= 64) return "ADULT";
  else return "OLDER_ADULT";
}
