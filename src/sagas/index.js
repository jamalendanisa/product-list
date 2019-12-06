import { all, fork } from "redux-saga/effects";

import ProductsSaga from "./products.js";

export default function* rootSaga() {
  yield all([
    fork(ProductsSaga)
  ])
}