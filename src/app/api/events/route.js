// src/app/api/events/route.js
import { NextResponse } from "next/server";

const EVENTS_QUERY = `
  query getEvents($lang: String!) {
    events: events(lang: $lang) {
      id
      title
      ticketPrice
      address
      body
      introText
      buyLinkMobile
      buyLinkWebsite
      free
      isTicketing
      latitude
      longitude
      maxPrice
      minPrice
      venue
      phone
      website
      startDate
      endDate
      shareUri
      fallbackImage
      location
      type {
        name
        title
      }
      tags {
        name
        description
        ranking
      }
    }
  }
`;

const filterAndSortEvents = (events) => {
  if (!events || !Array.isArray(events)) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events
    .filter((event) => {
      if (!event.startDate) return false;
      const eventEndDate = new Date(event.endDate);
      return eventEndDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA.getTime() - dateB.getTime();
    });
};

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get("lang") || "en";

    const response = await fetch(
      `https://corsproxy.io/?https://api.visitdubai.com/graphql/event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: EVENTS_QUERY,
          variables: { lang },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${response.statusText} - ${errorText}`,
      );
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0]?.message || "GraphQL error");
    }

    if (json.error) {
      throw new Error(json.error);
    }

    const events = filterAndSortEvents(json.data?.events);

    return NextResponse.json({
      data: json.data,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch events",
      },
      { status: 500 },
    );
  }
}
