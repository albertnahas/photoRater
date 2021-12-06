import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { NoEncryptionTwoTone } from '@mui/icons-material';

const style: any = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
    border: 'none',
    width: {
        lg: 800,
        md: 600,
        sm: 380,
        xs: '70%',
    }
}

export default function ModalDialog(props: any) {
    const handleOpen = () => props.setOpen(true);
    const handleClose = () => props.setOpen(false);
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={props.open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.open}>
                    <Box sx={props.customStyle ? { ...style, ...props.customStyle } : style}>
                        {props.children}
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
