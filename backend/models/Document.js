const mdb = require('mongoose');
const DocumentSchema = mdb.Schema({
    _id: String,
    email:String,
    filename:String,
     data: Object,
})

const document_schema = mdb.model("document", DocumentSchema);
module.exports = document_schema;