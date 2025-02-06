import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { subYears, format, subDays } from "date-fns";

const GA4_PROPERTY_ID = "414002558";

const getGoogleCredentials = () => {
  const base64Credentials = process.env.GOOGLE_CREDENTIALS;
  if (!base64Credentials) {
    throw new Error("Missing Google credentials");
  }
  const jsonString = Buffer.from(base64Credentials, "base64").toString("utf8");
  return JSON.parse(jsonString);
};

const CREDENTIALS = getGoogleCredentials();

export interface PopularSearchedCard {
  cardName: string;
  tcg: string;
  count: number;
}

export interface PopularBuyClicksByTCG {
  [key: string]: { cardName: string; count: number }[];
}

export class GA4Client {
  private client: BetaAnalyticsDataClient;

  constructor() {
    this.client = new BetaAnalyticsDataClient({
      credentials: CREDENTIALS,
    });
  }

  private async runReport(
    metrics: string[],
    startDate: Date,
    endDate: Date = new Date(),
    eventName?: string
  ) {
    const [response] = await this.client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        },
      ],
      dimensions: [
        {
          name: "date",
        },
      ],
      metrics: metrics.map((metric) => ({ name: metric })),
      ...(eventName && {
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: {
              value: eventName,
              matchType: "EXACT",
            },
          },
        },
      }),
    });

    return response;
  }

  public async getSearchQueryEvents() {
    const startDate = subYears(new Date(), 1);
    const response = await this.runReport(
      ["eventCount"],
      startDate,
      undefined,
      "search_query"
    );

    const data =
      response.rows?.map((row) => ({
        date: row.dimensionValues?.[0].value || "",
        count: parseInt(row.metricValues?.[0].value || "0", 10),
      })) || [];

    return data;
  }

  public async getBuyButtonClicks() {
    const startDate = subYears(new Date(), 1);
    const response = await this.runReport(
      ["eventCount"],
      startDate,
      undefined,
      "buy_button_click"
    );

    const data =
      response.rows?.map((row) => ({
        date: row.dimensionValues?.[0].value || "",
        count: parseInt(row.metricValues?.[0].value || "0", 10),
      })) || [];
    
    return data;
  }

  public async getActiveUsers(startDate: Date, endDate: Date = new Date()) {
    const response = await this.runReport(["activeUsers"], startDate, endDate);

    const data =
      response.rows?.map((row: any) => ({
        date: row.dimensionValues?.[0].value || "",
        count: parseInt(row.metricValues?.[0].value || "0", 10),
      })) || [];
    return data;
  }

  public async getActiveUsersLast30Min() {
    const [response] = await this.client.runRealtimeReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
      minuteRanges: [
        {
          name: 'last_30_minutes',
          startMinutesAgo: 29,
          endMinutesAgo: 0,
        },
      ],
    });

    const uniqueUsers = response.rows?.[0]?.metricValues?.[0]?.value ?? '0';
    return parseInt(uniqueUsers, 10);
  }

  public async getBuyClicksByDay(numberOfDays: number) {
    const endDate = new Date();
    const startDate = subDays(endDate, numberOfDays);

    const [response] = await this.client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        },
      ],
      dimensions: [
        {
          name: 'date'
        }
      ],
      metrics: [
        {
          name: 'eventCount'
        }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'buy_button_click',
            matchType: 'EXACT',
          },
        },
      },
      orderBys: [
        {
          dimension: {
            dimensionName: "date",
          },
          desc: false,
        },
      ],
    });

    const data = response.rows?.map((row: any) => ({
      date: row.dimensionValues?.[0].value || "",
      count: parseInt(row.metricValues?.[0].value || "0", 10),
    })) || [];

    return data;
  }

  public async getSearchQueriesByDay(numberOfDays: number) {
    const endDate = subDays(new Date(), 2);
    const startDate = subDays(endDate, numberOfDays);

    const [response] = await this.client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        },
      ],
      dimensions: [
        {
          name: 'date'
        }
      ],
      metrics: [
        {
          name: 'eventCount'
        }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'search_query',
            matchType: 'EXACT',
          },
        },
      },
      orderBys: [
        {
          dimension: {
            dimensionName: "date",
          },
          desc: false,
        },
      ],
    });

    const data = response.rows?.map((row: any) => ({
      date: row.dimensionValues?.[0].value || "",
      count: parseInt(row.metricValues?.[0].value || "0", 10),
    })) || [];

    return data;
  }

  public async getSearchQueriesLast30Min() {
    const [response] = await this.client.runRealtimeReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      metrics: [
        {
          name: 'eventCount'
        }
      ],
      minuteRanges: [
        {
          name: 'last_30_minutes',
          startMinutesAgo: 29,
          endMinutesAgo: 0,
        }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'search_query',
            matchType: 'EXACT',
          },
        },
      },
    });

    const searchCount = response.rows?.[0]?.metricValues?.[0]?.value ?? '0';
    return parseInt(searchCount, 10);
  }

  public async getUsersByDevice(numberOfDays: number): Promise<UsersByDeviceData> {
    const endDate = new Date();
    const startDate = subDays(endDate, numberOfDays);

    try {
      const [response] = await this.client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          {
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
          },
        ],
        metrics: [
          {
            name: 'activeUsers',
          },
        ],
        dimensions: [
          {
            name: 'deviceCategory',
          },
        ],
      });

      const aggregatedData = response.rows?.reduce<UsersByDeviceData>(
        (acc, row) => {
          const device = row.dimensionValues?.[0]?.value || 'unknown';
          const users = parseInt(row.metricValues?.[0]?.value || '0', 10);

          if (device === 'desktop') {
            acc.desktop += users;
          } else if (device === 'mobile') {
            acc.mobile += users;
          } else if (device === 'tablet') {
            acc.tablet += users;
          }

          return acc;
        },
        { desktop: 0, mobile: 0, tablet: 0 }
      ) ?? { desktop: 0, mobile: 0, tablet: 0 };

      return aggregatedData;
    } catch (error) {
      console.error('Error fetching users by device:', error);
      throw error;
    }
  }

  public async getPopularBuyClicks(numberOfDays: number = 30, limit: number = 10) {
    const endDate = new Date();
    const startDate = subDays(endDate, numberOfDays);

    try {
      const [response] = await this.client.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          {
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
          },
        ],
        dimensions: [
          {
            name: 'eventName',
          },
          {
            name: 'customEvent:card_name',
          },
          {
            name: 'customEvent:tcg',
          },
        ],
        metrics: [
          {
            name: 'eventCount',
          },
        ],
        dimensionFilter: {
          andGroup: {
            expressions: [
              {
                filter: {
                  fieldName: 'eventName',
                  stringFilter: {
                    matchType: 'EXACT',
                    value: 'buy_button_click',
                  },
                },
              },
              {
                notExpression: {
                  filter: {
                    fieldName: 'customEvent:card_name',
                    stringFilter: {
                      matchType: 'EXACT',
                      value: '(not set)',
                    },
                  },
                },
              },
              {
                notExpression: {
                  filter: {
                    fieldName: 'customEvent:tcg',
                    stringFilter: {
                      matchType: 'EXACT',
                      value: '(not set)',
                    },
                  },
                },
              },
            ],
          },
        },
        orderBys: [
          {
            metric: {
              metricName: 'eventCount',
            },
            desc: true,
          },
        ],
      });

      return response;

    } catch (error) {
      console.error('Error fetching popular searched cards:', error);
      throw error;
    }
  }
}

export interface UsersByDeviceData {
  desktop: number;
  mobile: number;
  tablet: number;
}
