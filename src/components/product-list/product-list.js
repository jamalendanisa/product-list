import React,  { Component } from "react";
import { connect } from "react-redux";
import { func } from "prop-types";
import LazyLoad from "react-lazyload";

import { getProducts } from "../../actions";
import "./product-list.css";

class ProductList extends Component {

  componentDidMount = () => {
    const { fetchProducts} = this.props;
    fetchProducts();
  }
  
  Products = () => 
  <div className="products-container">
    {this.props.products.map(product => {
      let retailPrice = product.retailPrice / 100;
      retailPrice = retailPrice.toLocaleString("en-US", {style:"currency", currency:"USD"});
      let salePrice = product.salePrice / 100;
      salePrice = salePrice.toLocaleString("en-US", {style:"currency", currency:"USD"});
      return (
        <div className="product-box" key={product.id}>
          <LazyLoad once={true} offset={-200}
          placeholder={ <img alt="loader" className="product-img" src="images/loader.gif" />}>
              <img alt="product-img" className="product-img" src={product.imageUrl} />
              {product.quantityAvailable === 0 &&
                <img alt="soldout" className="soldout" src="images/soldout.png" />
              }
          </LazyLoad>
          {product.quantityAvailable !== 0 &&
            <button className="hvr-bounce-in">ADD TO CART</button>
          }
          <div className="product-name">{product.name}</div>
          <div className="price">
           <div className="retail-price">{retailPrice}</div>
           <div className="sale-price">{salePrice}</div>
          </div>
          {product.quantityAvailable !== 0 && product.quantityAvailable <= 5 &&
           <div className="product-left hvr-buzz-out">{product.quantityAvailable} left!</div>
          }
        </div>
      )
    })} 
  </div>

  
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
            <div class="cart-button" data-badge="0"><img alt="cart" className="cart" src="images/cart.svg" /></div>
          </div>
          {products.length === 0 && <img alt="no-result" className="no-result" src="images/no-result.jpg" />}
          <div className="product-list">
            {this.Products()}
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