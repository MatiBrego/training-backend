# Relational databases: Getting started

This tutorial will quickly get you started with our relational database. You will learn more if you 
run each of these queries yourself and experiment with your own variations.

The database used in this course are based on information about movies and actors, taken from the 
`Internet Movie Database (IMDb)`. We have structured the data into a relational form, which is 
described in detail in the schema documentation.

We use SQL as query language. SQL is a vast language, and this tutorial teaches you a small subset 
through examples. However, we do try to cover the most commonly used constructs in the query 
language.

The database management system is `HyperSQL Database (HSQLDB)`, which has the advantage of being 
quite easy to set up. The things you will learn in these exercises apply equally to more common 
databases you might have heard of, such as `MySQL` or `PostgreSQL`.

## Setting it up

You can use your own computer.

You need to download two files: one containing the database program and another containing the data. 

Download the database program code (`relational-db.jar`) and the small example database 
(`relational-small`), and put them in the same directory. Now you are ready to explore the data.

In your terminal, change to the directory containing the downloaded JAR file, and run it as follows:

```
java -jar relational-db.jar relational-small
```

The last part of that command, relational-small, is the name of the subdirectory containing the data 
files. When you run it, a HSQL Database Manager window should pop up. On the left is a list of 
tables (called public.certificates and so on). At the top is a box where you can type a query, and 
at the bottom is an area where the results will appear.

## Looking at a single table

Each movie in the database is identified by a unique number, its ID. For example, the ID of the 
latest Star Wars movie is `3470465`. If you know that ID, you can look up information about the 
movie.

Type the following query in the top-right box, and click the Execute SQL button to run it:

```sql
SELECT * FROM movies WHERE id = 3470465;
```

It should produce a result looking like this:

```
     ID  TITLE                                              YEAR
-------  -------------------------------------------------  ----
3470465  Star Wars: Episode VII - The Force Awakens (2015)  2015
```

The `*` here specifies that every column from the table will be printed. If we wanted only the 
`title` and `year` columns we could write:

```sql
SELECT title, year
FROM movies
WHERE id = 3470465;
```

This query produces the output:

```
TITLE                                              YEAR
-------------------------------------------------  ----
Star Wars: Episode VII - The Force Awakens (2015)  2015
```

If you don't already know the ID and are not even sure of the `title`, then you might search using a 
string match:

```sql
SELECT * FROM movies WHERE title LIKE '%Star%';
```

This query produces the output:

```
     ID  TITLE                                              YEAR
-------  -------------------------------------------------  ----
2589088  Afghan Star (2009)                                 2009
3470162  Star Trek (2009)                                   2009
3470465  Star Wars: Episode VII - The Force Awakens (2015)  2015
3672262  Twenty Feet from Stardom (2013)                    2013
```

The `LIKE` operator searches for strings that match some pattern, and the percent sign % means "any 
sub-string can appear here". Thus, title `LIKE '%Star%'` means searching for movies whose title 
contains the word Star as a sub-string.

If you don't want to search, you can list movies in alphabetical order, for example show the first 
five:

```sql
SELECT * FROM movies ORDER BY title LIMIT 5;
```

which looks like this:

```
     ID  TITLE                                 YEAR
-------  ------------------------------------  ----
2544956  12 Years a Slave (2013)               2013
2552840  4 luni, 3 saptamâni si 2 zile (2007)  2007
2589088  Afghan Star (2009)                    2009
2607939  American Hustle (2013)                2013
2611256  An Education (2009)                   2009
```

If you leave off the `LIMIT 5` and don't have any `WHERE` clause, you get back all the movies in the 
database. If you leave off the `ORDER BY title`, you get back the results in some arbitrary, 
undefined order.

We can count movies per year using the `GROUP BY` construct:

```sql
SELECT year, count(*) AS total
FROM movies
GROUP BY year
ORDER BY year;
```

This query produces the output:

```
YEAR  TOTAL
----  -----
2004      1
2006      9
2007     10
2008     12
2009     10
2010      9
2011     10
2012     10
2013     11
2014     10
2015      8
```

