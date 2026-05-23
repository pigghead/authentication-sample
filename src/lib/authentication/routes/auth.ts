// POST route for user sign-up

/*
Summary:
- Sign-up process ensures new users are registered securely in the system

1. Validation Process
    - validatesSignUpData function enforces data integrity. Checks email format against validator.js,
    password strength (minimum length, etc), required fields (firstName, emailId)

2. Password hashing with bcrypt
    - Before saving a user, password gets hashed using bcrypt.hash(), with a salt round of 10
    - Hashed password is then stored securely

3. Generate Jwt Tokens
    - Jwt token is created using getJWT
    - Token is sent back to the client in an httpOnly cookie, ensuring it's secure and cannot be accessed via Javascript
*/