import React from 'react';
import { useState } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Slide, Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';

import ButtonSpinner from './material/ButtonSpinner';
import {GridActionsCellItem} from "@mui/x-data-grid";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props}/>;
});

const RequestModal = (props) => {
    const { enqueueSnackbar } = useSnackbar();

    const [waiting, setWaiting] = useState(false);
    const [show, setShow] = useState(false);
    const [id] = useState(_uniqueId('dialog-'));
  
    const realise = async () => {
        setWaiting(true);

        try {
            await props.onSuccess()
            close();
            enqueueSnackbar("Opération effectué avec success", {variant: 'success', autoHideDuration: 2000});
        } catch (e) {
            enqueueSnackbar(String(e), {variant: 'error', autoHideDuration: 2000});
            console.log('err', e);
        } finally {
            setWaiting(false);
        }
    }
  
    const close = () => {
      setShow(false);
      props.onClose();
    }
  
    const open = () => {
      setShow(true);
    }
  
    return (
        <>
            {
                props.mode === "icon" && props.startIcon ? (
                    <Tooltip title={props.btn_title}>
                        <IconButton onClick={open} size={props.size} aria-label={props.btn_title} color={props.color}>
                            {props.startIcon}
                        </IconButton>
                    </Tooltip>
                ) : 
                props.mode === "menu" ? (
                    <MenuItem onClick={open}>
                        {props.btn_title}
                    </MenuItem>
                ) :
                props.mode === "grid" ? (
                        <GridActionsCellItem icon={props.startIcon} onClick={open} label={props.btn_title} color={props.color}/>
                ) : (
                    <Button onClick={open} size={props.size} color={props.color}>{props.btn_title}</Button>
                )
            }
            <Dialog onClose={close} aria-labelledby={id} open={show} maxWidth="md" TransitionComponent={Transition} keepMounted style={{ zIndex: 1280 }}>
                <DialogTitle id={id} onClose={close}>
                    {props.title}
                </DialogTitle>
                <DialogContent dividers>
                    {props.children}
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="contained" onClick={close}>Annuler</Button>
                    {props.btn_success && (<ButtonSpinner autoFocus color="primary" variant="contained" onAction={realise}>{props.btn_success}</ButtonSpinner>)}
                </DialogActions>
            </Dialog>
        </>
    );
  };


export default RequestModal