The `GROUP BY year` construct will group together all records in the movies table that have the same 
value for the year attribute. The `count(*) as total` specifies that the records in each group are 
to be counted, and that this count is associated with the new column named total. Here 
`ORDER BY year` will see that year is an integer value and then use the standard numeric order. If 
we wanted to order the list in the reverse order we could use `ORDER BY year DESC` as follows:

```sql
SELECT year, count(*) AS total
FROM movies
GROUP BY year
ORDER BY year DESC;
```

This query produces the output:

```
YEAR  TOTAL
----  -----
2015      8
2014     10
2013     11
2012     10
2011     10
2010      9
2009     10
2008     12
2007     10
2006      9
2004      1
```

Our collection of 100 movies in the small database corresponds to the top ten movies per year from 
2006 to 2015, according to the web site `Rotten Tomatoes`. We can see from this query that `IMDb` 
and `Rotten Tomatoes` do not always agree on the year associated with a movie!

Now experiment with your own queries on the people table.

## JOIN: Combining records from multiple tables

There are many tables in our database that provide additional information about each movie. Those 
tables are called `certificates`, `color_info`, `keywords`, `languages`, `genres`, `locations`, 
`release_dates`, and `running_times`. Each of these tables contains records with a `movie_id` 
together with some additional values.

Let's take a peek at the languages table:

```sql
SELECT * FROM languages LIMIT 10;
```

This query produces the output:

```
MOVIE_ID  LANGUAGE  NOTE
--------  --------  ------------------
 2544956  English   [null]
 2552840  Romanian  [null]
 2589088  Dari      [null]
 2589088  English   [null]
 2589088  Pashtu    [null]
 2607939  Arabic    [null]
 2607939  English   [null]
 2611256  English   [null]
 2611256  French    (only a few lines)
 2622261  English   [null]
```

(Note: This `SELECT` is not constrained with an `ORDER BY` construct, so no particular order is 
guaranteed. You may obtain a different collection of 10 rows because of this non-determinism.)

Now suppose we want to write a query that returns new records of the form `title, year, language`
that is we want to join together information from the movies table and the languages table. We will 
construct these new records from records where `movies.id = languages.movie_id`. To accomplish this we use the `join` construct:

```sql
SELECT title, year, language
FROM movies
JOIN languages ON movies.id = languages.movie_id
ORDER BY year, title
LIMIT 20 ;
```

This query produces the output:

```
TITLE                          YEAR  LANGUAGE
-----------------------------  ----  ---------
Kekexili (2004)                2004  Tibetan
Kekexili (2004)                2004  Mandarin
Blindsight (2006/I)            2006  Tibetan
Blindsight (2006/I)            2006  German
Blindsight (2006/I)            2006  English
Casino Royale (2006)           2006  English
Casino Royale (2006)           2006  French
Children of Men (2006)         2006  Arabic
Children of Men (2006)         2006  Georgian
Children of Men (2006)         2006  German
Children of Men (2006)         2006  Italian
Children of Men (2006)         2006  Romanian
Children of Men (2006)         2006  Russian
Children of Men (2006)         2006  Serbian
Children of Men (2006)         2006  Spanish
Children of Men (2006)         2006  English
Deliver Us from Evil (2006)    2006  English
El laberinto del fauno (2006)  2006  Spanish
The Departed (2006)            2006  English
The Departed (2006)            2006  Cantonese
```

You will see many older textbooks writing such a query as:

```sql
SELECT title, year, language
FROM movies, languages
WHERE movies.id = languages.movie_id
ORDER BY year, title
LIMIT 20 ;
```

This query produces the same output. However, here the `JOIN` is implicit in the way we have written 
the `SELECT ... FROM ... WHERE ...` expression. It is generally better practice to make joins 
explicit since it often makes queries easier to understand --- the join logic is disentangled from 
the filter logic of the `WHERE` clause. Another reason is that (as we see below) there are several 
variations of the join construct each having subtely different semantics and so when joins are 
explicit we can experiment with these variants.

Now that we see that some movies are multi-lingual, let's rank movies by the number of languages 
associated with each movie. We can combine the `JOIN` and `GROUP BY` constructions:

