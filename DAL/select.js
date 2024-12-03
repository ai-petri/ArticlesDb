const db = require("./dbAsync");
 
const select = {};
 
select.authors = async function(last_name=null)
{
    let rows = await  db.all(`select id, first_name, last_name, patronimic, birth_year, birth_month, birth_day
    from authors where (last_name like '%'||?1||'%' or ?1 is null)`,[last_name]);
 
    return rows;        
}
 
select.author_image = async function(author_id)
{
    let row = await db.get(`select image from authors where id = ?`,[author_id]);
 
    return row?.image;
}
 
select.articles = async function(title=null)
{
 
    let rows = await db.all(`select
            articles.id,
            articles.title,
            articles.abstract, 
            published.year, 
            published.month, 
            published.day,
            journals.name as journal,
            volumes.name as volume,
            issues.name as issue,
            json_group_array(json_object('id', authors.id, 'first_name', first_name,  'patronimic', patronimic, 'last_name', last_name)) as authors
            from articles 
            left join authorship on articles.id = authorship.article_id
            left join authors on author_id = authors.id
            left join published on articles.id = published.article_id
            left join journals on published.journal_id = journals.id
            left join issues on published.issue_id = issues.id
            left join volumes on issues.volume_id = volumes.id
            where (title like '%'||?1||'%' or ?1 is null)
            group by articles.id`,
            [title]);
 
    return rows.map(o=>{
        let result = {...o};
        result.authors = JSON.parse(result.authors);
        return result}
    )
    
}
 
select.article_pdf = async function(article_id)
{
    let row = await db.get(`select pdf from articles where id = ?`, [article_id]);
    return row?.pdf;
}
 
select.publishers = async function(name=null)
{
    let rows = await db.all(`select id, name, website, email, address, phone
            from publishers
            where (name like '%'||?1||'%' or ?1 is null)`, [name]);
 
    return rows;
}
 
select.journals = async function(name=null)
{
    let rows = await db.all(`select journals.id as id,
            journals.name as name,
            journals.website as website,
            publisher_id,
            publishers.name as publisher_name,
            (select json_object(
            "volume", volumes.name,
            "issues", (select json_group_array(issues.name) from issues where issues.volume_id = volumes.id)
            ) from volumes where volumes.journal_id = journals.id) as volumes
            from journals
            join publishers on publishers.id = publisher_id
            where (journals.name like '%'||?1||'%' or ?1 is null)`,
            [name]);
 
    return rows.map(o=>{
        let obj = {...o}
        obj.volumes = JSON.parse(obj.volumes)
        return obj;
    });
}
 
select.volumes = async function(journal_id=null)
{
    let rows = await db.all(`select id, name, journal_id
            from volumes
            where (journal_id = ?1 or ?1 is null)`,
            [journal_id]);
 
    return rows;
}
 
select.issues = async function(volume_id=null)
{
 
    let rows = await db.all(`select id, name, journal_id, volume_id
            from issues
            where (volume_id = ?1 or ?1 is null)`,
            [volume_id]);
 
    return rows;
}
 
module.exports = select;