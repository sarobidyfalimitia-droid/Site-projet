"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPostSchema = void 0;
const zod_1 = require("zod");
exports.blogPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    slug: zod_1.z.string().min(2).regex(/^[a-z0-9-]+$/),
    excerpt: zod_1.z.string().min(20),
    content: zod_1.z.string().min(20),
    coverImage: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    tags: zod_1.z.array(zod_1.z.string()).optional().default([]),
    published: zod_1.z.boolean().optional(),
    publishedAt: zod_1.z.string().datetime().optional().or(zod_1.z.literal('')),
});
//# sourceMappingURL=blogPost.validator.js.map