import React from 'react';
import _uniqueId from 'lodash/uniqueId';
import { IconButton, Menu as MaterialMenu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {anchor: null, id: _uniqueId("menu-")};
        
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    open(event){
        this.setState({anchor: event.currentTarget});
    }

    close(){
        this.setState({anchor: null});
    }

    render(){
        const { anchor, id } = this.state;
        const { options } = this.props;

        return (
            <>
                <IconButton aria-label="more" aria-controls={id} aria-haspopup="true" onClick={this.open}>
                    <MoreVertIcon/>
                </IconButton>
                <MaterialMenu id={id} anchorEl={anchor} keepMounted open={Boolean(anchor)} onClose={this.close}
                    PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                    }}>
                    {options.map((option) => (
                        <MenuItem key={option.title} onClick={() => {
                            this.close();
                            option.onAction();
                        }}>
                        {option.title}
                        </MenuItem>
                    ))}
                </MaterialMenu>
            </>
        )
    }
}

export default Menu;