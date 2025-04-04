import { Request, Response } from "express";
import { as, db } from "../database";

async function getRecentMessages(
  request: Request,
  response: Response,
): Promise<void> {
  // Extract pagination parameters from query
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 50;

  // Validate pagination parameters
  if (page < 1) {
    response.status(400).json({
      message: "Page must be greater than or equal to 1",
    });
    return;
  }

  if (limit < 1 || limit > 100) {
    response.status(400).json({
      message: "Limit must be between 1 and 100",
    });
    return;
  }

  // Calculate offset
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) as total FROM message`;
  const query = `
    SELECT id, contact_id, content, created_at FROM message
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  try {
    const [countResult, messages] = await db.multi(countQuery + ";" + query);

    const total = parseInt(countResult[0].total);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Return the result
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

async function searchMessages(
  request: Request,
  response: Response,
): Promise<void> {
  const content = request.query.content as string;
  const phone_number = request.query.phone_number as string;

  // Check if at least one search parameter is provided
  if (!content && !phone_number) {
    response.status(400).json({
      message:
        "At least one search parameter (content or phone_number) is required",
    });
    return;
  }

  // Get pagination
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 50;

  // Validate pagination parameters
  if (page < 1) {
    response.status(400).json({
      message: "Page must be greater than or equal to 1",
    });
    return;
  }
  if (limit < 1 || limit > 100) {
    response.status(400).json({
      message: "Limit must be between 1 and 100",
    });
    return;
  }

  const conditions = [];

  if (content) {
    const formattedContent = content.trim().split(/\s+/).join(" & ");
    conditions.push(
      as.format(
        "m.content_vector @@ to_tsquery('english', $1)",
        `'${formattedContent}'`,
      ),
    );
  }

  if (phone_number) {
    conditions.push(as.format("c.phone_number ILIKE $1", `%${phone_number}%`));
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // Calculate offset
  const offset = (page - 1) * limit;

  // Get total count with filters applied
  const countQuery = `
    SELECT COUNT(*) as total 
    FROM message m
    JOIN contact c ON m.contact_id = c.id
    ${whereClause}`;

  const query = `
    SELECT m.id, m.contact_id, c.phone_number, m.content, m.created_at
    FROM message m
    JOIN contact c ON m.contact_id = c.id
    ${whereClause}
    ORDER BY m.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  try {
    const [countResult, messages] = await db.multi(countQuery + ";" + query);

    const total = parseInt(countResult[0].total);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Return the result
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
        message: "Error searching messages",
        error: error.message,
      });
    } else {
      response.status(500).json({
        message: "Error searching messages",
        error: "Unknown error",
      });
    }
  }
}

export { getRecentMessages, searchMessages };
