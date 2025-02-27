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

export interface PopularSearchedCardsByTCG {
  [key: string]: { cardName: string; count: number }[];
}

export interface PopularClickedCardsByTCG {
  [key: string]: { cardName: string; count: number; averagePrice: number }[];
}

export interface PopularClickedSetsByTCG {
  [key: string]: { setName: string; count: number }[];
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

  public async getUsersByDevice(startDate: Date, endDate: Date = new Date()): Promise<UsersByDeviceData> {
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
            name: 'totalUsers',
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

  public async getSearchQueriesWithParams(startDate: Date, endDate: Date = new Date(), includePreviousPeriod: boolean = false) {
    // Calculate the length of the period in milliseconds
    const periodLength = endDate.getTime() - startDate.getTime();
    const numberOfDays = Math.ceil(periodLength / (1000 * 60 * 60 * 24));
    
    // Calculate previous period dates if needed
    const previousStartDate = includePreviousPeriod ? new Date(startDate.getTime() - periodLength) : null;
    const previousEndDate = includePreviousPeriod ? new Date(endDate.getTime() - periodLength) : null;

    // Get daily search counts
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

    // Process the initial data to ensure we have the dates
    const searchToolByDate: { [date: string]: { [tool: string]: number } } = {};
    const tcgByDate: { [date: string]: { [tcg: string]: number } } = {};
    
    // Initialize the data structures for each date
    dailyData.forEach(day => {
      searchToolByDate[day.date] = {};
      tcgByDate[day.date] = {};
    });

    // Get search_tool breakdown using a separate query
    try {
      // Run a separate report for each parameter
      const [searchToolParamResponse] = await this.client.runReport({
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
          {
            name: "customEvent:search_tool",
          },
        ],
        metrics: [
          {
            name: "eventCount",
          },
        ],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: {
              value: "search_query",
              matchType: "EXACT",
            },
          },
        },
      });

