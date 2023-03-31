import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import {List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {useNavigate} from "react-router-dom";

const drawerWidth = 240;

const MobileTools = styled('div')(({theme}) => ({
  //display: 'flex',
  [theme.breakpoints.up('md')]: {display: 'none'}
}))

const DesktopTools = styled('div')(({theme}) => ({
  //isplay: 'flex',
  [theme.breakpoints.down('md')]: {display: 'none'}
}))

/*export default function MenuApp(props) {
  const theme = useTheme();
  const [show, setShow] = React.useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const open = () => {
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';

  return (
    <div style={{display: 'flex'}}>
      <CssBaseline />
      <AppBar style={{ zIndex: 1250 }} position="fixed" color="secondary" open={show}>
        <Toolbar>
          <MobileTools>
            <IconButton color="inherit" aria-label="open drawer" onClick={open} edge="start" sx={{
              mr: 2,
              ...(show && { display: 'none' }),
            }}>
              <MenuIcon />
            </IconButton>
          </MobileTools>
          {props.barContent}
          <div style={{flexGrow: 1}} />
          <DesktopTools>
            {props.toolsContent("icon").map((ob, index) => ob)}
          </DesktopTools>
          <MobileTools>
            <IconButton aria-label="Plus" aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={mobileMoreAnchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} id={mobileMenuId} keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={isMobileMenuOpen} onClose={handleMobileMenuClose}>
              {props.toolsContent("menu").map((ob, index) => ob)}
            </Menu>
          </MobileTools>
        </Toolbar>
      </AppBar>


      <MobileTools>
        <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }} variant="persistent" open={show} anchor="left">
          <DrawerHeader>
            <IconButton onClick={close}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          {props.drawerContent}
        </Drawer>

        <Main open={show}>
          <DrawerHeader />
          {props.children}
        </Main>
      </MobileTools>

      <DesktopTools>
        <Drawer variant="permanent"
                sx={{
                  width: drawerWidth,
                  zIndex: (theme) => theme.zIndex.appBar - 1,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
        >
          <Toolbar />
          {props.drawerContent}
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {props.children}
        </Box>
      </DesktopTools>


    </div>
  );
}*/


function MenuApp(props) {
    const { window } = props;
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    let navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    React.useEffect(() => {
        if(matches) setMobileOpen(false);
    }, [matches])

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: 1250 }} color="secondary">
                <Toolbar>
                    <MobileTools>
                        <IconButton color="inherit"
                                    aria-label="open drawer"
                                    onClick={handleDrawerToggle}
                                    edge="start" sx={{
                            mr: 2,
                            ...(mobileOpen && { display: 'none' }),
                        }}>
                            <MenuIcon />
                        </IconButton>
                    </MobileTools>

                    {props.barContent}
                    <div style={{flexGrow: 1}} />
                    <DesktopTools>
                        {props.toolsContent("icon").map((ob, index) => ob)}
                    </DesktopTools>
                    <MobileTools>
                        <IconButton aria-label="Plus" aria-controls={'menu-mobile'} aria-haspopup="true" onClick={(e) => setMobileMoreAnchorEl(e.currentTarget)} color="inherit">
                            <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={mobileMoreAnchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} id={'menu-mobile'} keepMounted
                              transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={isMobileMenuOpen} onClose={() => setMobileMoreAnchorEl(null)}>
                            {props.toolsContent("menu").map((ob, index) => ob)}
                        </Menu>
                    </MobileTools>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                 aria-label="mailbox folders" >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <MobileTools>
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            ...(!matches && { zIndex: 1255 }),
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        <List>
                            {props.routes.filter(r => !r.needProdile || props.currentProfil).map((element, index) => (
                                <ListItemButton key={element.key} onClick={() => {
                                    handleDrawerToggle()
                                    navigate("/"+element.key);
                                }}>
                                    <ListItemIcon>{element.icon}</ListItemIcon>
                                    <ListItemText primary={element.name}/>
                                </ListItemButton>
                            ))}
                        </List>
                    </Drawer>
                </MobileTools>

                <DesktopTools>
                    <Drawer
                        variant="permanent"
                        sx={{
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }} open>
                        <Toolbar />

                        <List>
                            {props.routes.filter(r => !r.needProdile || props.currentProfil).map((element, index) => (
                                <ListItemButton key={element.key} onClick={() => {
                                    navigate("/"+element.key);
                                }}>
                                    <ListItemIcon>{element.icon}</ListItemIcon>
                                    <ListItemText primary={element.name}/>
                                </ListItemButton>
                            ))}
                        </List>
                    </Drawer>
                </DesktopTools>
            </Box>
            <Box component="main" sx={{
                flexGrow: 1,
                p: theme.spacing(3),
                width: { md: `calc(100% - ${drawerWidth}px)` }
            }}>
                <Toolbar />
                {props.children}
            </Box>
        </Box>
    );
}

MenuApp.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default MenuApp;

