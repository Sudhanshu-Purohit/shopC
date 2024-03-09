import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: "admin" | "user";
    gender: "male" | "female";
    dob: Date;
    createdAt: Date;
    updatedAt: Date;
    // virtual attribute
    age: number;
}

const schema = new mongoose.Schema({
    _id: {type: String, required: [true, 'Please enter ID']},
    name: {type: String, required: [true, 'Please enter name']},
    email: {
        type: String, 
        unique: [true, 'Email already exist'], 
        required: [true, 'please enter email'],
        validate: [validator.isEmail, 'Please enter valid email']
    },
    photo: {type: String, required: [true, 'Please add photo']},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    gender: {type: String, enum: ['male', 'female'], required: [true, 'Please enter gender']},
    dob: {type: Date, required: [true, 'Please enter date of birth']}
}, {
    timestamps: true,
})

// adding a virtual attribute --> age
schema.virtual('age').get(function() {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();

    if(today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) {
        age = age - 1;
    }

    return age; 
});

export const User = mongoose.model<IUser>("User", schema);