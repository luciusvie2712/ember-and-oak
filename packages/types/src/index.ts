export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
};

export type ApiStatus = {
  name: "ember-and-oak-api";
  status: "ok";
};

export * from "./content/chef.js";
export * from "./content/gallery.js";
export * from "./content/home.js";
export * from "./content/media.js";
export * from "./content/menu.js";
export * from "./content/shared.js";
export * from "./content/story.js";
export * from "./reservation/index.js";
