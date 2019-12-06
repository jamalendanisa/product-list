import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import App from "../components/app/App";
import "../setupTests";

const mockStore = configureMockStore();
const store = mockStore({ products: { 
  products :[
    { id: "ffc4211a-fb81-45e3-b1d8-2d399a92aa89",
      name: "Buy Olaplex No. 3 Hair Perfector",
      salePrice: 3145,
      retailPrice: 5000,
      imageUrl: "https://s.catch.com.au/images/product/0002/2114/593f690189ac9183721654_w200.jpg",
      quantityAvailable: 65 }],
  pending : false }});

it('renders without crashing', () => {
  shallow(<Provider store={store}>
    <App /> 
  </Provider>);
});