import createReactClass from 'create-react-class';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import {
  Button,
  Collapse,
  FormControl,
  FormGroup,
  ControlLabel,
  HelpBlock,
  InputGroup,
  Popover
} from 'react-bootstrap';
import compose from 'recompose/compose';
import withState from 'recompose/withState';

import ReFormControl from './ReFormStaticControl';
import ReFormStaticControl from './ReFormStaticControl';

export const ReFormFieldComponent = props => {
  const {
    errors = null,
    isValid = false,
    validationState = null,
    required = false,
    type = 'text',
    icon = 'question-circle',
    value = '',
    editing = true,
    readOnly = false,
    trueLabel = 'True',
    falseLabel = 'False',
    showHelp = false
  } = props;

  const supportedTypes = [
    'boolean',
    'select',
    'date',
    'time',
    'datetime',
    'datetime-local',
    'text',
    'email',
    'password',
    'number',
    'phone',
    'textarea'
  ];

  const typeCompare =
    supportedTypes.indexOf(type) === -1 ? 'unsupported' : type;

  if (editing) {
    return (
      <FormGroup controlId={id} validationState={validationState}>
        {this.renderLabel()}

        <InputGroup style={{ width: '100%' }}>
          <InputGroup.Addon>
            <FontAwesome name={this.state.icon} />
          </InputGroup.Addon>

          <div style={{ width: '92%' }}>
            {!readOnly && <ReFormControl />}

            {readOnly && <ReFormStaticControl />}
          </div>
        </InputGroup>

        {!this.state.isValid && (
          <HelpBlock>
            <p className="bg-warning">{this.state.errors}</p>
          </HelpBlock>
        )}
      </FormGroup>
    );
  }

  return (
    <FormControl.Static style={{ border: '1px solid silver' }}>
      {typeCompare === 'unsupported' && <span>WTF</span>}

      {typeCompare === 'boolean' && (
        <span>{value ? trueLabel : falseLabel}</span>
      )}

      {typeCompare === 'select' && (
        <span>{value.key === '-' ? 'Not Set' : value.value}</span>
      )}

      {typeCompare === 'date' && (
        <span>{value ? moment(value).format('MMM-DD-YYYY') : '---'}</span>
      )}

      {typeCompare === 'time' && (
        <span>{value ? moment(value).format('HH:mm') : '---'}</span>
      )}

      {(typeCompare === 'datetime' || typeCompare === 'datetime-local') && (
        <span>
          {value ? moment(value).format('MMM-DD-YYYY @ HH:mm') : '---'}
        </span>
      )}

      {(typeCompare === 'text' ||
        typeCompare === 'email' ||
        typeCompare === 'password' ||
        typeCompare === 'number' ||
        typeCompare === 'phone' ||
        typeCompare === 'textarea') && <span>{value ? value : '---'}</span>}
    </FormControl.Static>
  );
};

ReFormFieldComponent.propTypes = {
  editing: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string,
  state: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired
};

const enhance = compose(withState('state', 'setState', {}));

const ReFormField = enhance(ReFormFieldComponent);

export default ReFormField;

