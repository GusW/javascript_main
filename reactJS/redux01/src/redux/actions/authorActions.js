import * as types from "./actionTypes";
import * as authorApi from "../../api/authorApi";

export const loadAuthorsSuccess = (authors) => {
  return { type: types.LOAD_AUTHORS_SUCCESS, authors };
};

export const loadAuthors = () => async (dispatch) => {
  try {
    const authors = await authorApi.getAuthors();
    dispatch(loadAuthorsSuccess(authors));
  } catch (error) {
    throw error;
  }
};
