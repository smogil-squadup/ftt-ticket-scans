import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const startTime = performance.now();

    // Single query to get scan count and total attendee count
    const result = await query<{
      scan_count: string;
      total_attendee_count: string;
    }>(
      `SELECT
        SUM(arrived) AS scan_count,
        SUM(guests) AS total_attendee_count
      FROM event_attendees ea
      WHERE event_id = 114879 AND deleted_at IS NULL`
    );

    const endTime = performance.now();
    const queryTimeMs = (endTime - startTime).toFixed(2);

    return NextResponse.json({
      data: result[0] || { scan_count: "0", total_attendee_count: "0" },
      queryTimeMs,
    });
  } catch (error) {
    console.error("Database query error:", error);

    return NextResponse.json(
      {
        error: "Failed to query event attendees",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 }
    );
  }
}
