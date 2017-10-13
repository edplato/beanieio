import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import Camera from './camera.jsx';
import Product from './Product.jsx';
import { Multiselect, DateTimePicker } from 'react-widgets';
import './form-styles.css';
import Modal from 'react-modal';
//import { Modal, ModalBody} from 'react-modal-bootstrap';
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
    this.postingPics(this.state.file);
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
    this.postingPics(file);
  }

  postingPics(file) {
    var fd = new FormData();
    fd.append('image',file);
    axios.post('/api/clarifai',fd)
      .then((res) => {
        console.log('Success --> ',res.data[0].data.concepts);
        this.state.data = res.data[0].data.concepts.slice(0,10);
        this.handleItemClick();
      })
      .catch((err) =>  {
        console.log('Error --> ',err);
     })
  }


  handleItemClick() {
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
    let  customStyles = {
  content : {
    position                  : 'absolute',
    top                        : '40px',
    left                       : '300px',
    right                      : '450px',
    bottom                     : '100px',
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
      console.log('Image --> ',$imagePreview)
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }
    return (
      <div className="form-wrapper shadow" onClick={e => e.stopPropagation()}>
       <Modal
          isOpen={this.state.showDetails}
          onRequestHide={this.handleItemClick}
          onClose={this.handleItemClick}
        >
          <Camera imageView={$imagePreview} products={this.state.data} onClose={this.getProducts}/> 
        </Modal>
        <div className="form-header flex flex-align-center space-between">
          <span>Select the ingredients you want to track for this meal.</span>
          <button type="button" className="close" aria-label="Close" onClick={() => this.props.handleCancel()}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
          <form onSubmit={(e)=>this.handleSubmitImg(e)}>
              <input className="fileInput" type="file" name="image" accept="image/*" capture="user" onChange={(e)=>this.handleImageUpload(e)} />
            </form>

        <form onSubmit={e => this.handleSubmit(e)}>
       <div className="form-select">
           <div className="mdi mdi-camera"/>
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
