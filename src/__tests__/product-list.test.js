import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import ProductList from '../components/product-list/product-list';
import '../setupTests';

const mockStore = configureMockStore();
const store = mockStore({
  products: { 
    listHeader :{
      query: "best sellers",
      total: 102,
      page: 1,
      pages: 3
    },
    products :[
      {id: "ffc4211a-fb81-45e3-b1d8-2d399a92aa89",
      name: "Buy Olaplex No. 3 Hair Perfector",
      salePrice: 3145,
      retailPrice: 5000,
      imageUrl: "https://s.catch.com.au/images/product/0002/2114/593f690189ac9183721654_w200.jpg",
      quantityAvailable: 65 }],
    pending : false,
    error : false}}); 

it('renders without crashing', () => {
  shallow(<Provider store={store}>
    <ProductList />
  </Provider>);
});

it('should contain metadata on header', () => {
  const wrapper = mount((<Provider store={store}>
      <ProductList />
    </Provider>
  ));
  
    expect(wrapper.find('.product-list-header').first(0).text())
    .toContain('Showing results for \"best sellers\"Page 1 of 3Showing 1 of 102');
});
  
it('should show loader when data is loading', () => {
  const store = mockStore({ products: { products :[], 
    listHeader :{
      query: "best sellers",
      total: 102,
      page: 1,
      pages: 3
    },
    pending : true}});

  const wrapper = mount((<Provider store={store}>
    <ProductList />
  </Provider>
  ));

  expect(wrapper.find('.bar').length).toEqual(1);
});

it('should not show loader when data is successfully fetched', () => {
  const wrapper = mount((<Provider store={store}>
    <ProductList />
  </Provider>
  ));

  expect(wrapper.find('.bar').length).toEqual(0);
});

it('should show dataempty image when data is empty', () => {
  const store = mockStore({ products: { products :[],  
    listHeader :{
      query: "best sellers",
      total: 102,
      page: 1,
      pages: 3},
    pending : false}});
  const wrapper = mount((<Provider store={store}>
    <ProductList />
  </Provider>
  ));

  expect(wrapper.find('.no-result').length).toEqual(1);
});

it('should hide dataempty logo when data is not empty and show list products', () => {
  const wrapper = mount((<Provider store={store}>
    <ProductList />
  </Provider>
  ));

  expect(wrapper.find('.no-result').length).toEqual(0);
  expect(wrapper.find('.product-box').length).not.toEqual(0);
});

it('should show error image when data is failed fetched', () => {
  const store = mockStore({ products: { products :[],
    listHeader :{
      query: "best sellers",
      total: 102,
      page: 1,
      pages: 3 },
      pending : false, error: true}});
  const wrapper = mount((<Provider store={store}>
    <ProductList />
  </Provider>
  ));

  expect(wrapper.find('.oops').length).toEqual(1);
});

it('should show and hide cart when cart icon is being clicked and showing that cart is empty', () => {
  const wrapper = mount((<Provider store={store}>
    <ProductList />
   </Provider>
  ));
    
  expect(wrapper.find('.products-on-cart').length).toEqual(0);
  wrapper.find('.cart-button img').simulate('click');
  expect(wrapper.find('.products-on-cart').length).toEqual(1);
  expect(wrapper.find('.cartempty').length).toEqual(1);
  wrapper.find('.cart').simulate('click');
  expect(wrapper.find('.products-on-cart').length).toEqual(0);
    
}); 

it('should add product in cart when button add to cart is being clicked and show notification', () => {
   const wrapper = mount((<Provider store={store}>
     <ProductList />
   </Provider>
   ));
  
  wrapper.find('.product-box').simulate('click');
  wrapper.find('.hvr-bounce-in').simulate('click');
  expect(wrapper.find('.success-add-cart').length).toEqual(1);
}); 

it('should show product in cart when product has been chosen', () => {
   const wrapper = mount((<Provider store={store}>
     <ProductList />
   </Provider>
  ));
  
  wrapper.find('.product-box').simulate('click');
  wrapper.find('.hvr-bounce-in').simulate('click');
  wrapper.find('.cart-button img').simulate('click');
  expect(wrapper.find('.product-cart').length).not.toEqual(0);
}); 

it('should remove products and make cart empty when empty cart button has been clicked', () => {
  const wrapper = mount((<Provider store={store}>
     <ProductList />
  </Provider>
  ));
  
  wrapper.find('.product-box').simulate('click');
  wrapper.find('.hvr-bounce-in').simulate('click');
  wrapper.find('.cart-button img').simulate('click');
  expect(wrapper.find('.product-cart').length).not.toEqual(0);
  wrapper.find('.emptycart-button').simulate('click');
  expect(wrapper.find('.product-cart').length).toEqual(0);
  expect(wrapper.find('.cartempty').length).toEqual(1);
}); 

it('should add, decrease, and remove products modification cart button has been clicked', () => {
  const wrapper = mount((<Provider store={store}>
     <ProductList />
   </Provider>
  ));
  
  wrapper.find('.product-box').simulate('click');
  wrapper.find('.hvr-bounce-in').simulate('click');
  wrapper.find('.cart-button img').simulate('click');
  expect(wrapper.find('.product-cart').length).not.toEqual(0);
  wrapper.find('.add-qty').simulate('click');
  expect(wrapper.find('.product-qty').first(0).text()).toContain('Qty: 2');
  wrapper.find('.decrease-qty').simulate('click');
  expect(wrapper.find('.product-qty').first(0).text()).toContain('Qty: 1');
  wrapper.find('.remove-cart').simulate('click');
  expect(wrapper.find('.product-cart').length).toEqual(0);
}); 

