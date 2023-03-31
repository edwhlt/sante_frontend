import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {LinearProgress, MenuItem, Tooltip} from "@mui/material";
import {GridActionsCellItem} from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
    const [show, setShow] = React.useState(false);
    const [load, isLoad] = React.useState(false);

    const open = () => {
        setShow(true);
    };

    const refresh = () => {
        isLoad(true);
        props.refresh().then(r => {
            isLoad(false);
        })
    }

    const close = () => {
        setShow(false);
    };

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
            <Dialog fullScreen open={show} onClose={close} TransitionComponent={Transition} style={{ zIndex: 1260 }}>
                <AppBar sx={{ position: 'relative' }} color="secondary">
                    <Toolbar>
                        <IconButton autoFocus edge="start" color="inherit" onClick={close} aria-label="close" >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {props.title}
                        </Typography>

                            <IconButton color="inherit" onClick={refresh}>
                                <RefreshIcon />
                            </IconButton>
                    </Toolbar>
                </AppBar>
                {load ? (
                    <LinearProgress color="secondary" />
                ) : props.children}
            </Dialog>
        </>
    );
}