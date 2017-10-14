import React, { Component } from 'react';
import './form-styles.css';
class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected:false,
    };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.props.addItems(this.props.product.name, !this.state.selected);
    this.setState({
      selected: !this.state.selected
    });
  }

  render() {
    return (
      <div> 
        {
          (this.state.selected)
       ? <div className="container">
           <div className="selected" onClick={this.handleClick}>
            {this.props.product.name}
            </div>  
             <div className="mdi mdi-checkbox-marked-circle-outline" />
          </div>
        : <div className="notselected">
            <div className="word" onClick={this.handleClick}>
                {this.props.product.name}
             </div>
          </div>
    }
    </div>
    )
  }
}

export default Product;