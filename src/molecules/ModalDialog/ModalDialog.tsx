import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Breakpoint,
    IconButton,
    Box,
    Typography,
    DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Zoom from '@mui/material/Zoom';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Zoom in={true} ref={ref} {...props} />;
});

export default function ModalDialog(props: Props) {
    const handleClose = () => props.setOpen(false);

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                TransitionComponent={props.zoom ? Transition : undefined}
                maxWidth={props.maxWidth || 'md'}
                scroll={'body'}
            >
                {/* {props.closeButton && (
                    <DialogTitle>
                        <Box display="flex" alignItems="center">
                            {props.title && (
                                <Typography variant="h6" color="primary">
                                    {props.title}
                                </Typography>
                            )}
                            <Box flexGrow={1}></Box>
                            <Box>
                                <IconButton onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </DialogTitle>
                )} */}

                <DialogContent dividers={true}>
                    {React.cloneElement(props.children, {
                        setOpen: props.setOpen
                    })}
                </DialogContent>
                {props.actions && (
                    <DialogActions>{props.actions}</DialogActions>
                )}
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
    actions?: JSX.Element;
    zoom?: boolean;
    title?: string;
}
