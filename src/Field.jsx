import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import { FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';
import compose from 'recompose/compose';
import withState from 'recompose/withState';

import ReFormStaticControl from './StaticControl';
import ReFormControl from './Control';
import ReFormLabel from './Label';

export const ReFormFieldComponent = props => {
  const {
    id,
    validationState = null,
    type = 'text',
    icon = 'question-circle',
    isValid = true,
    errors = null,
    value = '',
    values = [],
    editing = true,
    readOnly = false,
    trueLabel = 'True',
    falseLabel = 'False'
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
        <ReFormLabel />

        <InputGroup style={{ width: '100%' }}>
          <InputGroup.Addon>
            <FontAwesome name={icon} />
          </InputGroup.Addon>

          <div style={{ width: '92%' }}>
            {readOnly ? (
              <ReFormStaticControl
                value={value}
                values={values}
                trueLabel={trueLabel}
                falseLabel={falseLabel}
              />
            ) : (
              <ReFormControl
                value={value}
                values={values}
                trueLabel={trueLabel}
                falseLabel={falseLabel}
              />
            )}
          </div>
        </InputGroup>

        {!isValid && (
          <HelpBlock>
            <p className="bg-warning">{errors}</p>
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
  id: PropTypes.string,
  validationState: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.string,
  isValid: PropTypes.string,
  errors: PropTypes.string,
  value: PropTypes.string,
  values: PropTypes.array,
  editing: PropTypes.bool,
  readOnly: PropTypes.bool,
  trueLabel: PropTypes.string,
  falseLabel: PropTypes.string,
  state: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired
};

const enhance = compose(withState('state', 'setState', {}));

const ReFormField = enhance(ReFormFieldComponent);

export default ReFormField;
