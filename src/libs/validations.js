const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */ ];

export function email(value) {
    if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        return false;
    }
    return true;
}

export function required(value) {
    if (isEmpty(value) || value === '') {
        return false;
    }
    return true;
}

export function minLength(min) {
    return value => {
        if (!isEmpty(value) && value.length < min) {
            return false;
        }
        return true;
    };
}

export function maxLength(max) {
    return value => {
        if (!isEmpty(value) && value.length > max) {
            return false;
        }
        return true;
    };
}

export function passwordValidation(value) {
    const regularExpression = new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])');
    if (!regularExpression.test(value)) {
        return false;
    }
    return true;
}

export function integer(value) {
    if (!Number.isInteger(Number(value))) {
        return 'Must be an integer';
    }
}

export function oneOf(enumeration) {
    return value => {
        if (!~enumeration.indexOf(value)) {
            return `Must be one of: ${enumeration.join(', ')}`;
        }
    };
}

export function match(field) {
    return (value, data) => {
        if (data) {
            if (value !== data[field]) {
                return 'Do not match';
            }
        }
    };
}

export function isSame(str1, str2) {
    if (str1 === str2) {
        return true;
    }
    return false;
}

export function createValidator(rules) {
    return (data = {}) => {
        const errors = {};
        Object.keys(rules).forEach((key) => {
            const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
            const error = rule(data[key], data);
            if (error) {
                errors[key] = error;
            }
        });
        return errors;
    };
}
