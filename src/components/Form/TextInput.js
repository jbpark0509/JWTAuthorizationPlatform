import React from 'react';
import * as validations from 'libs/validations';

export default class TextInput extends React.Component {

    constructor(props) {
        super(props);
        this.validateInput = this.validateInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
    }

    componentDidMount() {
        this.handleChange({
            target: {
                name: this.props.name,
                value: this.props.value
            }
        });
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.props.handleInputChange({ name, value });
        this.validateInput({ name, value })
            .then(this.props.inputChange);
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    validateInput(input) {
        return new Promise((res) => {
            let error = false;
            if (this.props.required && !validations.required(input.value)) {
                error = `${this.capitalizeFirstLetter(this.props.displayName)} is required`;
            } else if (this.props.email && !validations.email(input.value)) {
                error = `Invalid email address`;
            } else if (this.props.minLength && !validations.minLength(this.props.minLength)(input.value)) {
                error = `${this.props.displayName} must be at least ${this.props.minLength} characters`;
            } else if (this.props.maxLength && !validations.maxLength(this.props.maxLength)(input.value)) {
                error = `${this.props.displayName} must be less than ${this.props.maxLength} characters`;
            } else if (this.props.customValidations && this.props.customValidations.length > 0) {
                this.props.customValidations.forEach(validation => {
                    const { success, errorMessage } = validation(input.value);
                    if (success === false) {
                        error = errorMessage;
                    }
                });
            }
            this.error = error ? true : false;
            res({...input, error });
        });
    }

    render() {
        return (
            <div className={this.props.width ? `col-sm-${this.props.width}` : null}>
                <div className="form-group">
                    <input
                        className={ this.error && this.props.submitted ? 'form-control input-error' : 'form-control' }
                        type={this.props.type || 'text'}
                        name={this.props.name}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
}

TextInput.propTypes = {
    inputChange: React.PropTypes.func,
    handleInputChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    type: React.PropTypes.string,
    name: React.PropTypes.string,
    displayName: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    required: React.PropTypes.bool,
    width: React.PropTypes.number,
    email: React.PropTypes.bool,
    minLength: React.PropTypes.number,
    maxLength: React.PropTypes.number,
    customValidations: React.PropTypes.array,
    submitted: React.PropTypes.bool,
};