```sql
SELECT title, year, count(*) AS language_count
FROM movies
JOIN languages ON movies.id = languages.movie_id
GROUP BY title, year
ORDER BY language_count desc
LIMIT 20 ;
```

This query produces the output:

```
TITLE                                        YEAR  LANGUAGE_COUNT
-------------------------------------------  ----  --------------
Children of Men (2006)                       2006               9
District 9 (2009)                            2009               6
The Bourne Ultimatum (2007)                  2007               5
Iron Man (2008)                              2008               5
Snowpiercer (2013)                           2013               5
Mission: Impossible - Ghost Protocol (2011)  2011               5
Drag Me to Hell (2009)                       2009               4
Persepolis (2007)                            2007               4
The Artist (2011/I)                          2011               3
Un prophète (2009)                           2009               3
Bikur Ha-Tizmoret (2007)                     2007               3
Blindsight (2006/I)                          2006               3
The Queen (2006)                             2006               3
Afghan Star (2009)                           2009               3
Slumdog Millionaire (2008)                   2008               3
Before Midnight (2013)                       2013               3
No Country for Old Men (2007)                2007               2
The Avengers (2012)                          2012               2
Kekexili (2004)                              2004               2
The Departed (2006)                          2006               2
```

## More on JOIN

The `credits` table is special in our database. It represents a many-to-many relationship between 
`movies` and `people`. Each record contains a `movie_id` and a `person_id` attribute. Thus each 
record represents a relationship between the person with that `person_id` and the movie with that 
`movie_id`. The additional attributes of the credits table tell us something about that 
relationship. Perhaps the most interesting attribute is type which tells us what kind of 
relationship is being recorded. Let's look at the different types:

```sql
SELECT type, count(*) AS total
FROM credits
GROUP BY type
ORDER BY total DESC;
```

This query produces the output:

```
TYPE                 TOTAL
-------------------  -----
actor                 6913
producer               905
writer                 212
editor                 134
director               113
cinematographer        108
composer               101
production_designer     83
costume_designer        72
```

In other words, the `credits` table represents nine distinct types of relationships between `movies` 
and `people`.

Let's construct our first three-way join! We will construct a table with attributes `movie_id`, 
`title`, `person_id`, `name`, `type`, `character` for the movie with title `Gui tu lie che (2009)`:

```sql
SELECT movie_id, title, person_id, name, type, character
FROM movies
JOIN credits ON movies.id = movie_id
JOIN people  ON people.id = person_id
WHERE title = 'Gui tu lie che (2009)'
ORDER BY type ;
```

This query produces the output:

```
MOVIE_ID  TITLE                  PERSON_ID  NAME                TYPE             CHARACTER
--------  ---------------------  ---------  ------------------  ---------------  ---------
 2949599  Gui tu lie che (2009)    2081387  Tang, Tingsui       actor            Himself
 2949599  Gui tu lie che (2009)    2351887  Zhan, Changhua      actor            Himself
 2949599  Gui tu lie che (2009)    2352605  Zhang, Yang (VII)   actor            Himself
 2949599  Gui tu lie che (2009)    2567414  Chen, Suqin         actor            Herself
 2949599  Gui tu lie che (2009)    3655929  Zhang, Qin (I)      actor            Herself
 2949599  Gui tu lie che (2009)     636899  Fan, Lixin (II)     cinematographer  [null]
 2949599  Gui tu lie che (2009)    3665606  Alary, Olivier      composer         [null]
 2949599  Gui tu lie che (2009)     636899  Fan, Lixin (II)     director         [null]
 2949599  Gui tu lie che (2009)     359849  Chang, Yung (I)     editor           [null]
 2949599  Gui tu lie che (2009)     636899  Fan, Lixin (II)     editor           [null]
 2949599  Gui tu lie che (2009)    3479099  Stephen, Mary       editor           [null]
 2949599  Gui tu lie che (2009)    4195273  Zhao, Qi (VI)       producer         [null]
 2949599  Gui tu lie che (2009)    3670895  Aung-Thwin, Mila    producer         [null]
 2949599  Gui tu lie che (2009)    3698467  Cross, Daniel (II)  producer         [null]
 2949599  Gui tu lie che (2009)    1456830  Moore, Bob (IV)     producer         [null]
```

