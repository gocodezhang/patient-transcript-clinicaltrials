import { ClinicalTrialSearchParams } from "./types";
import axios, { AxiosInstance } from "axios";
import {
  ageToStandAgeGroup,
  buildFieldExpression,
  buildSearchExpressionFromSearchObject,
  DefaultOperator,
} from "./utils";

/**
 * ClinicalTrialService - Service for searching clinical trials from ClinicalTrials.gov API v2
 *
 * Documentation: https://clinicaltrials.gov/api/v2/docs
 */

const CLINICAL_TRIALS_API_BASE_URL = "https://clinicaltrials.gov/api/v2";

export interface ClinicalTrial {
  nctId: string;
  briefTitle?: string;
  officialTitle?: string;
  status?: string;
  conditions?: string[];
  interventions?: Array<{
    name?: string;
    type?: string;
    description?: string;
  }>;
  locations?: Array<{
    facility?: string;
    city?: string;
    state?: string;
    country?: string;
  }>;
  eligibility?: {
    criteria?: string;
    gender?: string;
    minimumAge?: string;
    maximumAge?: string;
  };
  phase?: string[];
  studyType?: string;
  enrollment?: number;
  startDate?: string;
  completionDate?: string;
  sponsor?: string;
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export interface ClinicalTrialSearchResponse {
  studies: ClinicalTrial[];
  nextPageToken?: string;
  totalCount?: number;
}

export interface ClinicalTrialApiResponse {
  studies: Array<{
    protocolSection?: {
      identificationModule?: {
        nctId?: string;
        orgStudyIdInfo?: {
          id?: string;
        };
        secondaryIdInfos?: Array<{
          id?: string;
          type?: string;
          domain?: string;
        }>;
        organization?: {
          fullName?: string;
          class?: string;
        };
        briefTitle?: string;
        officialTitle?: string;
        acronym?: string;
      };
      statusModule?: {
        statusVerifiedDate?: string;
        overallStatus?: string;
        lastKnownStatus?: string;
        expandedAccessInfo?: {
          hasExpandedAccess?: boolean;
        };
        startDateStruct?: {
          date?: string;
          type?: string;
        };
        primaryCompletionDateStruct?: {
          date?: string;
          type?: string;
        };
        completionDateStruct?: {
          date?: string;
          type?: string;
        };
        studyFirstSubmitDate?: string;
        studyFirstSubmitQcDate?: string;
        studyFirstPostDateStruct?: {
          date?: string;
          type?: string;
        };
        lastUpdateSubmitDate?: string;
        lastUpdatePostDateStruct?: {
          date?: string;
          type?: string;
        };
      };
      sponsorCollaboratorsModule?: {
        responsibleParty?: {
          type?: string;
        };
        leadSponsor?: {
          name?: string;
          class?: string;
        };
        collaborators?: Array<{
          name?: string;
          class?: string;
        }>;
      };
      oversightModule?: {
        oversightHasDmc?: boolean;
        isFdaRegulatedDrug?: boolean;
        isFdaRegulatedDevice?: boolean;
      };
      descriptionModule?: {
        briefSummary?: string;
        detailedDescription?: string;
      };
      conditionsModule?: {
        conditions?: string[];
        keywords?: string[];
      };
      designModule?: {
        studyType?: string;
        phases?: string[];
        patientRegistry?: boolean;
        designInfo?: {
          allocation?: string;
          interventionModel?: string;
          primaryPurpose?: string;
          observationalModel?: string;
          timePerspective?: string;
          maskingInfo?: {
            masking?: string;
            whoMasked?: string[];
          };
        };
        enrollmentInfo?: {
          count?: number;
          type?: string;
        };
      };
      armsInterventionsModule?: {
        armGroups?: Array<{
          label?: string;
          type?: string;
          description?: string;
          interventionNames?: string[];
        }>;
        interventions?: Array<{
          type?: string;
          name?: string;
          description?: string;
          armGroupLabels?: string[];
        }>;
      };
      outcomesModule?: {
        primaryOutcomes?: Array<{
          measure?: string;
          description?: string;
          timeFrame?: string;
        }>;
        secondaryOutcomes?: Array<{
          measure?: string;
          description?: string;
          timeFrame?: string;
        }>;
      };
      eligibilityModule?: {
        eligibilityCriteria?: string;
        healthyVolunteers?: boolean;
        sex?: string;
        genderBased?: boolean;
        genderDescription?: string;
        minimumAge?: string;
        maximumAge?: string;
        stdAges?: string[];
        studyPopulation?: string;
        samplingMethod?: string;
      };
      contactsLocationsModule?: {
        centralContacts?: Array<{
          name?: string;
          role?: string;
          phone?: string;
          phoneExt?: string;
          email?: string;
        }>;
        overallOfficials?: Array<{
          name?: string;
          affiliation?: string;
          role?: string;
        }>;
        locations?: Array<{
          facility?: string;
          status?: string;
          city?: string;
          state?: string;
          zip?: string;
          country?: string;
          geoPoint?: {
            lat?: number;
            lon?: number;
          };
          contacts?: Array<{
            name?: string;
            role?: string;
            phone?: string;
            phoneExt?: string;
            email?: string;
          }>;
        }>;
      };
      ipdSharingStatementModule?: {
        ipdSharing?: string;
      };
    };
    derivedSection?: {
      miscInfoModule?: {
        versionHolder?: string;
      };
      conditionBrowseModule?: {
        meshes?: Array<{
          id?: string;
          term?: string;
        }>;
        ancestors?: Array<{
          id?: string;
          term?: string;
        }>;
      };
    };
    hasResults?: boolean;
  }>;
  nextPageToken?: string;
  totalCount?: number;
}

export class ClinicalTrialService {
  private axios: AxiosInstance;

