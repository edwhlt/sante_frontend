import React from 'react';
import Weeks from "./day/Weeks";

class Dashboard extends React.Component {
  
    render() {
        const { profil } = this.props;

        return (
            <Weeks profil={profil}></Weeks>
        )
    }
  }
  export default Dashboard