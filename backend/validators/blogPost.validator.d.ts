import { z } from 'zod';
export declare const blogPostSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    excerpt: z.ZodString;
    content: z.ZodString;
    coverImage: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    published: z.ZodOptional<z.ZodBoolean>;
    publishedAt: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    excerpt: string;
    title: string;
    slug: string;
    content: string;
    tags: string[];
    published?: boolean | undefined;
    coverImage?: string | undefined;
    publishedAt?: string | undefined;
}, {
    excerpt: string;
    title: string;
    slug: string;
    content: string;
    published?: boolean | undefined;
    coverImage?: string | undefined;
    tags?: string[] | undefined;
    publishedAt?: string | undefined;
}>;
