const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");
 
const run = function(sql, params=[], callback=_=>{})
{
    return new Promise(resolve=>{
        db.run(sql,params, err=>{
            if(err)
            {
                console.log(err);
                let result = callback(err);
                if(result instanceof Promise)
                {
                    result
                    .then(_=>resolve())
                    .catch(error=>{if(error) console.log(error); resolve();});
                }
                else
                {
                    resolve();
                }
            }
            else
            {
                resolve()
            }
        })
    })
}
 
const get = function(sql, params=[], callback=_=>{})
{
    return new Promise(resolve=>{
        db.get(sql,params,(err,row)=>{
            if(err)
            {
                console.log(err);
                let result = callback(err);
                if(result instanceof Promise)
                {
                    result
                    .then(_=>resolve())
                    .catch(error=>{if(error) console.log(error); resolve();});
                }
                else
                {
                    resolve();
                }
            }
            else
            {
                resolve(row)
            }
        })
    })
}
 
const all = function(sql, params=[], callback=_=>{})
{
    return new Promise(resolve=>{
        db.all(sql,params,(err,rows)=>{
            if(err)
            {
                console.log(err);
                let result = callback(err);
                if(result instanceof Promise)
                {
                    result
                    .then(_=>resolve())
                    .catch(error=>{if(error) console.log(error); resolve();});
                }
                else
                {
                    resolve();
                }
            }
            else
            {
                resolve(rows)
            }
        })
    })
}
 
const close = function()
{
    return new Promise(resolve=>
    {
        db.close(err=>{if(err)console.log(err); resolve();});
    })
}
 
module.exports = {run, get, all, close}