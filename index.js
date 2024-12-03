const data = require("./DAL/data");
const {server, postRequests} = require("./server")
 
data.load().then(_=>server.listen(3000,"localhost"));
 
postRequests.on("message", (url, buffer)=>
{
    
})
 
process.stdin.setRawMode(true);
process.stdin.on("data", async _=>
{
    server.closeAllConnections();
    await new Promise(resolve=>server.close(_=>resolve()));
    await data.close();
    process.exit(0);
});