Note that the query qualifies `id` as `movies.id` and `people.id`. This is required since both tables share a column with the name `id` and SQL needs to know which one we are referring to!

When we talk about document-oriented databases we will see that movie documents are very similar to 
the table above, only we will use a different representation `(JSON)` to avoid duplication. For 
example, this movie might be represented as:

```
{"id": 2949599,
"title": "Gui tu lie che (2009)",
"actors": [
  { "character": "Himself", "person_id": 2081387, "name": "Tang, Tingsui"     },
  { "character": "Himself", "person_id": 2351887, "name": "Zhan, Changhua"    },
  { "character": "Himself", "person_id": 2352605, "name": "Zhang, Yang (VII)" },
  { "character": "Himself", "person_id": 2567414, "name": "Chen, Suqin"       },
  { "character": "Himself", "person_id": 3655929, "name": "Zhang, Qin (I)"    }
],
"directors": [
  { "person_id": 636899, "name": "Fan, Lixin (II)" }
],
"producers": [
  { "person_id": 3670895, "name": "Aung-Thwin, Mila"   },
  { "person_id": 3698467, "name": "Cross, Daniel (II)" },
  { "person_id": 1456830, "name": "Moore, Bob (IV)"    },
  { "person_id": 4195273, "name": "Zhao, Qi (VI)"      }
],
"editors": [
  { "person_id": 359849, "name": "Chang, Yung (I)" },
  { "person_id": 636899, "name": "Fan, Lixin (II)" },
  { "person_id": 3479099, "name": "Stephen, Mary"  }
],
"composers": [
  { "person_id": 3665606, "name": "Alary, Olivier" }
],
"cinematographers": [
  { "person_id": 636899, "name": "Fan, Lixin (II)" }
]}
```

In a similar way, we will see that a person document is very closely related to the results of a 
very similar query. For example, we could construct a person document for Ben Affleck from the 
results of this query:

```sql
SELECT person_id, name, movie_id, title, type, character
FROM movies
JOIN credits ON credits.movie_id = movies.id
JOIN people  ON people.id = credits.person_id
WHERE name = 'Affleck, Ben'
ORDER BY type ;
```

which produces the output:

```
PERSON_ID  NAME          MOVIE_ID  TITLE            TYPE      CHARACTER
---------  ------------  --------  ---------------  --------  -----------
    16507  Affleck, Ben   2626541  Argo (2012)      actor     Tony Mendez
    16507  Affleck, Ben   3623758  The Town (2010)  actor     Doug MacRay
    16507  Affleck, Ben   2626541  Argo (2012)      director  [null]
    16507  Affleck, Ben   3623758  The Town (2010)  director  [null]
    16507  Affleck, Ben   2626541  Argo (2012)      producer  [null]
    16507  Affleck, Ben   3623758  The Town (2010)  writer    [null]
```

Finally, a SQL query walks into a bar and sees two tables. She walks up to them and asks "Can I join 
you?"

## Self JOINs

Suppose we want to write a query that produces triples of the form `genre1, genre2, total` that 
count the number of movies associated with a pair of distinct genres. Since we need to join the 
genres table with itself some means of differentiating the two instances of this table is required. 
The keyword `AS` comes to our rescue:

```sql
SELECT G1.genre AS genre1, G2.genre AS genre2, count(*) AS total
FROM genres AS G1
JOIN genres AS G2 ON G1.movie_id = G2.movie_id
WHERE G1.genre <> G2.genre
GROUP BY genre1, genre2
ORDER BY total desc
LIMIT 10;
```

This produces the output:

```
GENRE1     GENRE2     TOTAL
---------  ---------  -----
Biography  Drama         13
Drama      Biography     13
Romance    Drama         12
Drama      Romance       12
Drama      Thriller      10
History    Drama         10
Thriller   Drama         10
Drama      History       10
Crime      Drama          9
Drama      Crime          9
```

