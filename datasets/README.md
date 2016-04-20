## Datasets
Here you will find the nutrition dataset in different database formats 

- `nutrition-sql.zip` This is a zip with sql scripts to both create the nutrition table(s) and insert the data (should work universally on most platforms). If you want to setup a Postgres, MySQL, or other database, these should work pretty universally. 

- `nutrition.db` This is a SQLite3 database that you can use for local development and testing. 

- `nutrition-mssql.bacpac` This is a Microsoft SQL Server BACPAC file of the dataset. You can use SSMS to "Import Data-Tier Application" and import the .bacpac file to create a new database. You can also name the database whatever you want.
