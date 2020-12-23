import mongoose from "mongoose";
import { Password } from "../services/password";

// interface that describes the properties
// that are required to create a new user
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties
// that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String, // refer to actual constructor String
        required: true,
    },
    password: {
        type: String, // refer to actual constructor String
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

// User `function` here to prevent lost of scope this
userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done(); 
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// Better way to do this is use userSchema.statics.build
// const buildUser = (attrs: UserAttrs) => {
//     return new User(attrs);
// }

// User.build({
//     email: "test@test.com",
//     password: "password",
// });

export { User };