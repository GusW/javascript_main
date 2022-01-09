export class RestaurantReviewError extends Error {
  constructor(...args) {
    super(...args)
    this.status = 500
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RestaurantReviewError)
    }
  }
}

export class ItemNotFoundError extends Error {
  constructor(...args) {
    super(...args)
    this.status = 404
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ItemNotFoundError)
    }
  }
}

export class RestaurantReviewUserError extends Error {
  constructor(...args) {
    super(...args)
    this.status = 403
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RestaurantReviewUserError)
    }
  }
}

export class RestaurantError extends Error {
  constructor(...args) {
    super(...args)
    this.status = 500
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RestaurantError)
    }
  }
}

export class RestaurantGetByIdValidationError extends Error {
  constructor(...args) {
    super(...args)
    this.status = 422
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RestaurantGetByIdValidationError)
    }
  }
}
