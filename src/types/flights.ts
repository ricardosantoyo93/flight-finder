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
  CITY = "City",
  AIRPORT = "Airport",
  COUNTRY = "Country",
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
    entityId: string;
    skyId: string;
    presentation: Presentation;
    navigation?: {
      relevantFlights?: RelevantFlightParams;
      relevantHotels?: RelevantHotelParams;
    };
  }[];
}

export enum TravelClassEnum {
  Economy = "economy",
  PremiumEconomy = "premium_economy",
  Business = "business",
  First = "first",
}

export interface PassengerCount {
  adults: number;
  children: number;
  infantsSeat: number;
  infantsLap: number;
}

export type Airport =
  | NonNullable<SearchAirportQueryResult["data"]>[number]
  | null;

export interface SearchFlightsParams {
  from: Airport;
  to: Airport;
  departureDate: string;
  passengers: PassengerCount;
  travelClass: TravelClassEnum;
}

interface Carrier {
  id: number;
  name: string;
  allianceId: number;
  alternateId: string;
  displayCode: string;
}

export interface SearchFlightQueryResult extends CommonQueryResult {
  data?: {
    context?: {
      status: string;
      sessionId: string;
      totalResults: number;
    };
    itineraries?: {
      id: string;
      eco: {
        ecoContenderDelta: number;
      };
      price?: {
        raw: number;
        formatted: string;
        pricingOptionId: string;
      };
      legs?: {
        id: string;
        origin: {
          id: string;
          entityId: string;
          name: string;
          displayCode: string;
          city: string;
          country: string;
          isHighlighted: boolean;
        };
        destination: {
          id: string;
          entityId: string;
          name: string;
          displayCode: string;
          city: string;
          country: string;
          isHighlighted: boolean;
        };
        durationInMinutes: number;
        stopCount: number;
        isSmallestStops: boolean;
        departure: string;
        arrival: string;
        timeDeltaInDays: number;
        carriers: {
          marketing: {
            id: number;
            alternateId: string;
            logoUrl: string;
            name: string;
          }[];
          operating: {
            id: number;
            alternateId: string;
            logoUrl: string;
            name: string;
          };
          operationType: "not_operated" | "operated" | "mixed";
        };
        segments?: {
          id: string;
          arrival: string;
          departure: string;
          destination: {
            country: string;
            displayCode: string;
            flightPlaceId: string;
            name: string;
            parent: {
              displayCode: string;
              flightPlaceId: string;
              name: string;
              type: EntityType;
            };
            type: EntityType;
          };
          durationInMinutes: number;
          flightNumber: string;
          marketingCarrier: Carrier;
          operatingCarrier: Carrier;
          origin: {
            country: string;
            displayCode: string;
            flightPlaceId: string;
            name: string;
            parent: {
              displayCode: string;
              flightPlaceId: string;
              name: string;
              type: EntityType;
            };
            type: EntityType;
          };
        }[];
      }[];
      isSelfTransfer: boolean;
      isProtectedSelfTransfer: boolean;
      farePolicy: {
        isChangeAllowed: boolean;
        isPartiallyChangeable: boolean;
        isCancellationAllowed: boolean;
        isPartiallyRefundable: boolean;
      };
      tags: string[];
      isMashUp: boolean;
      hasFlexibleOptions: boolean;
      score: number;
    }[];
    messages?: string[];
    flightsSessionId: string;
    destinationImageUrl: string;
  };
}
