import mongoose from 'mongoose';

// define the schema for our activity model
const activitySchema = mongoose.Schema({
    _user       : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _recording  : {type: mongoose.Schema.Types.ObjectId, ref: 'Recording'},
},
{ timestamps: true }
);

// create the model for users and expose it to our ap
// export default mongoose.model('Activity', activitySchema ); // this did work with Mocha for God-know reason
module.exports = mongoose.model('Activity', activitySchema ); // that is why this line exists
