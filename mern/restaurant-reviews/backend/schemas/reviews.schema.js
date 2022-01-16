export const reviewCreateSchema = {
  type: "object",
  properties: {
    restaurant_id: { type: "string" },
    user_id: { type: "string" },
    name: { type: "string" },
    text: { type: "string" },
  },
  required: ["restaurant_id", "user_id", "name", "text"],
  additionalProperties: false,
}

export const reviewUpdateSchema = {
  type: "object",
  properties: {
    review_id: { type: "string" },
    user_id: { type: "string" },
    text: { type: "string" },
  },
  required: ["review_id", "user_id", "text"],
  additionalProperties: false,
}

export const reviewDeleteSchema = {
  type: "object",
  properties: {
    id: { type: "string" }, // review_id
    user_id: { type: "string" },
  },
  required: ["id", "user_id"],
  additionalProperties: false,
}
