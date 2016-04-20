## Datasets
Here you will find the nutrition dataset in different database formats 

- `nutrition-sql.zip` This is a zip with sql scripts to both create the nutrition table(s) and insert the data (should work universally on most platforms). If you want to setup a Postgres, MySQL, or other database, these should work pretty universally. 

- `nutrition.db` This is a SQLite3 database that you can use for local development and testing. 

- `nutrition-mssql.bacpac` This is a Microsoft SQL Server BACPAC file of the dataset. You can use SSMS to "Import Data-Tier Application" and import the .bacpac file to create a new database. You can also name the database whatever you want.

## What am I supposed to do with these?

- Use the SQLite database during local and early development of your application since it is the easiest to get started with
  - this approach allows you to develop your SQL queries quickly and easily
  - its generally faster debugging, and requires NO internet connection
  - A good tool to use with a SQLite database is: [http://sqlitebrowser.org/](http://sqlitebrowser.org/), you can use it to browse the data in the tables, write SQL queries, and generally get an understanding of how the database works
- As you get a database server setup, you can move to using your SQL queries against that database

## How do I setup a Database Server?
- You first need to decide what "Flavor" of database you want to setup. 
    - MySQL, Postgres, Microsoft SQL Server, Oracle, MongoDB, and others are all options. Some are easier to get setup than others. Also, some will not be available inside the Azure Data Center that your application is hosted in. 

###MS SQL Server Setup Instructions: 
1. Follow [these instructions](https://azure.microsoft.com/en-us/documentation/articles/sql-database-get-started/) to create an Azure-hosted SQL Server Database
    - If you screw it up, just delete it and start again
    - A good pricing/size for your Database is `S0` or `S1` - don't go higher than that bc you only have $100/month to play with
    - Pay attention to the firewall part if you want to connect to this Database from home or school
2. Now you need to connect to this database to create the tables and insert the data. To do that, you'll want a decent GUI tool.
    - Find a good desktop GUI for working SQL Server like: 
        - [http://www.heidisql.com/](http://www.heidisql.com/)
        - [SQL Management Studio](http://www.hanselman.com/blog/DownloadSqlServerExpress.aspx) (SQL Server 2014 Management Studio Download)
3. Use the SQL Scripts from the `.zip` file above
    - Copy the contents from  `create_table.sql` into your Desktop GUI, and execute the SQL statement
    - Copy the contents from  `insert_data.sql` into your Desktop GUI, and execute the SQL statement (you might have to break it up into chunks since the file is >8k lines long)