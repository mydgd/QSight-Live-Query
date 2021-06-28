# QSight Live Query Extension

This Qlik Sense extension can dynamically filter large datasets in real time according to end users' selections for filters.
In some situations it is impossible or not practicle to load a very large table with scheduled reloads. 
In these situations, extension allows end users to select a subset of data and only load this data into Qlik Sense application.

## Quick Start
1. Download and Install the extension
2. Create a Qlik Sense application which contains dimension tables and a fact table. Best practice is to have a star schema.
3. Create a variable which we will use for keeping filters in where statement format.
4. Add your extension into your application.
5. Add dimensions in the extension. These dimensions should include a label/text and a key/id field from your dimension tables.
6. Select datasource type in General Settings.
7. Select your variable in General Settings.
8. In your reload script, add "replace only" before your load statement. Thus, we will run a partial reload and only load this table without reloading dimension tables again and again.
9. Add your variable at the end of your fact table SQL.
10. Select filters and reload your application directly from the application.