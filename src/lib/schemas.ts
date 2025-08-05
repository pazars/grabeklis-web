import { z } from 'zod';

// Matches the Article BaseModel
export const ArticleSchema = z.object({
    url: z.url("Invalid URL format"),
    ai_summary: z.string().min(1, "Summary cannot be empty"),
    title: z.string(),
});

// Matches the Summary BaseModel
export const SummarySchema = z.object({
    category: z.string().min(1, "Category cannot be empty"),
    articles: z.array(ArticleSchema)
});

const YYYYMMDD_REGEX = /^\d{8}$/; // Matches exactly 8 digits

// A more robust date parsing function that attempts YYYYMMDD, then ISO 8601
const parseFlexibleDateString = (dateString: string): Date => {
    // Attempt to parse as YYYYMMDD first
    if (YYYYMMDD_REGEX.test(dateString)) {
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1; // Month is 0-indexed
        const day = parseInt(dateString.substring(6, 8), 10);
        const date = new Date(year, month, day);

        // Basic validation for YYYYMMDD conversion accuracy
        if (!isNaN(date.getTime()) && date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
            return date;
        }
    }

    // If not YYYYMMDD, or YYYYMMDD parsing failed, try standard Date parsing (handles ISO 8601, etc.)
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) { // Check if it's a valid Date object
        return date;
    }

    // If neither format works, throw an error
    throw new Error(`Invalid date string format: ${dateString}. Expected YYYYMMDD or a valid ISO 8601 string.`);
};

// Matches the ResponseSchema BaseModel
export const GrabeklisAPISchema = z.object({
    date: z.string()
        .transform(parseFlexibleDateString),
    summaries: z.array(SummarySchema)
});

// You can also infer the TypeScript types directly from your Zod schemas:
export type Article = z.infer<typeof ArticleSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type GrabeklisAPISchemaType = z.infer<typeof GrabeklisAPISchema>;