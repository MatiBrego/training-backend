# Databases

Broadly speaking, a database is any logically modeled collection of infomration.
A database does not necesarily have to be stored on a computer, but in context of websites and
applications, when we refer to a _database_ we talk about a computer program that allows us to store 
data in some way. 

These computer programs we refer to, are formally known as _Database Management Systems (DBMS)_. 
Different DBMS usually havce their unique set of features and associated toolsets, but generally any 
database falls in one of two categories: _relational_ and _non-relational_ databases

## Relational databases (SQL)

Most DBMS have been designed around the relational model. The most fundamental elements in 
relational databases are _relations (tables)_. A relation is a set of _tuples (rows)_, with each 
tuple sharing a set of _attributes (columns)_.

If we want to model users and post we would do something like:

### Table Users

| id | name       | phone_number | email              |
| -- | ---------- | ------------ | ------------------ |
| 1  | Jane Doe   | 12345678     | janedoe@mail.com   |
| 2  | John Smith | 23456781     | johnsmith@mail.com |
| 3  | Mary Roe   | 34567812     | maryroe@mail.com   |

### Table Posts

| id | author | content      |
| -- | ------ | ------------ |
| 1  | 1      | Hello world! |
| 2  | 1      | Test         |
| 3  | 2      | Lorem ipsum  |

This way we can see that relations (or tables) hold a set of tuples (or rows) that share the same 
attributes (or colums).

### Primary Keys

In the relational model, each table contains at least one column that can be used to uniquely 
identify each row, called a _primary key_. 

Building on top of the previous example, we can see that in both tables we can uniquely identify 
each row with the `id` attribute. This will allow the DBMS to return exactly the record we're 
looking for.

### Foreign Keys

Also if we have two tables that we want to associate with one another, one way you can do so is with 
a _foreign key_. A foreign key is esentially a copy of one table's primary key inserted into a 
column in another table, so we can establish a relationship between both tables.

In the previous example, we can establish that the `author` column is a foreign key that points to 
the `Users` table primary key (`id` column).

### SQL

The relational model's structure elements help to keep data in an organizad way, but until now, we 
don't know how anyone can insert, retrieve and modify data inside columns. For that purpose, DBMSs 
have defined a language called _Structured Query Language (SQL)_.

### Further reading and examples

Some open-source relational DBMSs:

- [PostgreSQL](https://www.postgresql.org/)
- [MySQL](https://www.mysql.com/)
- [MariaDB](https://mariadb.org/)
- [SQLite](https://www.sqlite.org/index.html)

Learn more about relational databases:

- [SQL tutorial series](https://www.digitalocean.com/community/tutorial_series/how-to-use-sql) (begginer)
- [SQL intro](./sql_intro/README.md) (begginer)
- [CAP theorem](https://mwhittaker.github.io/blog/an_illustrated_proof_of_the_cap_theorem/) (intermediate)
- [ACID transactions](https://www.mongodb.com/basics/acid-transactions) (intermediate)
- [Sharding](https://www.digitalocean.com/community/tutorials/understanding-database-sharding) (advanced)

## Non-relational databases (NoSQL)

Most application use the relation model to store and organize data. However, the reltion model cannot meet the needs of every application. For example, it's difficult to scale relational databases horizontally, and though they're great for storing structured data, they're less useful for storing unstructured data.

These and other limitations of the relational model have led to the development of alternatives. Collectively, these database models are often referred to as _non-relational databases_. Because these alternative models typically don’t implement SQL for defining or querying data, they are also sometimes referred to as _NoSQL databases_. This also means that many NoSQL databases implement a unique syntax to insert and retrieve data.

### Key-Value Databases

Key-value databases, also known as key-value stores, work by storing and managing associative arrays. An associative array, also known as a dictionary or hash table, consists of a collection of key-value pairs in which a key serves as a unique identifier to retrieve an associated value. Values can be anything from simple objects, like integers or strings, to more complex objects, like JSON structures.

[Redis](https://redis.io/) is an example of a popular, open-source key-value store.

### Document-Oriented Databases

Document-oriented databases, or document stores, are NoSQL databases that store data in the form of documents. Document stores are a type of key-value store: each document has a unique identifier — its key — and the document itself serves as the value. The difference between these two models is that, in a key-value database, the data is treated as opaque and the database doesn’t know or care about the data held within it; it’s up to the application to understand what data is stored. In a document store, however, each document contains some kind of metadata that provides a degree of structure to the data. Document stores often come with an API or query language that allows users to retrieve documents based on the metadata they contain. They also allow for complex data structures, as you can nest documents within other documents.

[MongoDB](https://www.mongodb.com/) is a widely used document database. The documents you store in a MongoDB database are written in BSON, which is a binary form of JSON.

### Columnar Databases

Columnar databases, sometimes called column-oriented databases, are database systems that store data in columns. This may seem similar to traditional relational databases, but rather than grouping columns together into tables, each column is stored in a separate file or region in the system’s storage. The data stored in a columnar database appears in record order, meaning that the first entry in one column is related to the first entry in other columns. This design allows queries to only read the columns they need, rather than having to read every row in a table and discard unneeded data after it’s been stored in memory.

[Apache Cassandra](https://cassandra.apache.org/_/index.html) is a widely used open-source column store.

### Further reading

- [NoSQL explained](https://www.mongodb.com/nosql-explained) (begginer)
- [Introduction to document-oriented databases](https://www.digitalocean.com/community/conceptual-articles/an-introduction-to-document-oriented-databases) (begginer)