      // Process search_tool data
      searchToolParamResponse?.rows?.forEach((row: any) => {
        const date = row.dimensionValues?.[0]?.value || "";
        const searchTool = row.dimensionValues?.[1]?.value || "unknown";
        const count = parseInt(row.metricValues?.[0]?.value || "0", 10);
        
        if (!searchToolByDate[date]) {
          searchToolByDate[date] = {};
        }
        
        searchToolByDate[date][searchTool] = count;
      });
    } catch (error) {
      console.error("Error fetching search_tool parameter data:", error);
      // If there's an error, we'll continue with empty data for this parameter
    }

    // Get tcg breakdown using a separate query
    try {
      const [tcgParamResponse] = await this.client.runReport({
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
          filter: {
            fieldName: "eventName",
            stringFilter: {
              value: "search_query",
              matchType: "EXACT",
            },
          },
        },
      });

      // Process tcg data
      tcgParamResponse?.rows?.forEach((row: any) => {
        const date = row.dimensionValues?.[0]?.value || "";
        const tcg = row.dimensionValues?.[1]?.value || "unknown";
        const count = parseInt(row.metricValues?.[0]?.value || "0", 10);
        
        if (!tcgByDate[date]) {
          tcgByDate[date] = {};
        }
        
        tcgByDate[date][tcg] = count;
      });
    } catch (error) {
      console.error("Error fetching tcg parameter data:", error);
      // If there's an error, we'll continue with empty data for this parameter
    }

    // Combine all data
    const enrichedDailyData = dailyData.map(dayData => ({
      ...dayData,
      search_tools: searchToolByDate[dayData.date] || {},
      tcgs: tcgByDate[dayData.date] || {}
    }));

    // Calculate total searches and average
    const totalSearches = dailyData.reduce((sum, day) => sum + day.count, 0);
    const averageDailySearches = Math.round((totalSearches / numberOfDays));

    // If we don't need previous period data, return early
    if (!includePreviousPeriod || !previousStartDate || !previousEndDate) {
      return {
        data: enrichedDailyData,
        totalSearches,
        averageDailySearches
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
      data: enrichedDailyData,
      totalSearches,
      previousPeriodSearches: previousTotalSearches,
      percentageChange: Math.round(percentageChange * 10) / 10, // Round to 1 decimal place
      averageDailySearches
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

  public async getBuyClicksWithParams(startDate: Date, endDate: Date = new Date(), includePreviousPeriod: boolean = false) {
    // Calculate the length of the period in milliseconds
    const periodLength = endDate.getTime() - startDate.getTime();
    const numberOfDays = Math.ceil(periodLength / (1000 * 60 * 60 * 24));
    
    // Calculate previous period dates if needed
    const previousStartDate = includePreviousPeriod ? new Date(startDate.getTime() - periodLength) : null;
    const previousEndDate = includePreviousPeriod ? new Date(endDate.getTime() - periodLength) : null;

    // Get daily buy click counts
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

    // Process the initial data to ensure we have the dates
    const tcgByDate: { [date: string]: { [tcg: string]: number } } = {};
    
    // Initialize the data structures for each date
    dailyData.forEach(day => {
      tcgByDate[day.date] = {};
    });

    // Get tcg breakdown using a separate query
    try {
      const [tcgParamResponse] = await this.client.runReport({
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
          filter: {
            fieldName: "eventName",
            stringFilter: {
              value: "buy_button_click",
              matchType: "EXACT",
            },
          },
        },
      });

      // Process tcg data
      tcgParamResponse?.rows?.forEach((row: any) => {
        const date = row.dimensionValues?.[0]?.value || "";
        const tcg = row.dimensionValues?.[1]?.value || "unknown";
        const count = parseInt(row.metricValues?.[0]?.value || "0", 10);
        
        if (!tcgByDate[date]) {
          tcgByDate[date] = {};
        }
        
        tcgByDate[date][tcg] = count;
      });
    } catch (error) {
      console.error("Error fetching tcg parameter data:", error);
      // If there's an error, we'll continue with empty data for this parameter
    }

    // Combine all data
    const enrichedDailyData = dailyData.map(dayData => ({
      ...dayData,
      tcgs: tcgByDate[dayData.date] || {}
    }));

    // Calculate total buy clicks and average
    const totalBuyClicks = dailyData.reduce((sum, day) => sum + day.count, 0);
    const averageDailyBuyClicks = Math.round((totalBuyClicks / numberOfDays) * 10) / 10;

    // If we don't need previous period data, return early
    if (!includePreviousPeriod || !previousStartDate || !previousEndDate) {
      return {
        data: enrichedDailyData,
        totalBuyClicks,
        averageDailyBuyClicks
      };
    }

    // Get total buy clicks for the previous period
    const previousResponse = await this.runReport(
      ["eventCount"],
      previousStartDate,
      previousEndDate,
      "buy_button_click"
    );

    const previousTotalBuyClicks = previousResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0].value || "0", 10),
      0
    ) || 0;

    // Calculate percentage change
    const percentageChange = previousTotalBuyClicks > 0 
      ? ((totalBuyClicks - previousTotalBuyClicks) / previousTotalBuyClicks) * 100
      : 0;

    return {
      data: enrichedDailyData,
      totalBuyClicks,
      previousPeriodBuyClicks: previousTotalBuyClicks,
      percentageChange: Math.round(percentageChange * 10) / 10, // Round to 1 decimal place
      averageDailyBuyClicks
    };
  }

  public async getVendorBuyClicks(startDate: Date, endDate: Date, limit: number = 5): Promise<VendorBuyClicksResponse> {
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
      .slice(0, limit > 0 ? limit : undefined)
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

  public async getEngagementTime(startDate: Date, endDate: Date = new Date(), includePreviousPeriod: boolean = false) {
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
          name: "averageSessionDuration"
        }
      ]
    });

    const averageEngagementTime = parseFloat(response.rows?.[0]?.metricValues?.[0]?.value || "0");

    // If we don't need previous period data, return early
    if (!includePreviousPeriod || !previousStartDate || !previousEndDate) {
      return {
        averageEngagementTime
      };
    }

    // Get data for the previous period
    const [previousResponse] = await this.client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: format(previousStartDate, "yyyy-MM-dd"),
          endDate: format(previousEndDate, "yyyy-MM-dd"),
        },
      ],
      metrics: [
        {
          name: "averageSessionDuration"
        }
      ]
    });

    const previousAverageEngagementTime = parseFloat(previousResponse.rows?.[0]?.metricValues?.[0]?.value || "0");

    // Calculate percentage change
    const percentageChange = previousAverageEngagementTime > 0 
      ? ((averageEngagementTime - previousAverageEngagementTime) / previousAverageEngagementTime) * 100
      : 0;

    return {
      averageEngagementTime,
      previousPeriodAverageEngagementTime: previousAverageEngagementTime,
      percentageChange: Math.round(percentageChange * 10) / 10 // Round to 1 decimal place
    };
  }

  public async getCityAnalytics(startDate: Date, endDate: Date = new Date()) {
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
          name: "city"
        }
      ],
      metrics: [
        {
          name: "totalUsers"
        }
      ],
      orderBys: [
        {
          metric: {
            metricName: "totalUsers"
          },
          desc: true
        }
      ]
    });

    const totalUsers = response.rows?.reduce(
      (sum: number, row) => sum + parseInt(row.metricValues?.[0].value || "0", 10),
      0
    ) || 0;

    const data = response.rows?.map(row => {
      const users = parseInt(row.metricValues?.[0].value || "0", 10);
      return {
        city: row.dimensionValues?.[0].value || "Unknown",
        users,
        percentage: Math.round((users / totalUsers) * 1000) / 10 // Round to 1 decimal
      };
    }) || [];

    return {
      data,
      totalUsers
    };
  }

  public async getTrafficSources(startDate: Date, endDate: Date = new Date()) {
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
          name: "sessionSource"
        }
      ],
      metrics: [
        {
          name: "totalUsers"
        }
      ],
      orderBys: [
        {
          metric: {
            metricName: "totalUsers"
          },
          desc: true
        }
      ]
    });

    const totalUsers = response.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0].value || "0", 10),
      0
    ) || 0;

    const data = response.rows?.map(row => {
      const users = parseInt(row.metricValues?.[0].value || "0", 10);
      const source = row.dimensionValues?.[0].value || "(direct)";
      
      // Normalize source names
      let normalizedSource = source;
      if (source === "(direct)" || source === "(none)" || source === "(not set)") {
        normalizedSource = source === "(not set)" ? "Unknown" : "Direct";
      } else if (source.includes("google")) {
        normalizedSource = "Google";
      } else if (source.includes("facebook") || source.includes("instagram") || source.includes("twitter")) {
        normalizedSource = "Social";
      } else if (source === "github.com") {
        normalizedSource = "GitHub";
      }

      return {
        source: normalizedSource,
        users,
        percentage: Math.round((users / totalUsers) * 1000) / 10 // Round to 1 decimal
      };
    }) || [];

    // Aggregate data by normalized source
    const aggregatedData = data.reduce((acc, item) => {
      const existing = acc.find(x => x.source === item.source);
      if (existing) {
        existing.users += item.users;
        existing.percentage += item.percentage;
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as typeof data);

    // Recalculate percentages after aggregation
    aggregatedData.forEach(item => {
      item.percentage = Math.round((item.users / totalUsers) * 1000) / 10;
    });

    // Sort by users count and get top 8 sources
    const topSources = aggregatedData
      .sort((a, b) => b.users - a.users)
      .slice(0, 8);

    return {
      data: topSources,
      totalUsers
    };
  }

  public async getUserTypes(startDate: Date, endDate: Date = new Date()) {
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
          name: "newVsReturning"
        }
      ],
      metrics: [
        {
          name: "totalUsers"
        }
      ]
    });

    const data = response.rows?.reduce((acc, row) => {
      const type = row.dimensionValues?.[0].value || "unknown";
      const users = parseInt(row.metricValues?.[0].value || "0", 10);
      
      if (type === "new") {
        acc.newUsers = users;
      } else if (type === "returning") {
        acc.returningUsers = users;
      }
      
      return acc;
    }, { newUsers: 0, returningUsers: 0 });

    const total = (data?.newUsers || 0) + (data?.returningUsers || 0);
    
    return {
      data: [
        {
          type: "New",
          users: data?.newUsers || 0,
          percentage: total > 0 ? Math.round((data?.newUsers || 0) / total * 1000) / 10 : 0
        },
        {
          type: "Returning",
          users: data?.returningUsers || 0,
          percentage: total > 0 ? Math.round((data?.returningUsers || 0) / total * 1000) / 10 : 0
        }
      ],
      total
    };
  }

  public async getUserRetention() {
    // Calculate date range for the last year
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    // Create monthly cohorts for the last year
    const cohorts = Array.from({ length: 12 }, (_, i) => {
      const cohortDate = new Date();
      cohortDate.setMonth(cohortDate.getMonth() - i);
      return {
        dimension: "firstSessionDate",
        dateRange: {
          startDate: format(new Date(cohortDate.getFullYear(), cohortDate.getMonth(), 1), "yyyy-MM-dd"),
          endDate: format(new Date(cohortDate.getFullYear(), cohortDate.getMonth() + 1, 0), "yyyy-MM-dd"),
        }
      };
    });

    const [response] = await this.client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dimensions: [
        {
          name: "cohort"
        },
        {
          name: "cohortNthMonth"
        }
      ],
      metrics: [
        {
          name: "totalUsers"
        }
      ],
      cohortSpec: {
        cohorts,
        cohortsRange: {
          granularity: "MONTHLY",
          startOffset: 0,
          endOffset: 12
        }
      },
      orderBys: [
        {
          dimension: {
            dimensionName: "cohort"
          },
          desc: true
        }
      ]
    });

    // Process the cohort data
    const cohortData: { [key: string]: { data: { [key: string]: number } } } = {};
    let maxUsers = 0;

    response.rows?.forEach((row: any) => {
      const cohortId = row.dimensionValues?.[0].value || "";
      const month = parseInt(row.dimensionValues?.[1].value || "0", 10);
      const users = parseInt(row.metricValues?.[0].value || "0", 10);

      if (!cohortData[cohortId]) {
        cohortData[cohortId] = { data: {} };
      }

      cohortData[cohortId].data[month] = users;
      maxUsers = Math.max(maxUsers, users);
    });

    // Transform the data for visualization
    const retentionData = Object.entries(cohortData).map(([cohortId, { data }]) => {
      const initialUsers = data[0] || 0;
      const monthlyRetention = Object.entries(data).map(([month, users]) => ({
        month: parseInt(month, 10),
        users,
        percentage: initialUsers > 0 ? Math.round((users / initialUsers) * 100) : 0
      }));

      // Get the cohort date from our original cohorts array
      const cohortIndex = parseInt(cohortId.replace('cohort_', ''), 10);
      const cohortDate = new Date();
      cohortDate.setMonth(cohortDate.getMonth() - cohortIndex);
      
      return {
        cohort: format(new Date(cohortDate.getFullYear(), cohortDate.getMonth(), 1), "MMM yyyy"),
        initialUsers,
        retention: monthlyRetention.sort((a, b) => a.month - b.month),
        parsedDate: new Date(cohortDate.getFullYear(), cohortDate.getMonth(), 1)
      };
    });

    // Filter out invalid dates and sort by cohort date
    const validData = retentionData
      .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime())
      .map(({ cohort, initialUsers, retention }) => ({
        cohort,
        initialUsers,
        retention
      }));

    return {
      data: validData,
      maxUsers
    };
  }

  public async getPopularClickedCards(startDate: Date, endDate: Date = new Date()) {
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
          {
            name: 'customEvent:card_price',
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

  public async getPopularClickedSets(startDate: Date, endDate: Date = new Date()) {
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
            name: 'customEvent:set_name',
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
                    fieldName: 'customEvent:set_name',
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
      console.error('Error fetching popular clicked sets:', error);
      throw error;
    }
  }
}


export interface UsersByDeviceData {
  desktop: number;
  mobile: number;
  tablet: number;
}
