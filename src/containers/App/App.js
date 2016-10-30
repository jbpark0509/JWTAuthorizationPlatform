import React from 'react';

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const styles = require('./App.scss');
        return (
            <div className={styles.App}>
                {this.props.children}
            </div>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.object,
    location: React.PropTypes.object
};
