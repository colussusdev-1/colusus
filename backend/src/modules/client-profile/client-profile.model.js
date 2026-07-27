import mongoose from "mongoose";


const clientProfileSchema = new mongoose.Schema(

{

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true,

    },


    phoneNumber: {

        type: String,

        default: "",

    },


    dateOfBirth: {

        type: Date,

    },


    nationality: {

        type: String,

        default: "",

    },


    currentCountry: {

        type: String,

        default: "",

    },


    address: {

        type: String,

        default: "",

    },


    passportNumber: {

        type: String,

        default: "",

    },


    migrationGoal: {

        type: String,

        enum: [

            "STUDY",

            "WORK",

            "TOURISM",

            "PERMANENT_RESIDENCE",

            "OTHER"

        ],

        default: "OTHER",

    },


    preferredDestination: {

        type: String,

        default: "",

    },


},

{

    timestamps:true,

}

);



const ClientProfile = mongoose.model(

    "ClientProfile",

    clientProfileSchema

);



export default ClientProfile;