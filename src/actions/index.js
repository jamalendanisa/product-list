import { createRoutine } from "redux-saga-routines";

export const GET_PRODUCTS = "GET_PRODUCTS";
export const getProducts = createRoutine(GET_PRODUCTS);
