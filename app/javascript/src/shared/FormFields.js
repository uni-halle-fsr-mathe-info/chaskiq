import React from 'react'
//import Select from '@atlaskit/select';
//import FieldTextArea from '@atlaskit/field-text-area';
//import FieldText from '@atlaskit/field-text';
//import { DateTimePicker } from '@atlaskit/datetime-picker';
//import { Checkbox } from '@atlaskit/checkbox';
//import { Field } from '@atlaskit/form';
import { snakeCase, camelCase } from 'lodash'

import {
  TextField ,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  MenuItem,
  InputLabel,
  Checkbox,
  InputAdornment ,
  Button,
  IconButton
}  from '@material-ui/core';

import ColorFillIcon from '@material-ui/icons/FormatColorFill'
import ChromeReaderIcon from '@material-ui/icons/ChromeReaderMode'

//import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MultipleSelect from './multipleSelect'
import Select from './select'
import SuggestSelect from './suggestSelect'
import { withStyles } from '@material-ui/core/styles';
import DateTime from './dateTime'
import moment from 'moment-timezone';


import { SketchPicker } from 'react-color';

export const errorsFor = (name, errors ) => {
  if (!errors[name])
    return null
  return errors[name].map((o) => o).join(", ")
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%'
  },
  formControl: {
    //margin: theme.spacing(1),
    width: '100%'
    //minWidth: 120,
  },
  selectEmpty: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
});

class FieldRenderer extends React.Component {

  fieldRenderer = () => {
    
    const {namespace, data, props, errors, classes, errorNamespace} = this.props

    const errorMessage = errorsFor(`${errorNamespace ? errorNamespace : ''}${data.name}`, errors)

    switch (data.type) {
      case "string":
        // className={classes.formControl}
        //console.log(props.data[camelCase(data.name)])
        return <FormControl 
                  error={errorMessage}
                  className={classes.formControl}>

                  <TextField
                    label={data.name}
                    error={errorMessage}
                    variant="outlined"
                    fullWidth
                    //margin="normal"
                    name={`${namespace}[${data.name}]`}
                    defaultValue={props.data[camelCase(data.name)]} 
                    InputProps={{
                      startAdornment: data.startAdornment ? <InputAdornment position="start">
                      {data.startAdornment}
                      </InputAdornment> : null,
                    }}
                    helperText={
                      <React.Fragment>
                      { 
                        errorMessage ? 
                        <FormHelperText id="component-error-text">
                          {errorMessage}
                        </FormHelperText> : null 
                      }

                      { data.hint ? data.hint : null }

                      </React.Fragment>
                    }
                  />
                </FormControl>
      case "text":
        return <FormControl 
                  error={errorMessage}
                  className={classes.formControl}>
                  
                  <TextField
                    label={data.name}
                    variant="outlined"
                    error={errorMessage}
                    fullWidth
                    //margin="normal"
                    multiline={true}
                    name={`${namespace}[${data.name}]`}
                    defaultValue={props.data[camelCase(data.name)]} 
                    helperText={
                      errorMessage ? 
                      <FormHelperText id="component-error-text">
                        {errorMessage}
                      </FormHelperText>
                      : null
                    }
                  />

                </FormControl>
      case "datetime":
        return <FormControl 
                  error={errorMessage}
                  className={classes.formControl}>
                  <DateTime
                    name={`${namespace}[${data.name}]`}
                    value={props.data[data.name]}
                    defaultValue={props.data[data.name] || new Date}
                    label={data.name}
                  />
              </FormControl>
      case "select":
        let defaultData = null
        if (data.multiple) {
          if (!props.data[data.name]){
            defaultData = {
              label: data.default,
              value: data.default
            }
          } else {
            defaultData = props.data[data.name].map((o) => {
              return {
                label: o,
                value: o
              }
            })
          }

          return <MultipleSelect 
                  data={data} 
                  defaultData={defaultData}
                  variant="outlined"
                  //margin="normal"
                  name={`${namespace}[${data.name}]`}
               />

        } else {

          defaultData = {
            label: props.data[data.name] || data.default,
            value: props.data[data.name] || data.default
          }

          return <Select
              data={data} 
              defaultData={defaultData}
              classes={classes}
              name={`${namespace}[${data.name}]`}
           />
        }
      case "timezone":

        const names = data.options.map(o=>({label: o, value: o }))
        let defaultTZ = moment.tz.guess()
        return <SuggestSelect 
            data={names}
            label={data.name} 
            defaultData={props.data[data.name] || defaultTZ}
            placeholder={'select timezone'}
            classes={classes}
            name={`${namespace}[${data.name}]`}
         />        

      case "bool":
        return <FormControlLabel 
                  error={errorMessage}
                  className={classes.formControl}
                  control={
                    <Checkbox 
                      defaultChecked={props.data[data.name]}
                      name={`${namespace}[${data.name}]`} 
                      value={true}
                     />
                  }
                  //labelPlacement="top"
                  label={data.name}
                />
      case "color":
        return <FormControl 
                error={errorMessage}
                className={classes.formControl}>

                <ColorPicker 
                  label={data.name}
                  error={errorMessage}
                  name={`${namespace}[${data.name}]`}
                  color={ props.data[camelCase(data.name)] || '#000' }
                  onChangeComplete={ data.handler }
                />

                </FormControl>
        
      case "upload":
        return <React.Fragment>
                <input
                  accept="image/*"
                  style={{display: 'none'}}
                  //className={classes.input}
                  id={data.name}
                  onChange={(e) => data.handler(e.currentTarget.files[0])}
                  //multiple
                  type="file"
                />
                <img src={props.data[camelCase(data.name)]}/>
                <label htmlFor={data.name}>
                  <Button variant="contained" component="span" 
                    //className={classes.button}
                    >
                    Upload 
                  </Button>
                </label>
              </React.Fragment>
        
      default:
        break;
    }

  } 

  render(){
    return this.fieldRenderer()
  }

}


class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    value: this.props.color
  };

  handleClick = (e) => {
    e.preventDefault()
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleColorChangeComplete = (color)=>{
    this.setState({value: color.hex})
    //,
    //  ()=> this.props.onChangeComplete(color.hex))
  }

  render() {
    const popover = {
      position: 'absolute',
      zIndex: '2',
    }
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    }
    return (
      
      <TextField
        label={this.props.label}
        error={this.props.error}
        variant="outlined"
        fullWidth
        defaultValue={this.state.value}
        name={this.props.name}
        value={this.state.value}
        //id="simple-start-adornment"
        //className={clsx(classes.margin, classes.textField)}
        InputProps={{
          startAdornment: <InputAdornment position="start">
                            <ChromeReaderIcon style={{color: this.state.value}} />
                          </InputAdornment>
          ,
          endAdornment: <InputAdornment position="end">
            <React.Fragment>
              <IconButton 
                aria-label="Toggle color" 
                onClick={this.handleClick}>
                <ColorFillIcon  />
              </IconButton>
      
              { 
                this.state.displayColorPicker ? 
                <div style={ popover }>
                  <div style={ cover } onClick={ this.handleClose }/>
                  <SketchPicker 
                    color={ this.state.value }
                    onChangeComplete={ this.handleColorChangeComplete }
                  />
                </div> :  null 
              }
    
            </React.Fragment>
          </InputAdornment>,
        }}
      />
        
    )
  }
}


export default withStyles(styles)(FieldRenderer);