export const FieldGroup = createReactClass({
  getInitialState() {
    let icon = '';
    if (this.props.icon) {
      icon = this.props.icon;
    } else {
      icon = this.props.type === 'text' ? 'font' : icon;
      icon = this.props.type === 'email' ? 'envelope' : icon;
      icon = this.props.type === 'date' ? 'calendar' : icon;
      icon = this.props.type === 'time' ? 'clock-o' : icon;
      icon = this.props.type === 'datetime' ? 'calendar' : icon;
      icon = this.props.type === 'datetime-local' ? 'calendar' : icon;
      icon = this.props.type === 'password' ? 'lock' : icon;
      icon = this.props.type === 'number' ? 'hashtag' : icon;
      icon = this.props.type === 'phone' ? 'phone' : icon;
      icon = this.props.type === 'select' ? 'chevron-circle-down' : icon;
      icon = this.props.type === 'textarea' ? 'file-text-o' : icon;
    }

    let controlType = this.props.type;
    if (this.props.type === 'phone') {
      controlType = 'text';
    }

    const state = {
      errors: null,
      isValid: false,
      validationState: null,
      required: this.props.required || false,
      type: controlType,
      icon: icon,
      open: false,
      value: this.props.value ? this.props.value : '',
      editing: this.props.editing ? this.props.editing : false,
      readOnly: this.props.readOnly ? this.props.readOnly : false,
      trueLabel: 'True',
      falseLabel: 'False'
    };

    return state;
  },

  componentWillReceiveProps(nextProps) {
    const newState = {};

    if (nextProps.validateError) {
      newState.validationState = nextProps.validateError;
    }

    if (nextProps.trueLabel) {
      newState.trueLabel = nextProps.trueLabel;
    }

    if (nextProps.falseLabel) {
      newState.falseLabel = nextProps.falseLabel;
    }

    if (nextProps.value) {
      newState.value = nextProps.value;
    }

    newState.editing =
      nextProps.editing && nextProps.editing === true ? true : false;

    if (nextProps.editing === false) {
      // reset the value to the default when not editing.
      if (this.state.type === 'select') {
        newState.value = { key: '-', value: 'Select' };
      } else {
        newState.value = this.props.value ? this.props.value : '';
      }
    }

    this.setState(newState);
  },

  focusValue(e) {
    const { currentTarget: { value } } = e;

    if (this.props.onFocus) {
      this.props.onFocus(value);
    }
  },

  blurValue(e) {
    const { currentTarget: { value } } = e;

    if (this.props.onBlur) {
      this.props.onBlur(value);
    }
  },

  changeValue(e) {
    let validationState = null;
    let valid = false;
    let errors = null;

    const state = {
      value: e.currentTarget.value,
      key: e.currentTarget.id,
      isValid: valid,
      errors: errors,
      validationState: validationState
    };

    if (this.state.type === 'password') {
      let passwordValid = valid;
      if (this.props.confirmPassword) {
        passwordValid &= this.props.confirmPassword === state.value;
      }

      state.icon = passwordValid ? 'lock' : 'unlock';
      state.validationState = passwordValid ? 'success' : 'warning';
    }

    if (this.state.type === 'select') {
      state.value = {
        key: e.currentTarget.selectedOptions[0].value,
        value: e.currentTarget.selectedOptions[0].innerHTML
      };
    }

    if (this.state.type === 'date') {
      const { currentTarget: { value } } = e;
      state.value = moment(value, 'YYYY-MM-DD');
    }

    if (this.state.type === 'time') {
      const { currentTarget: { value } } = e;
      state.value = moment(value, 'HH:mm');
    }

    if (this.state.type === 'datetime') {
      const { currentTarget: { value } } = e;
      console.error(
        'you have to deal with me sooner or later ... value not set for datetime',
        { value }
      );
    }

    if (this.props.onChange) {
      this.props.onChange(state.value);
    }

    this.setState(state);
  },

  renderLabel() {
    if (this.props.label) {
      return (
        <ControlLabel>
          {this.props.label}

          {this.props.help && (
            <Button
              bsStyle="link"
              style={{ color: 'black' }}
              onClick={() => this.setState({ open: !this.state.open })}
            >
              <FontAwesome name="question-circle" size="lg" /> Help
            </Button>
          )}
          {this.props.help && (
            <Collapse in={this.state.open}>
              <HelpBlock>
                <p className="text-info">{this.props.help}</p>
              </HelpBlock>
            </Collapse>
          )}
        </ControlLabel>
      );
    }

    return null;
  },

  renderControl() {
    if (this.props.type === 'boolean') {
      return Boolean;
    }

    if (this.props.type === 'textarea') {
      return (
        <FormControl
          style={{ zIndex: 1 }}
          componentClass="textarea"
          rows={this.props.rows ? this.props.rows : 2}
          placeholder={this.props.placeholder}
          onChange={this.changeValue}
          onFocus={this.focusValue}
          onBlur={this.blurValue}
          value={this.state.value}
        />
      );
    }

    if (this.props.type === 'select') {
      return (
        <span>
          {JSON.stringify(this.state.value, null, 2)} -
          {JSON.stringify(this.props.value, null, 2)} -
          <FormControl
            style={{ zIndex: 1 }}
            componentClass="select"
            className="selectpicker"
            data-live-search={true}
            onChange={this.changeValue}
            value={
              this.state.value && this.state.value.key
                ? this.state.value.key
                : this.state.value
            }
            required={this.props.validate && this.props.validate.required}
            placeholder="Please Select ..."
          >
            {this.props.values.map(v => {
              return (
                <option key={v.key} value={v.key}>
                  {v.name}
                </option>
              );
            })}
          </FormControl>
        </span>
      );
    }

    if (this.props.type === 'number') {
      return (
        <FormControl
          style={{ zIndex: 1 }}
          type={this.state.type}
          onChange={this.changeValue}
          onFocus={this.focusValue}
          onBlur={this.blurValue}
          value={this.state.value}
          placeholder={this.props.placeholder}
          step={this.props.step}
          required={this.props.validate && this.props.validate.required}
        />
      );
    }

    if (this.props.type === 'date') {
      return (
        <FormControl
          style={{ zIndex: 1 }}
          type={this.state.type}
          onChange={this.changeValue}
          onFocus={this.focusValue}
          onBlur={this.blurValue}
          value={moment(this.state.value).format('YYYY-MM-DD')}
          placeholder={this.props.placeholder}
          required={this.props.validate && this.props.validate.required}
        />
      );
    }

    if (this.props.type === 'time') {
      return (
        <FormControl
          style={{ zIndex: 1 }}
          type={this.state.type}
          onChange={this.changeValue}
          onFocus={this.focusValue}
          onBlur={this.blurValue}
          value={moment(this.state.value).format('HH:mm')}
          placeholder={this.props.placeholder}
          required={this.props.validate && this.props.validate.required}
        />
      );
    }

    if (
      this.props.type === 'datetime' ||
      this.props.type === 'datetime-local'
    ) {
      return (
        <FormControl
          style={{ zIndex: 1 }}
          type={this.state.type}
          onChange={this.changeValue}
          onFocus={this.focusValue}
          onBlur={this.blurValue}
          value={moment(this.state.value).format('YYYY-MM-DDTHH:mm')}
          placeholder={this.props.placeholder}
          required={this.props.validate && this.props.validate.required}
        />
      );
    }

    return (
      <FormControl
        style={{ zIndex: 1 }}
        type={this.state.type}
        onChange={this.changeValue}
        onFocus={this.focusValue}
        onBlur={this.blurValue}
        value={this.state.value}
        placeholder={this.props.placeholder}
        required={this.props.validate && this.props.validate.required}
      />
    );
  },

  renderStaticControl() {
    return (
      <FormControl.Static style={{ border: '1px solid silver' }}>
        {' '}
        {' '}
        <strong>
          {this.state.type === 'boolean' && (
            <span>
              {this.state.value ? this.state.trueLabel : this.state.falseLabel}
            </span>
          )}

          {this.state.type === 'select' && (
            <span>
              {this.state.value.key === '-'
                ? 'Not Set'
                : this.state.value.value}
            </span>
          )}

          {this.state.type === 'date' && (
            <span>
              {this.state.value
                ? moment(this.state.value).format('MMM-DD-YYYY')
                : '---'}
            </span>
          )}

          {this.state.type === 'time' && (
            <span>
              {this.state.value
                ? moment(this.state.value).format('h:mm a')
                : '---'}
            </span>
          )}

          {(this.state.type === 'datetime' ||
            this.state.type === 'datetime-local') && (
            <span>
              {this.state.value
                ? moment(this.state.value).format('MMM-DD-YYYY @ h:mm a')
                : '---'}
            </span>
          )}

          {(this.state.type === 'text' ||
            this.state.type === 'email' ||
            this.state.type === 'password' ||
            this.state.type === 'number' ||
            this.state.type === 'phone' ||
            this.state.type === 'textarea') && (
            <span>{this.state.value ? this.state.value : '---'}</span>
          )}
        </strong>
      </FormControl.Static>
    );
  },

  render() {
    const overlay = (
      <Popover id="popover-trigger-hover-focus" title="?">
        <strong>Help</strong> {this.props.help}
      </Popover>
    );

    return (
      <FormGroup
        controlId={this.props.id}
        validationState={this.state.validationState}
      >
        {this.renderLabel()}

        <InputGroup style={{ width: '100%' }}>
          <InputGroup.Addon>
            <FontAwesome name={this.state.icon} />
          </InputGroup.Addon>

          <div style={{ width: '92%' }}>
            {this.state.editing === true &&
              this.state.readOnly === false &&
              this.renderControl()}
            {(this.state.editing === false || this.state.readOnly === true) &&
              this.renderStaticControl()}
          </div>
        </InputGroup>

        {!this.state.isValid && (
          <HelpBlock>
            <p className="bg-warning">{this.state.errors}</p>
          </HelpBlock>
        )}
      </FormGroup>
    );
  }
});
