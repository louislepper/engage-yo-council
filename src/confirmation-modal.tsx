import React, { FunctionComponent } from 'react';
import { Message } from './confirmation-modal.style';
interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}
export const ConfirmationModal: FunctionComponent<ConfirmationModalProps> = (props) => {
  return (
    <React.Fragment>
      <Message>{props.children}</Message>
    </React.Fragment>
  );
};