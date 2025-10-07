import mongoose from 'mongoose';


const petSchema = new mongoose.Schema(
{
name: String,
species: { type: String, enum: ['dog', 'cat', 'bird', 'reptile', 'other'] },
birthDate: Date,
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
{ timestamps: true }
);


export const PetModel = mongoose.model('Pet', petSchema);