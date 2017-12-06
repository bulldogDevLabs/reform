import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { FormControl } from 'react-bootstrap';
import compose from 'recompose/compose';
import withState from 'recompose/withState';

export const ReFormStaticControlComponent = props => {
  const {
    type,
    placeholder,
    validate,
    value = '',
    values = [],
    step = 1,
    rows = 3,
    changeValue,
    focusValue,
    blurValue
  } = props;

  if (type === 'boolean') {
    return Boolean;
  }

  if (type === 'textarea') {
    return (
      <FormControl
        style={{ zIndex: 1 }}
        componentClass="textarea"
        rows={rows}
        placeholder={placeholder}
        onChange={changeValue}
        onFocus={focusValue}
        onBlur={blurValue}
        value={value}
      />
    );
  }

  if (type === 'select') {
    return (
      <span>
        {JSON.stringify({ props }, null, 2)}
        <FormControl
          style={{ zIndex: 1 }}
          componentClass="select"
          className="selectpicker"
          data-live-search={true}
          onChange={changeValue}
          value={value && value.key ? value.key : value}
          required={validate && validate.required}
          placeholder={placeholder}
        >
          {values.map(v => (
            <option key={v.key} value={v.key}>
              {v.name}
            </option>
          ))}
        </FormControl>
      </span>
    );
  }

  if (this.props.type === 'number') {
    return (
      <FormControl
        style={{ zIndex: 1 }}
        type={type}
        onChange={changeValue}
        onFocus={focusValue}
        onBlur={blurValue}
        value={value}
        placeholder={placeholder}
        step={step}
        required={validate && validate.required}
      />
    );
  }

  if (type === 'date') {
    return (
      <FormControl
        style={{ zIndex: 1 }}
        type={type}
        onChange={changeValue}
        onFocus={focusValue}
        onBlur={blurValue}
        value={moment(value).format('YYYY-MM-DD')}
        placeholder={placeholder}
        required={validate && validate.required}
      />
    );
  }

  if (type === 'time') {
    return (
      <FormControl
        style={{ zIndex: 1 }}
        type={type}
        onChange={changeValue}
        onFocus={focusValue}
        onBlur={blurValue}
        value={moment(value).format('HH:mm')}
        placeholder={placeholder}
        required={validate && validate.required}
      />
    );
  }

  if (type === 'datetime' || type === 'datetime-local') {
    return (
      <FormControl
        style={{ zIndex: 1 }}
        type={type}
        onChange={changeValue}
        onFocus={focusValue}
        onBlur={blurValue}
        value={moment(value).format('YYYY-MM-DDTHH:mm')}
        placeholder={placeholder}
        required={validate && validate.required}
      />
    );
  }

  return (
    <FormControl
      style={{ zIndex: 1 }}
      type={type}
      onChange={changeValue}
      onFocus={focusValue}
      onBlur={blurValue}
      value={value}
      placeholder={placeholder}
      required={validate && validate.required}
    />
  );
};

ReFormStaticControlComponent.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  validate: PropTypes.string,
  value: PropTypes.string,
  values: PropTypes.array,
  step: PropTypes.number,
  rows: PropTypes.number,
  changeValue: PropTypes.func,
  focusValue: PropTypes.func,
  blurValue: PropTypes.func,
  // hoced
  state: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired
};

const enhance = compose(withState('state', 'setState', {}));

const ReFormStaticControl = enhance(ReFormStaticControlComponent);

export default ReFormStaticControl;
