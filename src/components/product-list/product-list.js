import React,  { Component } from "react";
import { connect } from "react-redux";
import { func } from "prop-types";

import Products from "./product-box";
import ProductsCart from "./product-cart";
import { getProducts } from "../../actions";
import "./product-list.css";

class ProductList extends Component {

  notificationSystem = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      cart : [],
      totalPrice : 0,
      qty : 0,
      showCart : false
    }

    this.showCart = this.showCart.bind(this);
  }

  componentDidMount = () => {
    const { fetchProducts} = this.props;
    fetchProducts();
  }

  showCart = () => this.setState({ showCart: !this.state.showCart });
  
  addToCart = (product) => {
    let duplicate = false;
    let totalPrice = product.salePrice / 100;

    this.state.cart.forEach(function (c) {
      if(product.id === c.id){
        duplicate = true;
      }
    });

    if (duplicate){
      this.setState(prevState => ({ 
        cart: prevState.cart.map(
        obj => (obj.id === product.id ? Object.assign(obj, { qty: obj.qty + 1 }) : obj)),
        totalPrice: prevState.totalPrice + totalPrice,
        qty: prevState.qty + 1
      }));
    }else {
      product.qty = 1;
      this.setState(state => {
        state.cart.push(product);
        state.totalPrice = state.totalPrice + totalPrice;
        state.qty = state.qty + product.qty;
      });
    }    
  }

  addQty= (product) => {
    let totalPrice = product.salePrice / 100;

    this.setState(prevState => ({ 
      cart: prevState.cart.map(
      obj => (obj.id === product.id ? Object.assign(obj, { qty: obj.qty + 1 }) : obj)),
      totalPrice: prevState.totalPrice + totalPrice,
      qty: prevState.qty + 1
    }));
  }
      
  decreaseQty= (product) => {
    let totalPrice = product.salePrice / 100;

    this.setState(prevState => ({ 
      cart: prevState.cart.map(
      obj => (obj.id === product.id ? Object.assign(obj, { qty: obj.qty - 1 }) : obj)),
        totalPrice: prevState.totalPrice - totalPrice,
        qty: prevState.qty - 1
    }));

    if (product.qty === 1 ){
      this.removeFromCart(product);
    }
  }
       
  emptyCart = () => this.setState({ cart: [], qty: 0, totalPrice: 0 });
      
  removeFromCart = (product) => {
    let duplicate = false;
    let index, qty, totalPrice;

    this.state.cart.forEach(function (c, i) {
      if (product.id === c.id){
        duplicate = true;
        index = i;
        qty = c.qty;
        totalPrice = c.salePrice / 100; 
      }
    });

    if(duplicate){
        this.state.cart.splice(index, 1);
        totalPrice = totalPrice * qty;
        qty = this.state.qty - qty;
        totalPrice = this.state.totalPrice - totalPrice
        this.setState({ qty: qty, totalPrice: totalPrice });
    }
  }

   render = () => {
    const { products, listHeader, pending, error } = this.props;

    return (
      <div className="product-list-component">
        <a href="https://www.catch.com.au/latitudepay">
          <img alt="banner" style={{width: '100%'}} className="banner" src="images/banner.jpg" />
        </a>
        {error && <div>
          <img alt="oops" className="oops" src="images/oops.png" />
        </div> }
        {pending && <div>
          <div className="bar">
            <div className="circle"></div>
            <p>Loading...</p>
          </div>
        </div> }
        {!pending && !error && <div>
          <div className="product-list-header">
            <div>
              <h2 style={{marginBottom:'5px'}}>Showing results for "{listHeader.query}"</h2>
              <div>Page {listHeader.page} of {listHeader.pages}</div>
              <div>Showing {products.length} of {listHeader.total}</div>
            </div>
            <div className="cart-button" data-badge={this.state.qty}>
              <img onClick={()=>this.showCart()} alt="cart" className="cart" src="images/cart.svg" /> 
              <div className="cart-list">{this.state.showCart && 
                <ProductsCart 
                  products={products} 
                  state={this.state}
                  addQty={this.addQty}
                  decreaseQty={this.decreaseQty}
                  removeFromCart={this.removeFromCart}
                  emptyCart={this.emptyCart}
                />}</div>
            </div>
          </div>
        {products.length === 0 && <img alt="no-result" className="no-result" src="images/no-result.jpg" />}
          <div className="product-list">
            <Products 
              products={products}
              state={this.state} 
              showCart={this.showCart}
              addToCart={this.addToCart} />
          </div> 
        </div> 
      }
    </div>
    );
  }
}

ProductList.propTypes = {
  fetchProducts: func.isRequired
};

export const mapStateToProps = ({ products: { products, listHeader, pending, error } }) => ({
  products,
  listHeader,
  pending,
  error
});

export const mapDispatchToProps = (dispatch) => ({
  fetchProducts: () => dispatch(getProducts.request())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductList);