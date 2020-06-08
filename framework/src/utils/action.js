import { defaultPrefix } from 'appLoadable';

export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

export const FETCH_REQUEST = 'FETCH_REQUEST';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';
export const SAVE_REQUEST = 'SAVE_REQUEST';
export const SAVE_SUCCESS = 'SAVE_SUCCESS';
export const SAVE_FAILURE = 'SAVE_FAILURE';
export const DELETE_REQUEST = 'DELETE_REQUEST';
export const DELETE_SUCCESS = 'DELETE_SUCCESS';
export const DELETE_FAILURE = 'DELETE_FAILURE';

export function createType(base, prefix = defaultPrefix) {
  return `${prefix}${base}`;
}

export function createRequestTypes(base, prefix = defaultPrefix) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${createType(base, prefix)}_${type}`;
    return acc;
  }, {});
}

export function createRequestActions(entity) {
  return {
    request: (payload, uid) => ({
      type: entity[REQUEST],
      payload,
      uid,
    }),
    success: (payload, response, uid) => ({
      type: entity[SUCCESS],
      payload: { ...payload, response },
      uid,
    }),
    failure: (payload, error, uid) => ({
      type: entity[FAILURE],
      payload: { ...payload, error },
      uid,
    }),
  };
}

export function createModelTypes(base, prefix = defaultPrefix) {
  return [
    FETCH_REQUEST,
    FETCH_FAILURE,
    FETCH_SUCCESS,
    SAVE_REQUEST,
    SAVE_FAILURE,
    SAVE_SUCCESS,
    DELETE_REQUEST,
    DELETE_FAILURE,
    DELETE_SUCCESS,
  ].reduce((acc, type) => {
    acc[type] = `${createType(base, prefix)}_${type}`;
    return acc;
  }, {});
}

export function createModelActions(entity) {
  return {
    fetch: {
      request: (payload, uid) => ({
        type: entity[FETCH_REQUEST],
        payload,
        uid,
      }),
      success: (payload, response, uid) => ({
        type: entity[FETCH_SUCCESS],
        payload: { ...payload, response },
        uid,
      }),
      failure: (payload, error, uid) => ({
        type: entity[FETCH_FAILURE],
        payload: { ...payload, error },
        uid,
      }),
    },
    save: {
      request: (payload, uid) => ({
        type: entity[SAVE_REQUEST],
        payload,
        uid,
      }),
      success: (payload, response, uid) => ({
        type: entity[SAVE_SUCCESS],
        payload: { ...payload, response },
        uid,
      }),
      failure: (payload, error, uid) => ({
        type: entity[SAVE_FAILURE],
        payload: { ...payload, error },
        uid,
      }),
    },
    delete: {
      request: (payload, uid) => ({
        type: entity[DELETE_REQUEST],
        payload,
        uid,
      }),
      success: (payload, response, uid) => ({
        type: entity[DELETE_SUCCESS],
        payload: { ...payload, response },
        uid,
      }),
      failure: (payload, error, uid) => ({
        type: entity[DELETE_FAILURE],
        payload: { ...payload, error },
        uid,
      }),
    },
  };
}
