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
  const searchType = request.query.type as string;
  const searchValue = request.query.searchValue as string;

  // Make sure type and searchValue are provided
  if (!searchType || !searchValue) {
    response.status(400).json({
      message: "type and searchValue are required",
    });
    return;
  }

  // Validate type
  if (searchType !== "content" && searchType !== "phone_number") {
    response.status(400).json({
      message: "type must be either 'content' or 'phone_number'",
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

  // Calculate offset
  const offset = (page - 1) * limit;

  let query = "";
  let countQuery = "";

  if (searchType === "content") {
    const formattedSearchValue = searchValue.trim().split(/\s+/).join(" & ");
    const filter = as.format(
      "WHERE content_vector @@ to_tsquery('english', $1)",
      `'${formattedSearchValue}'`,
    );

    query =
      "SELECT id, contact_id, content, created_at FROM message " +
      filter +
      `LIMIT ${limit} OFFSET ${offset}`;

    countQuery = "SELECT COUNT(*) as total FROM message " + filter;
  } else if (searchType === "phone_number") {
    // Remove all non-digit characters from the search value
    const formattedSearchValue = searchValue.trim().replace(/\D/g, "");

    // Check if the formatted search value is empty
    if (formattedSearchValue.length === 0) {
      response.status(400).json({
        message: "Invalid phone number format",
      });
      return;
    }

    const filter = as.format("WHERE c.phone_number ~ $1", formattedSearchValue);

    query =
      `
      SELECT m.id, m.contact_id, c.phone_number, m.content, m.created_at 
      FROM message m 
      JOIN contact c ON m.contact_id = c.id ` + filter +
      `LIMIT ${limit} OFFSET ${offset}`;

    countQuery =
      "SELECT COUNT(*) as total FROM message m " +
      "JOIN contact c ON m.contact_id = c.id " +
      filter;
  }

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
