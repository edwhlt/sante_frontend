import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {Button, SwipeableDrawer, IconButton, Divider, MenuItem, TextField} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {GridActionsCellItem} from "@mui/x-data-grid";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

export default function SideCanvas(props) {
    const [open, setOpen] = React.useState(false);
  
    const show = () => {
        setOpen(true);
    };
  
    const close = () => {
        setOpen(false);
    };

    return (
        <>
        {
            props.mode === "icon" && props.startIcon ? (
                <IconButton color={props.color} onClick={show} size={props.size} aria-label={props.btn_title} variant={props.variant}>
                    {props.startIcon}
                </IconButton>
            ) :
            props.mode === "menu" ? (
                <MenuItem onClick={show}>
                    {props.btn_title}
                </MenuItem>
            ) :
            props.mode === "grid" ? (
                <GridActionsCellItem icon={props.startIcon} onClick={show} label={props.btn_title} color={props.color}/>
            ) : (
                <Button onClick={show} size={props.size} color={props.color} variant={props.variant}>{props.btn_title}</Button>
            )
        }
        <SwipeableDrawer anchor={props.anchor} open={open} onClose={close} onOpen={show} style={{ zIndex: 1270 }}>
            <DrawerHeader>
                {props.actions}
                <IconButton onClick={close} ref={props.closeRef} >
                    { (!props.anchor || props.anchor === 'left') && <ChevronLeftIcon />}
                    {props.anchor === 'right' && <ChevronRightIcon />}
                    {props.anchor === 'top' && <ExpandLessIcon />}
                    {props.anchor === 'bottom' && <ExpandMoreIcon />}
                </IconButton>
            </DrawerHeader>
        
            <Divider />
            <div style={{margin: "1em"}}>
                {props.children}
            </div>
        </SwipeableDrawer>
        </>
    )
}