Notice that there are two instances of every pair of genres. We can easily fix this by replacing 
`<>` with `<` and thus ensure that the first genre is lexicographically less than the second:

```sql
SELECT G1.genre AS genre1, G2.genre AS genre2, count(*) AS total
FROM genres AS G1
JOIN genres AS G2 ON G1.movie_id = G2.movie_id
WHERE G1.genre < G2.genre
GROUP BY genre1, genre2
ORDER BY total desc
LIMIT 10;
```

This produces the output:

```
GENRE1     GENRE2     TOTAL
---------  ---------  -----
Biography  Drama         13
Drama      Romance       12
Drama      History       10
Drama      Thriller      10
Crime      Drama          9
Action     Adventure      9
Adventure  Family         8
Comedy     Drama          8
Animation  Family         8
Action     Sci-Fi         8
```

## Nested Queries

Movies can be associated with multiple languages. Suppose that we want to list the titles of movies 
that are not associated with the English language. One way to do this is to use a nested query (also 
called a sub-query) and the `IN` construct:

```sql
SELECT title
FROM movies
WHERE id NOT IN (
   SELECT movie_id
   FROM languages
   WHERE language = 'English' );
```

This produces the output:

```
4 luni, 3 saptamâni si 2 zile (2007)
Aruitemo aruitemo (2008)
El laberinto del fauno (2006)
Gui tu lie che (2009)
Jiro Dreams of Sushi (2011)
Jodaeiye Nader az Simin (2011)
Kekexili (2004)
Le Havre (2011)
Leviafan (2014)
Låt den rätte komma in (2008)
Shaun the Sheep Movie (2015)
Shi (2010)
Un prophète (2009)
```

The expression `id NOT IN (...)` is the same as `NOT (id IN (...))` and will be true only when the 
value associated with id is not in the result of evaluating the (...) sub-query.

## About NULL values
From above we can see that Ben Affleck's person_id is `16507`. Let's look at all rows of credits 
with this `person_id`:

```sql
SELECT * FROM credits WHERE person_id = 16507;
```

which produces the output:

```
PERSON_ID  MOVIE_ID  TYPE      NOTE          CHARACTER    POSITION  LINE_ORDER
---------  --------  --------  ------------  -----------  --------  ----------
    16507   2626541  actor     [null]        Tony Mendez         1
    16507   2626541  director  [null]        [null]
    16507   2626541  producer  (producer)    [null]
    16507   3623758  actor     [null]        Doug MacRay         1
    16507   3623758  director  [null]        [null]
    16507   3623758  writer    (screenplay)  [null]                          1
```

We can see that for some rows there are no values displayed for some columns. However, there 
actually is a value associated with these blank spots, and that is the `NULL` value (a user 
interface may or may not display this value).

Let's try to select just those rows position is `NULL` as follows:

```sql
SELECT * FROM credits WHERE person_id = 16507 AND position = NULL;
```

