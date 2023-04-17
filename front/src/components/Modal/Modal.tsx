// components/Modal.tsx
import React, { FC, forwardRef, ReactElement, Ref, PropsWithChildren } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const Transition = forwardRef(function Transition(props: TransitionProps & { children?: ReactElement<any, any> }, ref: Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type ModalProps = PropsWithChildren<{
  open: boolean;
  handleClose: () => void;
}>;

const Modal: FC<ModalProps> = ({ open, handleClose, children }) => {
  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose} aria-describedby="alert-dialog-slide-description">
      <DialogTitle>
        {'Registro'}
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
