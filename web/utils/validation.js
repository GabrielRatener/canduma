
export const MIN_NAME_LENGTH = 5;
export const MAX_NAME_LENGTH = 40;

export const MIN_TITLE_LENGTH = 1;
export const MAX_TITLE_LENGTH = 40;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 40;

export const passwordTests = [
    {
        title: "At least eight characters",
        description: "Password too short",
        test(password) {
            return password.length >= MIN_PASSWORD_LENGTH;
        }
    },
    {
        title: "At-least one special character",
        description: "Password doesn't contain special characters",
        test(password) {
            return !/^[a-zA-Z0-9_-]+$/.test(password);
        }
    },
    {
        title: "At-least one uppercase letter",
        description: "Password doesn't contain any uppercase characters",
        test(password) {
            return /[A-Z]/.test(password);
        }
    },
    {
        title: "At-least one number",
        description: "Password doesn't contain any numbers",
        test(password) {
            return /[0-9]/.test(password);
        }
    }
]

export const testPassword = (password) => {
    for (const {test} of passwordTests) {
        if (!test(password)) {
            return false;
        }
    }

    // yes, we secretly test for max-length too
    return password.length <= 40;
}

export const testUserName = (name) => {
    const regex = new RegExp(`^[a-zA-Z \\.]{${MIN_NAME_LENGTH},${MAX_NAME_LENGTH}}$`);

    return regex.test(name);
}

export const testTitle = (title) => {
    
    return (
        !!title &&
        title.length >= MIN_TITLE_LENGTH &&
        title.length <= MAX_TITLE_LENGTH
    );
}
