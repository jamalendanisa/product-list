import { put, takeEvery, call } from "redux-saga/effects";
import { getProducts } from "../actions";
import axios from 'axios';

export function getProductsAPI(payload) {
    const url = 'http://catch-code-challenge.s3-website-ap-southeast-2.amazonaws.com/challenge-3/response.json';
    const config = {
    headers: {
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    } };
 
    return axios.get(url, config)
}

export function* getProductsRequest(action) {
  try {
    const response = yield call(getProductsAPI, action.payload);

    if (response) {
      yield put(
        getProducts.success({
          products: response.data.results,
          listHeader: response.data.metadata
        }),
      );
    };
  } catch (error) {
    yield put(getProducts.failure(error.message));
  }
}

export default function* productsSaga() {
  yield takeEvery(getProducts.REQUEST, getProductsRequest);
}