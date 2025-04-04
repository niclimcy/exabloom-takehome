import { Request, Response } from "express";
import { db } from "../database";

async function getRecentMessages(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    // Extract pagination parameters from query
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 50;

    // Validate pagination parameters
    if (page < 1) {
      response.status(400).json({
        message: "Page must be greater than or equal to 1",
      });
    }

    if (limit < 1 || limit > 100) {
      response.status(400).json({
        message: "Limit must be between 1 and 100",
      });
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM message`;
    const countResult = await db.one(countQuery);
    const total = parseInt(countResult.total);

    // Fetch paginated messages
    const query = `
      SELECT * FROM message
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const messages = await db.manyOrNone(query);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    response.status(200).json({
      messages,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({
        message: "Error fetching messages",
        error: error.message,
      });
    } else {
      response.status(500).json({
        message: "Error fetching messages",
        error: "Unknown error",
      });
    }
  }
}

export { getRecentMessages };
