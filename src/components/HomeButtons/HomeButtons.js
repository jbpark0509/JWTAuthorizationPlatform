import React from 'react';

const HomeButtons = (props) => {
    return (
        <div className="homebuttons">
    		<a href="" onClick={props.handleClickLogin} className="btn btn-success">Login</a>
        	<a href="" onClick={props.handleClickRegister} className="btn btn-primary">Register</a>
    	</div>
    );
};

HomeButtons.propTypes = {
    handleClickLogin: React.PropTypes.func.isRequired,
    handleClickRegister: React.PropTypes.func.isRequired
};

export default HomeButtons;
