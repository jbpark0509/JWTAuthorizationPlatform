import React from 'react';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: new Map(),
            showErrors: false,
            submitted: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.showErrors = this.showErrors.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.state.errors.size > 0) {
            this.props.onSubmit();
        }
        this.setState({ showErrors: true, submitted: true });
    }

    inputChange({ name, value, error }) {
        return new Promise((res) => {
            const errors = this.state.errors;
            if (error) {
                errors.set(name, error);
            } else {
                errors.delete(name);
            }
            if (this.props.customValidations) {
                let customValidationMessage = false;
                for (const validation of this.props.customValidations) {
                    const { success, errorMessage } = validation(name, value) || { success: true };
                    if (!success) {
                        customValidationMessage = errorMessage;
                        errors.set('customError', customValidationMessage);
                        break;
                    }
                }
                if (!customValidationMessage) {
                    errors.delete('customError');
                }
            }
            this.setState({ errors });
            res({ name, value });
        });
    }

    showErrors() {
        const errorComponent = [];
        const styles = require('./Form.scss');
        this.state.errors.forEach((error, name) => {
            errorComponent.push(<div key={name} className={styles.Error}>{error}</div>);
        });
        return errorComponent;
    }

    render() {
        const styles = require('./Form.scss');
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                inputChange: this.inputChange,
                submitted: this.state.submitted
            })
        );

        return (
            <form onSubmit={this.handleSubmit}>
                {childrenWithProps}
                { this.state.showErrors ? <div className={styles.Error}>{this.showErrors()}</div> : null }
            </form>
        );
    }
}

Form.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]),
    onSubmit: React.PropTypes.func,
    customValidations: React.PropTypes.array
};
