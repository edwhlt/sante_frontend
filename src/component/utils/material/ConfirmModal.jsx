import React, {useState} from 'react';
import _uniqueId from 'lodash/uniqueId';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem } from '@mui/material';

import ButtonSpinner from './ButtonSpinner';
import DeleteIcon from "@mui/icons-material/Delete";
import {GridActionsCellItem} from "@mui/x-data-grid";
import {useSnackbar} from "notistack";


const ConfirmModal = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const [waiting, setWaiting] = useState(false);
    const [show, setShow] = useState(false);
    const [id] = useState(_uniqueId('dialog-'));

    const realise = async () => {
        setWaiting(true)
        try {
            await props.onSuccess()
            setShow(false);
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
    }

    const open = () => {
        setShow(true);
    }

    return (
        <>
            {
                props.mode === "icon" && props.startIcon ? (
                        <IconButton onClick={open} size={props.size} aria-label={props.btn_title} color={props.color}>
                            {props.startIcon}
                        </IconButton>
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
            <Dialog onClose={close} aria-labelledby={id} open={show} maxWidth={props.maxWidth}>
                {props.title && (
                    <DialogTitle id={id} onClose={close}>
                        {props.title}
                    </DialogTitle>
                )}
                <DialogContent>
                    {props.children}
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="outlined" onClick={close}>Annuler</Button>
                    {props.onSuccess && <ButtonSpinner autoFocus color="primary" variant="contained" onAction={realise}>Confirmer</ButtonSpinner>}
                </DialogActions>
            </Dialog>
        </>
    )


}

/*class ConfirmModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {waiting: false, show: false, id: _uniqueId("dialog-")};

        this.realise = this.realise.bind(this);

        this.close = this.close.bind(this);
        this.show = this.show.bind(this);
    }

    realise(){
        this.setState({waiting: true})
        return this.props.onSuccess(this.state).then((results) => {
            this.setState({waiting: false});
            this.close();
        }).catch((err) => {
            console.log(err)
            this.setState({err: err, waiting: false})
        });
    }

    close(){
        this.setState({show: false});
    }

    show(){
        this.setState({show: true});
    }


    render(){
        const { id, show, err } = this.state
        const { title, btn_title } = this.props;

        return (
            <>
                {
                    this.props.mode === "icon" && this.props.startIcon ? (
                        <IconButton onClick={this.show} size={this.props.size} aria-label={btn_title} color={this.props.color}>
                            {this.props.startIcon}
                        </IconButton>
                    ) : 
                    this.props.mode === "menu" ? (
                        <MenuItem onClick={this.show}>
                            {btn_title}
                        </MenuItem>
                    ) :
                    this.props.mode === "grid" ? (
                        <GridActionsCellItem icon={this.props.startIcon} onClick={this.show} label={btn_title} color={this.props.color}/>
                    ) : (
                        <Button onClick={this.show} size={this.props.size} color={this.props.color}>{btn_title}</Button>
                    )
                }
                <Dialog onClose={this.close} aria-labelledby={id} open={show} maxWidth={this.props.maxWidth}>
                    {title && (
                        <DialogTitle id={id} onClose={this.close}>
                            {title}
                            {err && (<p>{err}</p>)}
                        </DialogTitle>
                    )}
                    <DialogContent>
                        {this.props.children}
                    </DialogContent>
                    <DialogActions>
                        <Button color="error" variant="outlined" onClick={this.close}>Annuler</Button>
                        {this.props.onSuccess && <ButtonSpinner autoFocus color="primary" variant="contained" onAction={this.realise}>Confirmer</ButtonSpinner>}
                    </DialogActions>
                </Dialog>
            </>
        )

    }


}*/

export default ConfirmModal