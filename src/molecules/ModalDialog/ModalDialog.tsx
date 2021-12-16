import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Breakpoint,
    IconButton,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function ModalDialog(props: Props) {
    const handleClose = () => props.setOpen(false);
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={props.maxWidth || 'md'}
            >
                {props.closeButton && (
                    <DialogTitle>
                        <Box display="flex" alignItems="center">
                            <Box flexGrow={1}></Box>
                            <Box>
                                <IconButton onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </DialogTitle>
                )}
                <DialogContent>{props.children}</DialogContent>
            </Dialog>
        </div>
    );
}

interface Props {
    setOpen: (open: boolean) => any;
    open: boolean;
    maxWidth?: Breakpoint;
    closeButton?: boolean;
    children: JSX.Element;
}
