const db = require("./dbAsync")
 
async function createDbTables()
{  
    await db.run(`PRAGMA foreign_keys = ON;`);
 
    await db.run(`create table if not exists authors (
        id integer primary key autoincrement,
        first_name text,
        last_name text,
        patronimic text,
        birth_year integer,
        birth_month integer,
        birth_day integer,
        image blob
    )`);
 
    await db.run(`create table if not exists articles (
        id integer primary key autoincrement,
        title text,
        abstract text,
        pdf blob
    )`);
 
    await db.run(`create table if not exists publishers (
        id integer primary key autoincrement,
        name text,
        website text,
        email text,
        address text,
        phone text
    )`);
 
    await db.run(`create table if not exists journals (
        id integer primary key autoincrement,
        name text,
        website text,
        publisher_id integer references publishers(id)
    )`);
 
    await db.run(`create table if not exists volumes (
        id integer primary key autoincrement,
        name text,
        journal_id integer references journals(id)
    )`);
 
    await db.run(`create table if not exists issues (
        id integer primary key autoincrement,
        name text,
        volume_id integer references volumes(id),
        journal_id integer references journals(id)
    )`);
 
    await db.run(`create table if not exists authorship (
        id integer primary key autoincrement,
        author_id integer references authors(id),
        article_id integer references articles(id)
    )`);
 
    await db.run(`create table if not exists published (
        id integer primary key autoincrement,
        article_id integer references articles(id),
        journal_id integer references journals(id),
        volume_id integer references volumes(id),
        issue_id integer references issues(id),
        year integer,
        month integer,
        day integer
    )`);
    
}
 
module.exports = createDbTables;
 