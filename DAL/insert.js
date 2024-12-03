const db = require("./dbAsync");
 
const insert = {}
 
insert.author = async function(
    first_name=null,
    patronimic=null,
    last_name=null,
    birth_year=null,
    birth_month=null,
    birth_day=null,
    imageDataUrl=null)
{
    let {id} = await db.get(`insert into authors 
            (first_name, last_name, patronimic, birth_year, birth_month, birth_day, image)
            values (?, ?, ?, ?, ?, ?, ?) returning id`,
            [first_name, last_name, patronimic, birth_year, birth_month, birth_day, bufferFromUrl(imageDataUrl)]);
 
    return id;
}
 
insert.article = async function(
    title=null,
    abstract=null,
    pdfDataUrl=null,
    author_ids=[],
    journal_id=null,
    volume_id=null,
    issue_id=null,
    day=null,
    month=null,
    year=null
)
{
 
    await db.run("begin transaction");
 
    let article_id = (await db.get(`insert into articles
       (title, abstract, pdf)
       values(?, ?, ?) returning id`,
       [title, abstract, bufferFromUrl(pdfDataUrl)],
       async err=>
        {
            console.log("error inserting article, rolling back");
            await db.run("rollback");
        }
    )).id;
 
    for(let author_id of author_ids)
    {
        await db.run(`insert into authorship
            (author_id, article_id)
            values(?, ?)`,
            [author_id, article_id],
            async err=>
            {
                console.log("error inserting authorship, rolling back");
                await db.run("rollback");
            }
        )
    }
 
    await db.run(`insert into published
        (article_id, journal_id, volume_id, issue_id, year, month, day)
        values(?, ?, ?, ?, ?, ?, ?)`,
        [article_id, journal_id, volume_id, issue_id, year, month, day],
        async err=>
        {
            console.log("error inserting into published, rolling back");
            await db.run("rollback");
        }
    )
    
 
    await db.run("commit", err=>console.log(err));
 
    return article_id;
        
}
 
insert.publisher = async function(
    name=null,
    website=null,
    email=null,
    address=null,
    phone=null
)
{
    let {id} = await db.get(`insert into publishers
        (name, website, email, address, phone)
        values (?, ?, ?, ?, ?) returning id`,
        [name, website, email, address, phone]);
    
    return id;
}
 
insert.journal = async function(
    name=null,
    website=null,
    publisher_id
)
{
    let {id} = await db.get(`insert into journals
        (name, website, publisher_id)
        values (?, ?, ?) returning id`,
        [name, website, publisher_id]);
 
    return id;
}
 
insert.volume = async function(
    name,
    journal_id
)
{
    let {id} = await db.get(`insert into volumes
        (name, journal_id)
        values (?, ?) returning id`,
        [name, journal_id]);
    
    return id;
}
 
insert.issue = async function(
    name,
    volume_id,
    journal_id
)
{
    let {id} = await db.get(`insert into issues
        (name, volume_id, journal_id)
        values (?, ?, ?) returning id`,
        [name, volume_id, journal_id]);
    
    return id;
}
 
insert.authorship = async function(
    author_id,
    article_id
)
{
    let {id} = await db.get(`insert into authorship
        (author_id, article_id)
        values (?, ?) returning id`,
        [author_id, article_id]);
 
    return id;
}
 
insert.published = async function(
    article_id,
    journal_id,
    issue_id,
    year,
    month,
    day
)
{
 
    let {id} = await db.get(`insert into published
        (article_id, journal_id, issue_id, year, month, day)
        values (?, ?, ?, ?, ?, ?) returning id`,
        [article_id, journal_id, issue_id, year, month, day]);
    
    return id;
}


 
function bufferFromUrl(url)
{
    let buffer = null;
 
    if(url)
    {
        let base64String = url.split(",")[1];
        buffer = Buffer.from(base64String,"base64");
    }
    
    return buffer;
}
 
module.exports = insert;