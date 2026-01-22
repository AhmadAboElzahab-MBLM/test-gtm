// src/app/api/events/route.js
import { NextResponse } from "next/server";

const EVENTS_QUERY = `
  query getEvents($lang: String!) {
    events: events(lang: $lang) {
      id
      title
      ticketPrice
      address
      startDate
      endDate
      venue
      # ... rest of your fields
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

    // Prepare the request payload
    const payload = {
      query: EVENTS_QUERY,
      variables: { lang },
    };

    // Use AllOrigins to proxy the request
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent("https://api.visitdubai.com/graphql/event")}`;

    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0]?.message || "GraphQL error");
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
