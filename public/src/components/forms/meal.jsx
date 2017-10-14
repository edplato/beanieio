import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import Camera from './camera.jsx';
import Product from './Product.jsx';
import { Multiselect, DateTimePicker } from 'react-widgets';
import './form-styles.css';
import Modal from 'react-modal';
//import Modal from 'react-modal-bootstrap';
import 'react-widgets/dist/css/react-widgets.css';
momentLocalizer();

export default class Meal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredientsTags: [],
      datetime: new Date(),
      file:'',
      imagePreviewUrl:'',
      showDetails: false,
      data: [],
      products:[]
    };
  this.handleItemClick = this.handleItemClick.bind(this);
  this.getProducts = this.getProducts.bind(this);
  }



  handleSubmit(e) {
    e && e.preventDefault();
    let formData = {
      type: 'Meal',
      datetime: this.state.datetime,
      ingredients: this.state.ingredientsTags
    };
    axios.post('/api/formdata', formData, {headers: {'Authorization': 'bearer ' + this.props.auth()}})
      .then((res) => {
        this.props.handleCancel();
        this.props.signalFormSubmitted('Meal');
      }).catch((err) => console.log('error: ', err));
  }

  handleSubmitImg(e) {
    e && e.preventDefault();
    console.log('This .state file --> ',this.state.file);
    // this.postingPics(this.state.file);
  }

    handleImageUpload(e) {
       e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
    this.handleItemClick();
  }


  handleItemClick() {
    if (this.state.showDetails) {
      this.state.file = '';
      this.state.imagePreviewUrl = '';
    }
    this.setState({
      showDetails: !this.state.showDetails
      });
  }

  getProducts(obj) {
    var arr = Object.keys(obj);
     this.setState({
      showDetails: !this.state.showDetails,
      ingredientsTags: arr
    });
     console.log('Arr --> ',arr);
  }
  
  // stop propagation on clicks allows form interaction to be contained within the form
  // otherwise dashboard-level click handlers would also fire... not helpful!
  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    let $file = '';
    let  customStyles = {
  content : {
    position                   : 'relative',
    width                      : '80%',
    height                     : '600px',
    border                     : '1px solid #ccc',
    background                 : '#9FDCEB',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'
  }
};
    if (imagePreviewUrl) {
       $imagePreview = (<img src={imagePreviewUrl} />);
       $file = this.state.file;
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }
    return (
      <div className="form-wrapper shadow" onClick={e => e.stopPropagation()}>
       <Modal className="modalContainer"
          isOpen={this.state.showDetails}
          onRequestHide={this.handleItemClick}
          style={customStyles}
          onClose={this.handleItemClick}
        >
          {
            ($file !== '')
         ? <Camera imageView={$imagePreview} onClose={this.getProducts} file={$file}/> 
         : <div>Loading</div>
          }
        </Modal>
        <div className="form-header flex flex-align-center space-between">
          <span>Select the ingredients you want to track for this meal.</span>
          <button type="button" className="close" aria-label="Close" onClick={() => this.props.handleCancel()}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <div className="m-upload__file">
              <input id="ul-button-1" type="file" accept="image/*" capture="user" onChange={(e)=>this.handleImageUpload(e)} name="ul[0][pick]"/>
                 <label htmlFor="ul-button-1">
                  <i className="mdi mdi-camera"></i>
                </label>
              </div>       
       <div className="form-select">
            <Multiselect className="form-multiselect" data={this.props.formConfigData}
              onChange={v => this.setState({ingredientsTags: v})} placeholder="Type or select ingredients here"
              value={this.state.ingredientsTags}
            />
          </div>
          <div className="form-group flex flex-align-center">
            <DateTimePicker id="datetime" className="form-datetimepicker"
              onChange={v => this.setState({datetime: v})} value={this.state.datetime}
            />
          </div>
          <div className="form-submit-section flex flex-center">
            <button type="submit" className="btn form-submit-btn shadow">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}


