import { z } from "zod";
export type { ZodType } from "zod";

export const emailSchema = z.string().trim().email();

export const phoneSchema = z.string().trim().min(6).max(32);

export const requestIdSchema = z.string().uuid();

export * from "./content/chef.js";
export * from "./content/gallery.js";
export * from "./content/home.js";
export * from "./content/media.js";
export * from "./content/menu.js";
export * from "./content/shared.js";
export * from "./content/story.js";

export { z };
