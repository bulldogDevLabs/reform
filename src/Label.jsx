import PropTypes from 'prop-types';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Button, Collapse, ControlLabel, HelpBlock } from 'react-bootstrap';
import compose from 'recompose/compose';
import withState from 'recompose/withState';

export const ReFormLabelComponent = props => {
  const { label, help, open, setOpen } = props;

  if (label) {
    return (
      <ControlLabel>
        {label}

        {help && (
          <Button
            bsStyle="link"
            style={{ color: 'black' }}
            onClick={() => setOpen(!open)}
          >
            <FontAwesome name="question-circle" size="lg" /> Help
          </Button>
        )}
        {help && (
          <Collapse in={open}>
            <HelpBlock>
              <p className="text-info">{help}</p>
            </HelpBlock>
          </Collapse>
        )}
      </ControlLabel>
    );
  }

  return null;
};

ReFormLabelComponent.propTypes = {
  label: PropTypes.bool,
  help: PropTypes.string,
  // hoc
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
};

const enhance = compose(withState('open', 'setOpen', false));

const ReFormLabel = enhance(ReFormLabelComponent);

export default ReFormLabel;
