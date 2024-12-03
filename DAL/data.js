const createDbTables = require("./createDbTables");
const insert = require("./insert");
const select = require("./select");
const {close} = require("./dbAsync");


 
module.exports = 
{
    async load()
    {
        await createDbTables();
    },
 
    insert,
    select,
    close
};

