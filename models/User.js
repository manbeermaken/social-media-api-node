import mongoose from "mongoose";
import bcrypt from "bcrypt"
import uniqueValidator from "mongoose-unique-validator";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'username must be 3 characters long']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [6, 'password must be 6 characters long']
    }
}, {
    timestamps: true
})

userSchema.plugin(uniqueValidator,{message:'{PATH} already exits'})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema)
export default User