import React, { Component } from 'react';
import './form-styles.css';
import Product from './Product.jsx';
import { Multiselect } from 'react-widgets';
class Camera extends Component {
  constructor(props) {
    super(props);
    this.collectProducts = this.collectProducts.bind(this);
    this.onClose = this.onClose.bind(this);
    let arr = this.props.products.reduce((total,el) => {
      total.push(el.name)
      return total;
    } ,[]);
    console.log('Arr --> ',arr);
    this.state = {
      food: {},
      ingredients:[],
      formData:arr
    }
  }
  collectProducts(name,bool){
    if(bool) {
      this.state.food[name] = 1;
    } else {
      delete this.state.food[name];
    }
  //  console.log('Products --> ',this.state.food);
  let arr = Object.keys(this.state.food);
  this.setState({
    ingredients:arr
    });
  }
  onClose() {
    this.props.onClose(this.state.food);
  }

  render() {
    return (
      <div >   
      <button type="button" className="close" aria-label="Close" onClick={this.onClose}>
         <span aria-hidden="true">&times;</span>
       </button>  
          <div className="imgPreview">
            {this.props.imageView}
          </div>
        <div className="flex flex-center">
        <h2> Products in your food </h2>
        </div>
          <div className="products">
            {this.props.products.map(item => 
            <Product product={item} addItems={this.collectProducts}/>
          )}
          </div>
    </div>
    );
  }
}

export default Camera;
           // <Multiselect className="form-multiselect" 
           //    data={this.state.formData}
           //    onChange={v => this.setState({ingredients: v})} placeholder="Type or select ingredients here"
           //    value={this.state.ingredients}
           //  />
