import { NextRequest, NextResponse } from "next/server";

import { upcomingEvents } from "@/data/events";

// simple in-memory store for engagement (not the base event list)
let events = new Map<string, { attendees: Set<string>; reminders: Map<string, string[]>; votes: Map<string, number>; comments: { id: string; userId: string; text: string; createdAt: string }[] }>();

function ensure(id: string) {
  if (!events.has(id)) {
    events.set(id, { attendees: new Set(), reminders: new Map(), votes: new Map(), comments: [] });
  }
  return events.get(id)!;
}

export async function GET(req: NextRequest) {
  try {
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return new NextResponse(JSON.stringify({ events: upcomingEvents }), { status: 200, headers });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, eventId, userId, when, text } = body;
    if (!eventId || !userId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const state = ensure(eventId);

    switch (action) {
      case "rsvp": {
        if (state.attendees.has(userId)) state.attendees.delete(userId); else state.attendees.add(userId);
        return NextResponse.json({ attendees: state.attendees.size, attending: state.attendees.has(userId) });
      }
      case "remind": {
        const list = state.reminders.get(userId) || [];
        const w = when || "1h";
        if (!list.includes(w)) list.push(w);
        state.reminders.set(userId, list);
        return NextResponse.json({ reminders: list });
      }
      case "vote": {
        const v = state.votes.get(userId) || 0;
        const next = v === 1 ? 0 : 1; // toggle upvote
        state.votes.set(userId, next);
        const total = Array.from(state.votes.values()).reduce((a, b) => a + b, 0);
        return NextResponse.json({ total, upvoted: next === 1 });
      }
      case "comment": {
        if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });
        const c = { id: `c-${Date.now()}`, userId, text, createdAt: new Date().toISOString() };
        state.comments.push(c);
        return NextResponse.json({ comment: c, count: state.comments.length });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (e) {
    console.error("/api/events error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
