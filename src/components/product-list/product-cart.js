import React,  { Component } from "react";

export default class Products extends Component {

  constructor(props) {
    super(props);
    
    this.addQty = this.addQty.bind(this);
    this.decreaseQty = this.decreaseQty.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.emptyCart = this.emptyCart.bind(this);
  }

  addQty= (product) => {
    this.props.addQty(product);
  }
      
  decreaseQty= (product) => {
    this.props.decreaseQty(product);
  }
       
  emptyCart = () =>  this.props.emptyCart();
      
  removeFromCart = (product) => {
    this.props.removeFromCart(product);
  }

  render = () =>{
    return (
      <div className="products-on-cart">
        {this.props.state.cart.length === 0 && <div>
          <img alt="cartempty" className="cartempty" src="images/emptycart.png" />
          <div className="cartempty-text">Uh oh.. Your cart is empty.</div>
          <div className="cartempty-fill-me">Add something to fill me in. :)</div>
        </div> }
        {this.props.state.cart.length !== 0 && <div>
          <div onClick={()=>this.emptyCart()} className="emptycart-button">
          <img alt="trashcan" className="trashcan" src="images/trashcan.png" />Empty Cart</div>
           
           {this.props.state.cart.map(product => {
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
           Total : {this.props.state.totalPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}</div>
         </div>
        }
      </div>
    )
  }
}