This query will return no rows at all! Why? Because with the `NULL` we enter the world of 3-valued 
logic. For two expressions e1 and e2 the expression e1 = e2 can evaluate to `TRUE` or `FALSE` or 
`NULL` (which can be read as we don't know the answer). Equality returns `NULL` when either e1 or 
e2 evaluates to `NULL`. (NULL is the Beyonce of database – nothing can be compared to it.) For 
example, `position = NULL` always returns `NULL`. In addition, `TRUE AND NULL` returns `NULL` as 
well. Furthermore, the `SELECT ... WHERE ...` construct only returns results for cases when the 
where-clause evaluates to `TRUE`.

SQL has a special construct to check for `NULL` values:

```sql
SELECT * FROM credits WHERE person_id = 16507 AND position IS NULL;
```

which does produce the expected output:

```
PERSON_ID  MOVIE_ID  TYPE      NOTE          CHARACTER  POSITION
---------  --------  --------  ------------  ---------  --------
    16507   2626541  director  [null]        [null]
    16507   2626541  producer  (producer)    [null]
    16507   3623758  director  [null]        [null]
    16507   3623758  writer    (screenplay)  [null]                
```

## Outer JOINs
One of the queries above tells us that there are 72 entries in the credits table for costume 
designers. Therefore we can confidently predict that the following query will return 72 rows (try 
it yourself!):

```sql
SELECT title, person_id
FROM movies
JOIN credits ON movie_id = id AND type = 'costume_designer';
```

Since we have 100 movies in our (small) database we may want to rewrite this query to obtain all 
movie titles and place a `NULL` value in those rows where these is no matching entry in the credits 
table. We can do this simply by using the `LEFT JOIN` construct:

```sql
SELECT title, person_id
FROM movies
LEFT JOIN credits ON movie_id = id AND type = 'costume_designer';
```

This query will return 102 rows (because some movies have more than one costume designer) with a 
`NULL` value in the `person_id` column of 30 rows (again, try it yourself!).

We might expect that the following query will produce the same result:

```sql
SELECT title, person_id
FROM movies
LEFT JOIN credits ON movie_id = id
WHERE type = 'costume_designer';
```

Sadly, this is not the case! This query will produce only 72 rows --- it is semantically identical 
to the first example in this section. Why is this so? The version with `WHERE` is applying the 
where-clause after the left join has been performed but before the `SELECT` has pulled out the 
relevant columns. At that point the type columns of non-matching rows contain a `NULL` value and so 
do not match the `type = 'costume_designer'` condition. (Very audible sigh.)

What if we had written our original query with the two table names switched:

```sql
SELECT title, person_id
FROM credits
JOIN movies ON movie_id = id AND type = 'costume_designer';
```

This gives us the same 72 rows, as expected (are you testing this?). Can we add the `LEFT` modifier to `JOIN` to obtain the 102 rows? No! To do that we use the `RIGHT JOIN` construct:

```sql
SELECT title, person_id
FROM credits
RIGHT JOIN movies ON movie_id = id AND type = 'costume_designer';
```

For tables T1 and T2 the query `T1 LEFT JOIN T2` fills in the missing T2 columns with `NULL` values, while `T1 RIGHT JOIN T2` fills in the missing T1 columns with `NULL` values.

Finally, `T1 FULL OUTER JOIN T2` fills in the missing columns with `NULL` values on both sides. In 
this example, that would mean including movies that don't have a costume designer (setting 
`person_id` to `NULL`), and also people who have never been a costume designer on any movie 
(setting `movie_id` to `NULL`).

## Next Steps
Now you should know enough to attempt the practical questions, which appear on a separate page.

## Database Schema

We have provided a sample database with information about movies and actors, taken from the 
`Internet Movie Database (IMDb)`. We have structured the data in a relational schema, and this page 
describes the form and meaning of those structures.

The sample database contains 11 tables. The two main tables are movies, which lists every movie in 
the database, and people, which lists all the people involved in one or more movies. The credits 
table indicates who was involved with which movie (as actor, director, producer, etc). The remaining 
8 tables contain various additional information about movies, such as the locations where it was 
shot, and the date it was released.

There are two different versions of the sample database: a large version and a small version. The 
table structure of those databases is the same; the biggest difference is that the small database 
contains only 100 movies, whereas the large one contains almost a million movies. As the large 
database covers a much broader variety of movies, it also contains more strange quirks and oddities!

### Table definitions
Here are the SQL schema definitions of those tables:

