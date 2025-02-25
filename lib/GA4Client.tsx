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

export interface VendorBuyClickData {
  website: string;
  mtg: number;
  pokemon: number;
  yugioh: number;
  onepiece: number;
  lorcana: number;
  fleshandblood: number;
  starwars: number;
  total: number;
  rank: number;
}

export interface VendorBuyClicksResponse {
  data: VendorBuyClickData[];
  startDate: string;
  endDate: string;
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
      orderBys: [
        {
          dimension: {
            dimensionName: "date",
          },
          desc: false,
        },
      ],
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

  public async getUniqueUsers(startDate: Date, endDate: Date = new Date(), includePreviousPeriod: boolean = false) {
    // Calculate the length of the period in milliseconds
    const periodLength = endDate.getTime() - startDate.getTime();
    
    // Calculate previous period dates if needed
    const previousStartDate = includePreviousPeriod ? new Date(startDate.getTime() - periodLength) : null;
    const previousEndDate = includePreviousPeriod ? new Date(endDate.getTime() - periodLength) : null;

    // Current period data
    const [response] = await this.client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        },
      ],
      metrics: [
        {
          name: "totalUsers"
        }
      ],
      dimensions: [
        {
          name: "date"
        }
      ],
      orderBys: [
        {
          dimension: {
            dimensionName: "date"
          },
          desc: false
        }
      ]
    });

    // Get daily breakdown
    const dailyData = response.rows?.map((row: any) => ({
      date: row.dimensionValues?.[0].value || "",
      count: parseInt(row.metricValues?.[0].value || "0", 10),
    })) || [];

    // Get total unique users for the current period
    const [totalResponse] = await this.client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        },
      ],
      metrics: [
        {
          name: "totalUsers"
        }
      ]
    });

    const totalUniqueUsers = parseInt(totalResponse.rows?.[0]?.metricValues?.[0]?.value || "0", 10);

    // If we don't need previous period data, return early
    if (!includePreviousPeriod || !previousStartDate || !previousEndDate) {
      return {
        data: dailyData,
        totalUniqueUsers
      };
    }

    // Get total unique users for the previous period
    const [previousTotalResponse] = await this.client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: format(previousStartDate, "yyyy-MM-dd"),
          endDate: format(previousEndDate, "yyyy-MM-dd"),
        },
      ],
      metrics: [
        {
          name: "totalUsers"
        }
      ]
    });

    const previousTotalUniqueUsers = parseInt(previousTotalResponse.rows?.[0]?.metricValues?.[0]?.value || "0", 10);

    // Calculate percentage change
    const percentageChange = previousTotalUniqueUsers > 0 
      ? ((totalUniqueUsers - previousTotalUniqueUsers) / previousTotalUniqueUsers) * 100
      : 0;

    return {
      data: dailyData,
      totalUniqueUsers,
      previousPeriodUniqueUsers: previousTotalUniqueUsers,
      percentageChange: Math.round(percentageChange * 10) / 10 // Round to 1 decimal place
    };
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

  public async getSearchQueries(startDate: Date, endDate: Date = new Date(), includePreviousPeriod: boolean = false) {
    // Calculate the length of the period in milliseconds
    const periodLength = endDate.getTime() - startDate.getTime();
    
    // Calculate previous period dates if needed
    const previousStartDate = includePreviousPeriod ? new Date(startDate.getTime() - periodLength) : null;
    const previousEndDate = includePreviousPeriod ? new Date(endDate.getTime() - periodLength) : null;

    // Current period data
    const response = await this.runReport(
      ["eventCount"],
      startDate,
      endDate,
      "search_query"
    );

    // Get daily breakdown
    const dailyData = response.rows?.map((row: any) => ({
      date: row.dimensionValues?.[0].value || "",
      count: parseInt(row.metricValues?.[0].value || "0", 10),
    })) || [];

    // Get total searches for the current period
    const totalSearches = dailyData.reduce((sum, day) => sum + day.count, 0);

    // If we don't need previous period data, return early
    if (!includePreviousPeriod || !previousStartDate || !previousEndDate) {
      return {
        data: dailyData,
        totalSearches
      };
    }

    // Get total searches for the previous period
    const previousResponse = await this.runReport(
      ["eventCount"],
      previousStartDate,
      previousEndDate,
      "search_query"
    );

    const previousTotalSearches = previousResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0].value || "0", 10),
      0
    ) || 0;

    // Calculate percentage change
    const percentageChange = previousTotalSearches > 0 
      ? ((totalSearches - previousTotalSearches) / previousTotalSearches) * 100
      : 0;

    return {
      data: dailyData,
      totalSearches,
      previousPeriodSearches: previousTotalSearches,
      percentageChange: Math.round(percentageChange * 10) / 10 // Round to 1 decimal place
    };
  }

  public async getBuyClicks(startDate: Date, endDate: Date = new Date(), includePreviousPeriod: boolean = false) {
    // Calculate the length of the period in milliseconds
    const periodLength = endDate.getTime() - startDate.getTime();
    
    // Calculate previous period dates if needed
    const previousStartDate = includePreviousPeriod ? new Date(startDate.getTime() - periodLength) : null;
    const previousEndDate = includePreviousPeriod ? new Date(endDate.getTime() - periodLength) : null;

    // Current period data
    const response = await this.runReport(
      ["eventCount"],
      startDate,
      endDate,
      "buy_button_click"
    );

    // Get daily breakdown
    const dailyData = response.rows?.map((row: any) => ({
      date: row.dimensionValues?.[0].value || "",
      count: parseInt(row.metricValues?.[0].value || "0", 10),
    })) || [];

    // Get total clicks for the current period
    const totalClicks = dailyData.reduce((sum, day) => sum + day.count, 0);

    // If we don't need previous period data, return early
    if (!includePreviousPeriod || !previousStartDate || !previousEndDate) {
      return {
        data: dailyData,
        totalClicks
      };
    }

    // Get total clicks for the previous period
    const previousResponse = await this.runReport(
      ["eventCount"],
      previousStartDate,
      previousEndDate,
      "buy_button_click"
    );

    const previousTotalClicks = previousResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0].value || "0", 10),
      0
    ) || 0;

    // Calculate percentage change
    const percentageChange = previousTotalClicks > 0 
      ? ((totalClicks - previousTotalClicks) / previousTotalClicks) * 100
      : 0;

    return {
      data: dailyData,
      totalClicks,
      previousPeriodClicks: previousTotalClicks,
      percentageChange: Math.round(percentageChange * 10) / 10 // Round to 1 decimal place
    };
  }

  public async getVendorBuyClicks(startDate: Date, endDate: Date): Promise<VendorBuyClicksResponse> {
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
          name: "eventName",
        },
        {
          name: "customEvent:website",
        },
        {
          name: "customEvent:tcg",
        },
      ],
      metrics: [
        {
          name: "eventCount",
        },
      ],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: "eventName",
                stringFilter: {
                  matchType: "EXACT",
                  value: "buy_button_click",
                },
              },
            },
            {
              notExpression: {
                filter: {
                  fieldName: "customEvent:website",
                  stringFilter: {
                    matchType: "EXACT",
                    value: "(not set)",
                  },
                },
              },
            },
            {
              notExpression: {
                filter: {
                  fieldName: "customEvent:website",
                  stringFilter: {
                    matchType: "EXACT",
                    value: "snapcaster.ca",
                  },
                },
              },
            },
            {
              notExpression: {
                filter: {
                  fieldName: "customEvent:tcg",
                  stringFilter: {
                    matchType: "EXACT",
                    value: "(not set)",
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
            metricName: "eventCount",
          },
          desc: true,
        },
      ],
    });

    const buyClickData = response.rows?.map((row) => ({
      website: row.dimensionValues?.[1].value || "",
      tcg: row.dimensionValues?.[2].value?.toLowerCase() || "",
      count: parseInt(row.metricValues?.[0].value || "0", 10),
    })) || [];

    const groupedData: { [key: string]: Omit<VendorBuyClickData, "rank"> } = {};

    buyClickData.forEach(({ website, tcg, count }) => {
      if (!groupedData[website]) {
        groupedData[website] = {
          website,
          mtg: 0,
          pokemon: 0,
          yugioh: 0,
          onepiece: 0,
          lorcana: 0,
          fleshandblood: 0,
          starwars: 0,
          total: 0,
        };
      }

      if (tcg in groupedData[website]) {
        (groupedData[website][tcg as keyof typeof groupedData[string]] as number) += count;
      }

      groupedData[website].total += count;
    });

    const sortedData = Object.values(groupedData)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((data, index) => ({
        ...data,
        rank: index + 1,
      }));

    return {
      data: sortedData,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    };
  }
}

export interface UsersByDeviceData {
  desktop: number;
  mobile: number;
  tablet: number;
}