  constructor(baseUrl: string = CLINICAL_TRIALS_API_BASE_URL) {
    this.axios = axios.create({
      baseURL: baseUrl,
      headers: { Accept: "application/json" },
    });
  }

  /**
   * Search for clinical trials based on provided parameters
   */
  async searchTrials(
    params: ClinicalTrialSearchParams,
    options: {
      includeTotal: boolean;
      pageSize: number;
      sort: "@relevance";
    } = { includeTotal: true, pageSize: 5, sort: "@relevance" }
  ): Promise<ClinicalTrialApiResponse> {
    try {
      const { conditions, treatments, outcomeMeasures, patient } = params;
      return this.axios
        .get<ClinicalTrialApiResponse>("/studies", {
          params: {
            "query.cond": buildSearchExpressionFromSearchObject(conditions),
            "query.intr": buildSearchExpressionFromSearchObject(treatments),
            "query.outc":
              buildSearchExpressionFromSearchObject(outcomeMeasures),
            "query.term": [
              buildFieldExpression(ageToStandAgeGroup(patient.age), ["StdAge"]),
              buildFieldExpression(patient.gender.toUpperCase(), ["Sex"]),
            ].join(` ${DefaultOperator} `),
            countTotal: options.includeTotal,
            pageSize: options.pageSize,
            sort: options.sort,
          },
        })
        .then(({ data, config }) => {
          console.log(this.axios.getUri(config));
          return data;
        });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search clinical trials: ${error.message}`);
      }
      throw new Error("Failed to search clinical trials: Unknown error");
    }
  }
  /**
   * Transform API response to our simplified format
   */
  transformResponse(
    apiResponse: ClinicalTrialApiResponse
  ): ClinicalTrialSearchResponse {
    const studies: ClinicalTrial[] = (apiResponse.studies || []).map(
      (study) => {
        const protocol = study.protocolSection;
        if (!protocol) {
          return {
            nctId: "",
          } as ClinicalTrial;
        }

        const identification = protocol.identificationModule;
        const status = protocol.statusModule;
        const design = protocol.designModule;
        const conditions = protocol.conditionsModule;
        const interventions = protocol.armsInterventionsModule;
        const eligibility = protocol.eligibilityModule;
        const contactsLocations = protocol.contactsLocationsModule;
        const sponsor = protocol.sponsorCollaboratorsModule;

        return {
          nctId: identification?.nctId || "",
          briefTitle: identification?.briefTitle,
          officialTitle: identification?.officialTitle,
          status: status?.overallStatus,
          conditions: conditions?.conditions,
          interventions: interventions?.interventions?.map((intervention) => ({
            name: intervention.name,
            type: intervention.type,
            description: intervention.description,
          })),
          locations: contactsLocations?.locations?.map((location) => ({
            facility: location.facility,
            city: location.city,
            state: location.state,
            country: location.country,
          })),
          eligibility: eligibility
            ? {
                criteria: eligibility.eligibilityCriteria,
                gender: eligibility.sex,
                minimumAge: eligibility.minimumAge,
                maximumAge: eligibility.maximumAge,
              }
            : undefined,
          phase: design?.phases,
          studyType: design?.studyType,
          enrollment: design?.enrollmentInfo?.count,
          startDate: status?.startDateStruct?.date,
          completionDate: status?.completionDateStruct?.date,
          sponsor: sponsor?.leadSponsor?.name,
          contactInfo:
            contactsLocations?.centralContacts &&
            contactsLocations.centralContacts.length > 0
              ? {
                  name: contactsLocations.centralContacts[0].name,
                  phone: contactsLocations.centralContacts[0].phone,
                  email: contactsLocations.centralContacts[0].email,
                }
              : undefined,
        };
      }
    );

    return {
      studies,
      nextPageToken: apiResponse.nextPageToken,
      totalCount: apiResponse.totalCount,
    };
  }
}
