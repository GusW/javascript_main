import * as types from "./actionTypes";
import * as courseApi from "../../api/courseApi";

export const createCourse = (course) => {
  return { type: types.CREATE_COURSE, course };
};

export const loadCourseSuccess = (courses) => {
  return { type: types.LOAD_COURSES_SUCCESS, courses };
};

export function createCourseSuccess(course) {
  return { type: types.CREATE_COURSE_SUCCESS, course };
}

export function updateCourseSuccess(course) {
  return { type: types.UPDATE_COURSE_SUCCESS, course };
}

export const loadCourses = () => async (dispatch) => {
  try {
    const courses = await courseApi.getCourses();
    dispatch(loadCourseSuccess(courses));
  } catch (error) {
    throw error;
  }
};

//eslint-disable-next-line no-unused-vars
export const saveCourse = (course) => async (dispatch, getState) => {
  // getState would have all the Redux store state
  try {
    const savedCourse = await courseApi.saveCourse(course);
    const target_action = course.id ? updateCourseSuccess : createCourseSuccess;
    dispatch(target_action(savedCourse));
  } catch (error) {
    throw error;
  }
};