```
CREATE TABLE movies(
   id        integer      PRIMARY KEY,
   title     varchar(255) NOT NULL UNIQUE,
   year      integer)

CREATE TABLE people(
   id        integer      PRIMARY KEY,
   name      varchar(255) NOT NULL UNIQUE,
   gender    varchar(10))

CREATE TABLE credits(
   person_id integer      NOT NULL REFERENCES people (id),
   movie_id  integer      NOT NULL REFERENCES movies (id),
   type      varchar(20)  NOT NULL,
   note      varchar(255),
   character varchar(255),
   position  integer,
   line_order     integer,
   group_order    integer,
   subgroup_order integer,
   UNIQUE (person_id, movie_id, type))

CREATE TABLE certificates(
   movie_id    integer      NOT NULL REFERENCES movies (id),
   country     varchar(20)  NOT NULL,
   certificate varchar(20)  NOT NULL,
   note        varchar(255))

CREATE TABLE color_info(
   movie_id  integer      NOT NULL REFERENCES movies (id),
   value     varchar(20)  NOT NULL,
   note      varchar(255))

CREATE TABLE genres(
   movie_id  integer      NOT NULL REFERENCES movies (id),
   genre     varchar(25)  NOT NULL)

CREATE TABLE keywords(
   movie_id  integer      NOT NULL REFERENCES movies (id),
   keyword   varchar(127) NOT NULL)

CREATE TABLE languages(
   movie_id  integer      NOT NULL REFERENCES movies (id),
   language  varchar(35)  NOT NULL,
   note      varchar(255))

CREATE TABLE locations(
   movie_id  integer      NOT NULL REFERENCES movies (id),
   location  varchar(255) NOT NULL,
   note      varchar(511))

CREATE TABLE release_dates(
   movie_id     integer      NOT NULL REFERENCES movies (id),
   country      varchar(40)  NOT NULL,
   release_date varchar(10)  NOT NULL,
   note         varchar(255))

CREATE TABLE running_times(
   movie_id     integer      NOT NULL REFERENCES movies (id),
   running_time varchar(40)  NOT NULL,
   note         varchar(255))
```

### Table descriptions

Here is some more detail on how the data in each table should be interpreted, with links to the IMDb 
policies on how data should be structured.

#### movies

ID, title, and year of first public screening of each movie.

#### people

ID, name, and gender of each person. If there are several people with the same name in the database, 
the name is followed by a roman numeral in parentheses to resolve the ambiguity (the number is 
arbitrarily assigned). Names in languages that use non-latin characters are romanised into the latin 
alphabet. The gender is only set for actors and actresses, which are separated into two separate 
lists in IMDb; for other people (e.g. directors, producers) the gender is null. For transgender or 
non-binary gender people, either "male" or "female" has been chosen by whoever entered the data into 
IMDb.

#### credits

Indicates which people were involved with which movie (for example as actor, director, or producer). 
The type column indicates the type of involvement:

- actor:
    The person was a member of the cast of this movie. The character column gives the name of the 
    character they played, and the position column indicates the order in which the actors appear in 
    the credits. For example, the actor who is listed first in the credits has a position of 1, the 
    actor who is listed second has 2, and so on. Uncredited actors have a null position.

- cinematographer:
    The person was a cinematographer or director of photography on this movie.

- composer:	
    The person composed the main background score of this movie.

- costume_designer:
    The person is credited as costume designer on this movie.

- director:	
    The person directed this movie.
- editor:	
    The person is credited as picture editor of this movie.
- producer:	
    The person is credited as producer, executive producer, line producer or similar of this movie.
- production_designer:
 	The person is credited as production designer on this movie.
- writer:	
    The person was screenplay or story writer of this movie. Writers have numbers in the line_order, 
    group_order and subgroup_order columns, indicating the collaborations and level of contribution 
    according to quite specific and complex rules.

#### certificates

Any certificates (such as age rating) that were assigned to a movie. The certificate codes vary by 
country, and they are documented on the IMDb website.

#### color_info

Colour information about a movie — in particular, whether it is in colour or in black and white.

#### genres

The genres that characterise this movie.

#### keywords

The keywords that describe any notable object, concept, style or action that takes place during this 
movie.

#### languages

The languages spoken in this movie. A note may state in which context the language is used.

#### locations

The places in which this movie was filmed. A note may state which parts of the movie are shot in 
this location.

#### release_dates

The release dates by country for this movie. There may be multiple dates for the same country due to 
a premiere or film festival being listed separately from the main release date, or differences 
between regions. The date is given in the form "YYYY-MM-DD", unless the exact date is unknown, in 
which case it is in the form "YYYY-MM" or "YYYY".

#### running_times

The running time of this movie. Usually there is only one running time per movie, but there may be 
several entries if there are different versions of the movie that have different running times. The 
time is given as either just the number of minutes, or the number of minutes prefixed with a 
country, such as "Brazil:58" if different countries have different versions of the movie.
