import React from 'react';

export default function withRouter(Component) {
    function ComponentWithRouterProp(props) {
      let location = useLocation();
      let navigate = useNavigate();
      let params = useParams();
      return (
        <Component
          {...props}
          router={{ location, navigate, params }}
        />
      );
    }
  
    return ComponentWithRouterProp;
  }

class LoadComponent extends React.Component {
    constructor(props, render) {
        super(props);
        this.state = {waiting: false, render: render};
    }

    render(){
        if(waiting){
            return (<LinearProgress color="secondary" />);
        }
        else {
            return this.state.render;
        }
    }

}