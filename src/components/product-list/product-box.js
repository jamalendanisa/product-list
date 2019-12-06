import React,  { Component } from "react";
import LazyLoad from "react-lazyload";
import NotificationSystem from "react-notification-system";

export default class Products extends Component {

  notificationSystem = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      showCart: this.props.state.showCart
    }

    this.addToCart = this.addToCart.bind(this);
    this.showCart = this.showCart.bind(this);
  }

  showCart = () => this.props.showCart(!this.state.showCart)

  addToCart = (product) => {
    this.props.addToCart(product);

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

  render = () => {
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
    return(
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
                  <img alt="soldout" className="soldout" src="images/soldout.png" /> }
               </LazyLoad>

                {product.quantityAvailable !== 0 &&
                  <button onClick={()=>this.addToCart(product)} className="hvr-bounce-in">ADD TO CART</button> }
                
                <div className="product-name">{product.name}</div>
                <div className="price">
                  <div className="retail-price">{retailPrice}</div>
                  <div className="sale-price">{salePrice}</div>
                </div>
                {product.quantityAvailable !== 0 && product.quantityAvailable <= 5 &&
                  <div className="product-left hvr-buzz-out">{product.quantityAvailable} left!</div> }
            </div>
            )
         })} 
         <NotificationSystem ref={this.notificationSystem} style={style}/>
      </div>
    )
  }
}