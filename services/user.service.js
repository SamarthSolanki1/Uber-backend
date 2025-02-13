import userModel from "../models/user.model.js";

export default async function createuser({ firstname, lastname, email, password, mobileNumber }) {
    if (!firstname || !lastname || !email || !password || !mobileNumber) {
        throw new Error("All fields are required");
    }

    try {
        const user = await userModel.create({
            fullname: {
                firstname,
                lastname
            },
            email,
            mobileNumber,
            password
        });
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user."); // Re-throw a more generic error for external handling
    }
}