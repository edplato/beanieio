import React, { Component } from 'react';
import './form-styles.css';
import Product from './Product.jsx';
import { Multiselect } from 'react-widgets';
import axios from 'axios';
class Camera extends Component {
  constructor(props) {
    super(props);
    this.collectProducts = this.collectProducts.bind(this);
    this.onClose = this.onClose.bind(this);
    this.state = {
      food: {},
      ingredients:[]
    }
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
    this.getData();
  }

    getData() {
    let fd = new FormData();
    fd.append('image',this.props.file);
    axios.post('/api/clarifai',fd)
      .then((res) => {
        console.log('Success --> ',res.data[0].data.concepts);
       // this.state.data = res.data[0].data.concepts.slice(0,10);
       // this.handleItemClick();
       let temp = res.data[0].data.concepts.slice(0,10);
       this.setState({
        ingredients: temp
       })
      })
      .catch((err) =>  {
        console.log('Error --> ',err);
     })
    }

  collectProducts(name,bool){
    if(bool) {
      this.state.food[name] = 1;
    } else {
      delete this.state.food[name];
    }
  //  console.log('Products --> ',this.state.food);
  // this.setState({
  //   ingredients:arr
  //   });
  }
  onClose() {
    this.props.onClose(this.state.food);
  }

  render() {
    return (
      <div > 
      <div className="form-header flex flex-align-center space-between">
          <h2 className="header"> Ingredients from your food </h2>
      <button type="button" className="close" aria-label="Close" onClick={this.onClose}>
         <span aria-hidden="true">&times;</span>
       </button>  
       </div>
          <div className="imgPreview">
            {this.props.imageView}
          </div>
            <div className="flex flex-center">
            {
              (this.state.ingredients.length === 0) 
            ? <div className="loader" />
            :  <div className="products">
                {this.state.ingredients.map(item =>
                <Product product={item} addItems={this.collectProducts}/>
              )}
          </div>
            }
        </div>
    </div>
    );
  }
}

export default Camera;
          // <Multiselect className="form-multiselect2" 
         
            //  data={this.state.formData}
             // onChange={v => this.setState({ingredients: v})} placeholder="Type or select ingredients here"
             // value={this.state.ingredients}
               ///>
