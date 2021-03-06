# QSight Live Query Extension

Similar to ODAG and Dynamic Views, this Qlik Sense extension can dynamically filter large datasets in real-time by end user's selections without loading the full dataset into memory. It is impossible or not practical to load a very large table with scheduled reloads in some situations. In these situations, this extension allows end-users to select a subset of data and only load this data into the Qlik Sense application.

![Dashboard](https://github.com/mydgd/QSight-Live-Query/blob/main/resources/Live-Query-Extension.gif?raw=true)


## Quick Start
1. [Download](https://github.com/mydgd/QSight-Live-Query/raw/main/qsight-live-query.zip) and Install the extension
2. Create a Qlik Sense application which contains dimension tables and a fact table. Best practice is to have a proper star schema.
3. Create a variable which will be used for keeping the user's selections.
4. Add your extension into your application.
5. Add dimensions in the extension settings. These dimensions should include a label/text and a key/id field from your dimension tables.
   Target Key column is optional for Integer and String type of keys, it is only needed when the dimension key and the corresponding key in the fact table has different names.
   On the other hand, this field is mandatory for date data type.   
   
    ![Dimension Properties 1](https://github.com/mydgd/QSight-Live-Query/blob/main/resources/dimension-properties-1.png?raw=true)
    ![](https://github.com/mydgd/QSight-Live-Query/blob/main/resources/white-space.png?raw=true)
    ![Dimension Properties 2](https://github.com/mydgd/QSight-Live-Query/blob/main/resources/dimension-properties-2.png?raw=true)
    
6. Select datasource type and your variable in General Settings. 
  
    ![General Settings](https://github.com/mydgd/QSight-Live-Query/blob/main/resources/general-settings.png?raw=true)
    
7. In your reload script, add "replace only" before your load statement. Thus, we will run a partial reload and only load this table without reloading dimension tables again and again.

8. Add your variable at the end of your fact table SQL as shown belown.

![Reload Script](https://github.com/mydgd/QSight-Live-Query/blob/main/resources/reload-script.png?raw=true)

9. Select filters and reload your application directly from the application.

![Selections](https://github.com/mydgd/QSight-Live-Query/blob/main/resources/selections.png?raw=true)

## Advanced Settings

### Dimension Settings
**Label (Optional):** Labels are displayed on top of each dropdown or date picker box. If you don't give a label to your dimension, it will automatically use dimension or target key names.

**Data Type for Keys:** This field specifies the type of field that will be used in where statement. Whenever possible use the type **Integer** since it will be faster to select from a database with an Integer key. Integer and String uses a dropdown for selection whereas date uses a date picker.

**Value List (Keys):** This is the dimension that includes key or IDs for the values that you want to display in dropdown box. End user doesn't see these values, it is only used for creating where statement.

**Value List (Labels):** This is the dimension that corresponds to the key that you selected in previous step. End users will see these labels in dropdown list. If you don't have label for your dimension then you can use the same key field as label.

**Target Key Column to Filter:** This is the column that extension uses to filter fact table. This field is optional for String and Integer types but mandatory for dates. If you don't provide a field name in this setting, extension will automatically use the dimension name used in Value List (Keys). If your field name includes spaces you should either use double quote or square brackets such as "Product ID" or [Product ID].

**Selection Type:** This setting allows single or multiple selections for Integer and String type fields.

**Comparison Operator:** You can select different comparison operators according to your requirements. Options in this field will change according to _Data Type for Keys_ and _Selection Type_ settings.

**Mandatory Selection:** If you are working with big data it may be useful to provide some mandatory fields and restrict the result set that is loaded into Qlik Sense application. Extension will not start reloading unless user makes a selection for mandatory fields.

### General Settings
**Data Source Type:** Currently, this extension supports reloading from QVD files and databases. These datasource types has different syntax for where statements to filter the data. Don't forget to specify correct datasource type here otherwise extension may not work especially in multiple selections.

**Save Application After Refresh:** This setting is crucial for applications that is used by multiple people. 
* __Do not Save (Recommended Setting):__ If you use this setting, after the reload only the user that reloads the application will see the reloaded resulset. If multiple users reloads same application at the same time each will see the resulset for their own selections. Data will be purged when the user refreshes the browser or closes the application

* __Save:__ When you select this setting, extension will save the application and data after each reload. That means, if multiple users are using same application at the same time, their reloads will overwrite each others reloads and only last reloaded data will be visible to all users. On the other hand, data will not be purged upon refreshing the page or closing the application.

**Select a variable for where statement (Mandatory):** This setting will list the variables that is created from the UI of Qlik Sense. Selected variable will be used to store the where statement that is built by the extension from the selections of the user. You should use this variable in your reload script as where statement of your fact table.

**Show Information:** This option will show an information box in the extension that shows where statement, selected variable and some query statistics. This is useful when you are configuring the extension. You can turn it of when your application is ready for end users.

![Information Box](https://github.com/mydgd/QSight-Live-Query/blob/main/resources/information-box.png?raw=true)

## Troubleshooting

* Use **show information** setting in order to understand the query that is built. You can use this same where statement in your database to understand if the query runs correctly or not.
* Check script logs (usually under _C:\ProgramData\Qlik\Sense\Log\Script_ but may differ according to your installation) in order to see if the query sent to datasource is correct. You can copy this query and directly run in the database.
* Make sure you selected correct datasource type, either QVD or Database. Extension will not warn you for wrong selection.
* Date type is just date type, it doesn't include time part. If you have a datetime field you may consider casting this to a date field.
