import Ajv from "ajv"
import {
  reviewCreateSchema,
  reviewDeleteSchema,
  reviewUpdateSchema,
} from "./reviews.schema.js"

const validator = (reviewData) => {
  const baseValidate = new Ajv()

  const _validatorWrapper = (schema) => {
    const reviewsValidator = baseValidate.compile(schema)
    if (reviewsValidator(reviewData)) return reviewData
    throw Error(reviewsValidator.errors)
  }

  const validateReviewCreate = () => _validatorWrapper(reviewCreateSchema)

  const validateReviewUpdate = () => _validatorWrapper(reviewUpdateSchema)

  const validateReviewDelete = () => _validatorWrapper(reviewDeleteSchema)

  return { validateReviewCreate, validateReviewUpdate, validateReviewDelete }
}

export default validator
