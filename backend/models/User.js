const mdb = require('mongoose');
const UserSchema = mdb.Schema({
    userName: String,
    email:String,
    password: String,
})

const user_schema = mdb.model("user", UserSchema);
module.exports = user_schema;