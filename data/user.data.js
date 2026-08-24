const epicSadface = "Epic sadface:";

export const UserData = Object.freeze({
    users: {
        standard: "standard_user",
        locked: "locked_out_user",
        problem: "problem_user",
        performance: "performance_glitch_user",
        error: "error_user",
        visual: "visual_user"
    },
    password: "secret_sauce",
    expectedMessages: {
        usernameRequired: `${epicSadface} Username is required`,
        passwordRequired: `${epicSadface} Password is required`,
        invalidCredentials: `${epicSadface} Username and password do not match any user in this service`,
        lockedOut: `${epicSadface} Sorry, this user has been locked out.`,
    }
});