import type { MediaAsset } from "@ember-and-oak/types";
import { z } from "zod";

import { contentIdSchema, contentTimestampsSchema, optionalTextSchema } from "./shared.js";

export const mediaAssetSchema: z.ZodType<MediaAsset> = z
  .object({
    id: contentIdSchema,
    assetType: z.enum(["IMAGE", "VIDEO"]),
    sourceUrl: z.union([z.url(), z.string().trim().startsWith("/")]),
    storageKey: optionalTextSchema,
    mimeType: z
      .string()
      .trim()
      .regex(/^(image|video)\/[a-z0-9.+-]+$/i),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    aspectRatio: z.number().positive().finite(),
    fileSizeBytes: z.number().int().positive().optional(),
    altText: optionalTextSchema,
    isDecorative: z.boolean(),
    caption: optionalTextSchema,
    focalPointX: z.number().min(0).max(1).optional(),
    focalPointY: z.number().min(0).max(1).optional(),
    credit: optionalTextSchema,
    copyrightOwner: optionalTextSchema,
    usageRights: optionalTextSchema,
    ...contentTimestampsSchema.shape,
  })
  .superRefine((asset, context) => {
    const expectedRatio = asset.width / asset.height;
    if (Math.abs(asset.aspectRatio - expectedRatio) > 0.001) {
      context.addIssue({
        code: "custom",
        path: ["aspectRatio"],
        message: "aspectRatio must match width / height",
      });
    }

    if (!asset.isDecorative && !asset.altText) {
      context.addIssue({
        code: "custom",
        path: ["altText"],
        message: "Informative media requires alt text",
      });
    }

    if (asset.assetType === "IMAGE" && !asset.mimeType.startsWith("image/")) {
      context.addIssue({
        code: "custom",
        path: ["mimeType"],
        message: "Image assets require an image MIME type",
      });
    }

    if (asset.assetType === "VIDEO" && !asset.mimeType.startsWith("video/")) {
      context.addIssue({
        code: "custom",
        path: ["mimeType"],
        message: "Video assets require a video MIME type",
      });
    }
  });
