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
