import React,  { Component } from "react";
import { connect } from "react-redux";
import { func } from "prop-types";
import LazyLoad from "react-lazyload";
import NotificationSystem from "react-notification-system";

import { getProducts } from "../../actions";
import "./product-list.css";

class ProductList extends Component {

  notificationSystem = React.createRef();

  constructor(props) {
    super(props);

    this. state = {
      cart : [],
      totalPrice : 0,
      qty : 0,
      showCart : false
    }

    this.addToCart = this.addToCart.bind(this);
    this.addQty = this.addQty.bind(this);
    this.decreaseQty = this.decreaseQty.bind(this);
    this.showCart = this.showCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.emptyCart = this.emptyCart.bind(this);
}

  componentDidMount = () => {
    const { fetchProducts} = this.props;
    fetchProducts();
  }

  ProductsOnCart = () => 
  <div className="products-on-cart">
   {this.state.cart.length === 0 && <div>
    <img alt="cartempty" className="cartempty" src="images/emptycart.png" />
    <div className="cartempty-text">Uh oh.. Your cart is empty.</div>
    <div className="cartempty-fill-me">Add something to fill me in. :)</div>
    </div>
   }
   {
     this.state.cart.length !== 0 && <div>
       <div onClick={()=>this.emptyCart()} className="emptycart-button">
         <img alt="trashcan" className="trashcan" src="images/trashcan.png" />
       Empty Cart</div>
       { this.state.cart.map(product => {
      let salePrice = product.salePrice / 100;
      salePrice = salePrice.toLocaleString("en-US", {style:"currency", currency:"USD"});
      return (
        <div className="product-cart" key={product.id}>
          <img alt="product-img" className="product-img-cart" src={product.imageUrl} />
         <div className="product-name-cart">
           <div>{product.name}</div>
           <div>Qty: {product.qty}</div>
           <div className="price-cart">{salePrice}</div>
           <div className="qty-icon-container">
           <div className="add-qty" onClick={()=>this.addQty(product)}>
             <img alt="add-qty" className="qty-icon" src="images/add.png" />
           </div>
           <div className="decrease-qty" onClick={()=>this.decreaseQty(product)}>
             <img alt="decrease-qty" className="qty-minus-icon" src="images/minus.png" />
           </div>
           <div className="remove-cart" onClick={()=>this.removeFromCart(product)}>
             <img alt="remove-qty" className="qty-icon" src="images/remove.png" />
           </div>
           </div>
          </div>
        </div>
      )
   })}
   <div className="total-price">
     Total : {this.state.totalPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}</div>
   </div>
  }
  </div>
 
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
            <button onClick={()=>this.addToCart(product)} className="hvr-bounce-in">ADD TO CART</button>
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

  addToCart = (product) => {
    let duplicate = false;
    let totalPrice = product.salePrice / 100;
    this.state.cart.find((c) => {   
      if(product.id === c.id){
        duplicate = true;
      }
    }); 

    if(duplicate){
      this.setState(prevState => ({ 
        cart: prevState.cart.map(
        obj => (obj.id === product.id ? Object.assign(obj, { qty: obj.qty + 1 }) : obj)
        ),
        totalPrice: prevState.totalPrice + totalPrice,
        qty: prevState.qty + 1
      }));
    }else{
      product.qty = 1;
      this.setState(state => {
        state.cart.push(product);
        state.totalPrice = state.totalPrice + totalPrice;
        state.qty = state.qty + product.qty;
      });
    }    

    console.log(this.state)
    const notification = this.notificationSystem.current;

    notification.addNotification({
      title: "Added to Cart!",
      children: (
        <div className="success-add-cart">
           <img alt="product-img-notif" src={product.imageUrl} />
           <div className="product-name-notif">{product.name}</div>
           <div className="open-cart-button" onClick={()=>this.showCart()}>Open Cart</div>
        </div>
      ),
      level: 'success',
      position: 'tr'
    });
}

addQty= (product) => {
  let totalPrice = product.salePrice / 100;
  this.setState(prevState => ({ 
    cart: prevState.cart.map(
    obj => (obj.id === product.id ? Object.assign(obj, { qty: obj.qty + 1 }) : obj)
    ),
    totalPrice: prevState.totalPrice + totalPrice,
    qty: prevState.qty + 1
  }));
}

decreaseQty= (product) => {
  let totalPrice = product.salePrice / 100;
  this.setState(prevState => ({ 
    cart: prevState.cart.map(
    obj => (obj.id === product.id ? Object.assign(obj, { qty: obj.qty - 1 }) : obj)
    ),
    totalPrice: prevState.totalPrice - totalPrice,
    qty: prevState.qty - 1
  }));
}
  showCart = () => this.setState({ showCart: !this.state.showCart });

  emptyCart = () => this.setState({ cart: [], qty: 0, totalPrice: 0 });

  removeFromCart = (product) => {
    let duplicate = false;
    let index, qty, totalPrice;
    this.state.cart.find((c,i) => {   
      if(product.id === c.id){
       duplicate = true;
       index = i;
       qty = c.qty;
       totalPrice = c.salePrice / 100;
      }
    }); 
    if(duplicate){
      this.state.cart.splice(index, 1);
      totalPrice = totalPrice * qty;
      console.log(totalPrice)
      qty = this.state.qty - qty;
      totalPrice = this.state.totalPrice - totalPrice
      console.log(this.state.totalPrice, totalPrice)
      this.setState({ qty: qty, totalPrice: totalPrice });
    }
  }

   render = () => {
    const { products, listHeader, pending, error } = this.props;
   console.log(this.state)
   let style = {
    NotificationItem:{
      DefaultStyle: {
        borderTop: "2px solid #28a528",
        backgroundColor: "#fff"
      }
    },
    Dismiss: {
      DefaultStyle: {
        display: "none"
      }
    }
  }
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
            <div className="cart-button" onClick={()=>this.showCart()} data-badge={this.state.qty}>
              <img alt="cart" className="cart" src="images/cart.svg" /> 
              <div className="cart-list">{this.state.showCart && this.ProductsOnCart()}</div>
            </div>
          </div>
          {products.length === 0 && <img alt="no-result" className="no-result" src="images/no-result.jpg" />}
          <div className="product-list">
            {this.Products()}
          </div> 
        </div> 
    }
      <NotificationSystem ref={this.notificationSystem} style={style}/>
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