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

// Matches the ResponseSchema BaseModel
export const GrabeklisAPISchema = z.object({
    date: z.string()
    .regex(YYYYMMDD_REGEX, "Invalid date format. Expected YYYYMMDD.")
    .transform((val) => {
        const year = parseInt(val.substring(0, 4), 10);
        const month = parseInt(val.substring(4, 6), 10);
        const day = parseInt(val.substring(6, 8), 10);
        return new Date(year, month - 1, day);
    }),
    summaries: z.array(SummarySchema)
});

// You can also infer the TypeScript types directly from your Zod schemas:
export type Article = z.infer<typeof ArticleSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type GrabeklisAPISchemaType = z.infer<typeof GrabeklisAPISchema>;