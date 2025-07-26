export interface CheckServerResponse {
  status: boolean;
  message: string;
}

interface CommonQueryResult {
  status: boolean;
  timestamp: string;
}

interface Presentation {
  title: string;
  suggestionTitle: string;
  subtitle: string;
}

export enum EntityType {
  CITY = "CITY",
  AIRPORT = "AIRPORT",
  COUNTRY = "COUNTRY",
}

interface RelevantFlightParams {
  skyId: string;
  entityId: string;
  flightPlaceType: EntityType;
  localizedName: string;
}

interface RelevantHotelParams {
  entityId: string;
  entityType: EntityType;
  localizedName: string;
}

export interface SearchAirportQueryResult extends CommonQueryResult {
  data?: {
    presentation: Presentation;
    navigation?: {
      relevantFlights?: RelevantFlightParams;
      relevantHotels?: RelevantHotelParams;
    };
  }[];
}
