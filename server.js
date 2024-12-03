const http = require("http");
const EventEmitter = require("events");
const fs = require("fs");
const data = require("./DAL/data");


 
const postRequests = new EventEmitter();
 
const server = http.createServer(async (req,res)=>
{
    let url = new URL(req.url,"http://localhost");
    if(req.method == "POST")
    {
        let arr = [];
        req.on("data",chunk=>arr.push(chunk));
        req.on("end", _=>
        {
            let buffer = Buffer.concat(arr);
            switch(url.pathname)
            {
 
                case "/authors":
                    {
                        let obj = JSON.parse(buffer.toString());
                        data.insert.author(
                            obj.first_name,
                            obj.patronimic,
                            obj.last_name,
                            obj.birth_year,
                            obj.birth_month,
                            obj.birth_day,
                            obj.image
                        ).then(id => res.end(JSON.stringify({id})));
                    }
                break;
 
                case "/articles":
                    {
                        let obj = JSON.parse(buffer.toString());
                        data.insert.article(
                            obj.title,
                            obj.abstract,
                            obj.pdf,
                            obj.author_ids,
                            obj.journal_id,
                            obj.volume_id,
                            obj.issue_id,
                            obj.day,
                            obj.month,
                            obj.year
                        ).then(id => res.end(JSON.stringify({id})));
                    }
                break;
 
                default:
                    res.end();
            }
            postRequests.emit("message", url, buffer);
        })
    }
    else
    {
        let params = Object.fromEntries(url.searchParams.entries());
        switch(url.pathname)
        {
            case "/":
                res.setHeader("Content-Type", "text/html");
                fs.createReadStream("index.html").pipe(res);
            break;
 
            case "/authors":
                res.setHeader("Content-Type","application/json");
                res.end(JSON.stringify(await data.select.authors(params.last_name)));
            break;
 
            case "/articles":
                res.setHeader("Content-Type","application/json");
                res.end(JSON.stringify(await data.select.articles(params.title)));
            break;
 
            case "/journals":
                res.setHeader("Content-Type","application/json");
                res.end(JSON.stringify(await data.select.journals(params.name)));
            break;
 
            case "/volumes":
                res.setHeader("Content-Type","application/json");
                res.end(JSON.stringify(await data.select.volumes(params.journal_id)));
            break;
 
            case "/issues":
                res.setHeader("Content-Type","application/json");
                res.end(JSON.stringify(await data.select.issues(params.volume_id)));
            break;
 
            case "/image":
                res.setHeader("Content-Type","image/jpeg");
                res.end(await data.select.author_image(params.author_id));
            break;
 
            case "/pdf":
                {
                    let pdf = await data.select.article_pdf(params.article_id)
                    if(pdf)
                    {
                        res.setHeader("Content-Type","application/pdf");
                        res.end(pdf);
                    }
                    else
                    {
                        res.statusCode = 404;
                        res.end();
                    }
                }
            break;
 
            default: 
            res.statusCode = 404;
            res.end();
        }
 
    }
});
 
module.exports = {server, postRequests}