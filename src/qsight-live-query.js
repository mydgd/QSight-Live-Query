define(["qlik", './semantic', './transition', './fontawesome', "css!./qsight-live-query.css", "css!./semantic.css"],
    function (qlik, template) {

        "use strict";
        return {
            template: template,
            initialProperties: {
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [{
                        qWidth: 2,
                        qHeight: 500
                    }]
                }
            },
            definition: {
                type: "items",
                component: "accordion",
                items: {
                    settings: {
                        uses: "settings",
                        items: {
                            MyList: {
                                type: "array",
                                ref: "listItems",
                                label: "Dimensions",
                                itemTitleRef: function (data) {
                                    if (data.field_header != '') {
                                        return data.field_header;
                                    } else if (data.dim_label != '') {
                                        var label = data.dim_label;
                                        label = label.replace("=", "");
                                        return label;
                                    }
                                    else if (data.fact_id != '') {
                                        var label = data.fact_id;
                                        label = label.replace("=", "");
                                        return label;
                                    }
                                },
                                allowAdd: true,
                                allowRemove: true,
                                addTranslation: "Add Dimension",
                                items: {
                                    labelHeader: {
                                        type: "string",
                                        ref: "field_header",
                                        label: "Label"
                                    },
                                    fieldTypeSwitch: {
                                        type: "string",
                                        component: "dropdown",
                                        label: "Data Type for Keys",
                                        ref: "field_type",
                                        options: [{
                                            value: "s",
                                            label: "String"
                                        }, {
                                            value: "i",
                                            label: "Integer"
                                        }, {
                                            value: "dp",
                                            label: "Date"
                                        }],
                                        defaultValue: "s"
                                    },
                                    label2: {
                                        type: "string",
                                        ref: "dim_id",
                                        expressionType: 'dimension',
                                        expression: 'always',
                                        label: "Value List (Keys)",
                                        show: function (data) {
                                            if (data.field_type != 'dp') {
                                                return true;
                                            }
                                            return false;
                                        }
                                    },
                                    label1: {
                                        type: "string",
                                        ref: "dim_label",
                                        expressionType: 'dimension',
                                        expression: 'always',
                                        label: "Value List (Labels)",
                                        show: function (data) {
                                            if (data.field_type != 'dp') {
                                                return true;
                                            }
                                            return false;
                                        }

                                    },
                                    label3: {
                                        type: "string",
                                        ref: "fact_id",
                                        label: "Target Key Column to Filter (Mandatory only for date)"
                                    },
                                    radio2: {
                                        type: "string",
                                        component: "radiobuttons",
                                        label: "Selection Type",
                                        ref: "field_selection_type",
                                        options: [{
                                            value: "m",
                                            label: "Multiple"
                                        }, {
                                            value: "s",
                                            label: "Single"
                                        }],
                                        defaultValue: "m",
                                        show: function (data) {
                                            if (data.field_type != 'dp') {
                                                return true;
                                            }
                                            return false;
                                        }
                                    },

                                    //Only active when Selection Type is Single
                                    compOperatorDropdown: {
                                        type: "string",
                                        component: "dropdown",
                                        label: "Comparison Operator",
                                        ref: "field_comparison_operator",
                                        options: function (data) {
                                            if (data.field_type == 'dp' || data.field_selection_type == 's') {
                                                return [{
                                                    value: "=",
                                                    label: "Equal to (= or IN)"
                                                }, {
                                                    value: ">",
                                                    label: "Greater than (>)"
                                                },
                                                {
                                                    value: "<",
                                                    label: "Less than (<)"
                                                },
                                                {
                                                    value: ">=",
                                                    label: "Greater than or equal to (>=)"
                                                },
                                                {
                                                    value: "<=",
                                                    label: "Less than or equal to (<=)"
                                                },
                                                {
                                                    value: "<>",
                                                    label: "Not equal to (<>)"
                                                }]
                                            }
                                            else {
                                                return [{
                                                    value: "=",
                                                    label: "Equal to (= or IN)"
                                                }]
                                            }
                                        }
                                        ,
                                        defaultValue: "="
                                    },

                                    radio3: {
                                        type: "string",
                                        component: "radiobuttons",
                                        label: "Mandatory Selection",
                                        ref: "field_mandatory_optional",
                                        options: [{
                                            value: "m",
                                            label: "Mandatory"
                                        }, {
                                            value: "o",
                                            label: "Optional"
                                        }],
                                        defaultValue: "o"
                                    }

                                }
                            },
                            // Definition of the custom section header
                            generalSettings: {
                                type: "items",
                                label: "General Settings",
                                items: {

                                    radioDataSource: {
                                        type: "string",
                                        component: "radiobuttons",
                                        label: "Datasource Type",
                                        ref: "fieldDatasourceType",
                                        options: [{
                                            value: "d",
                                            label: "Database"
                                        }, {
                                            value: "q",
                                            label: "QVD"
                                        }],
                                        defaultValue: "d"
                                    },

                                    radioSaveData: {
                                        type: "boolean",
                                        component: "radiobuttons",
                                        label: "Save Application After Refresh",
                                        ref: "radioSaveData",
                                        options: [{
                                            value: true,
                                            label: "Save"
                                        }, {
                                            value: false,
                                            label: "Do not save"
                                        }],
                                        defaultValue: false
                                    },
                                    textSaveData: {
                                        label: "Recommended setting is 'Do not save'. If you set this property to 'Save', previous data refresh of other users will be overwritten. Don't use 'Save' unless required.",
                                        component: "text"
                                    },


                                    variableName: {
                                        ref: "variableName",
                                        label: "Select a variable for where statement",
                                        type: "string",
                                        component: "dropdown",
                                        options: function () {
                                            return qlik.currApp().createGenericObject({
                                                qVariableListDef: {
                                                    qType: "variable"
                                                }
                                            }).then(function (e) {
                                                return e.layout.qVariableList.qItems.map(function (e) {
                                                    return {
                                                        value: e.qName,
                                                        label: e.qName.length > 50 ? e.qName.slice(0, 50) + "..." : e.qName
                                                    }
                                                })
                                            })
                                        },
                                        change: function (e) {
                                            e.variableValue = e.variableValue || {}, e.variableValue.qStringExpression = '="' + e.variableName + '"'
                                        }
                                    },
                                    radioInfo: {
                                        type: "boolean",
                                        component: "switch",
                                        label: "Show information",
                                        ref: "radioInfo",
                                        options: [{
                                            value: true,
                                            label: "Show"
                                        }, {
                                            value: false,
                                            label: "Hide"
                                        }],
                                        defaultValue: false
                                    },
                                }
                            },
                            about: {
                                type: "items",
                                label: "About",
                                items: {
                                    aboutText1: {
                                        label: "QSight Live Query Extension by Mustafa Aydogdu.",
                                        component: "text"
                                    },

                                    aboutText2: {
                                        label: "Please check Github for latest version and documentation.",
                                        component: "text"
                                    },
                                    aboutLink: {
                                        label: "Github",
                                        component: "link",
                                        url: "https://github.com/mydgd"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            support: {
                snapshot: true,
                export: true,
                exportData: true
            },
            paint: function ($element, layout) {

                //string for tracking if the settings has changed. If changed repaint.
                this.layoutString = this.prevLayout = JSON.stringify(layout.listItems) + layout.variableName + layout.radioSaveData + layout.radioInfo + layout.fieldDatasourceType + layout.field_type;

                //Repaint if the settings of extension has changed
                if (this.prevLayoutString != this.layoutString) {
                    this.painted = false;
                }

                if (this.painted) return;

                this.painted = true;

                this.prevLayoutString = this.layoutString;

                $element.empty();

                var app = qlik.currApp(this);
                var app_id = app.id;
                var whereStatement = '';
                var qvdWhereStatement = '';
                var html = '';

                var $container = '<div id="container" style="overflow-y: auto;height: 100%; "</div>';

                $element.append($container);

                //Append reload button error/warning messages
                $("#container").append('<button id="refreshButton" class= "myButton myButton__text"><i class="fas fa-redo-alt"></i> Reload</button>');
                $("#container").append('<button id="clearButton" class= "myButton-blue myButton__text"><i class="fas fa-trash-alt"></i> Clear</button>');
                $("#container").append('<div id="errorDiv" class="message-error"> </div>');
                $("#container").append('<div id="warningDiv" class="message-warning"> </div>');
                $("#container").append('<div id="infoDiv" class="message-info"> </div>');
                $("#container").append('<form id="form" "></form>');

                $('#errorDiv').hide();
                $('#warningDiv').hide();
                $('#infoDiv').hide();

                layout.listItems.forEach(function (item, index, array) {

                    var unique_id = item.cId;
                    var field_type = item.field_type;
                    var field_name = item.dim_label.trim();
                    var field_fact_key = item.fact_id.trim();

                    field_name = field_name.replace("=", "");

                    if (field_name != '') {
                        var field_id = field_name.replace(/[\W_]+/g, '');//remove any non alphanumeric character
                    } else {
                        var field_id = field_fact_key.replace(/[\W_]+/g, '');//remove any non alphanumeric character
                    }

                    var field_key = item.dim_id.trim();
                    field_key = field_key.replace("=", "");
                    var field_selection_type = item.field_selection_type; //Multi Single
                    var field_mandatory_optional = item.field_mandatory_optional;//mandatory optional

                    //Set header label for field
                    var field_header = item.field_header;

                    if (typeof (field_header) == 'undefined' || field_header == '') {
                        if (field_name != '') {
                            field_header = field_name.replace(/[^\w\s]+/g, '');
                        } else {
                            field_header = field_fact_key.replace(/[^\w\s]+/g, '');;
                        }
                    } //End of set header label for field

                    var div_id = '#div_' + field_id + unique_id;

                    if (field_mandatory_optional == 'm') {
                        field_header += ' *';
                    }

                    //Create div for each dimension
                    $("#form").append('<div id="div_' + field_id + unique_id + '"> </div>');
                    document.getElementById("refreshButton").addEventListener("click", runQuery);


                    if (field_type != 'dp') {

                        app.createCube({
                            "qInitialDataFetch": [{
                                "qHeight": 1000,
                                "qWidth": 2
                            }],
                            "qDimensions": [{
                                "qDef": {
                                    "qFieldDefs": [
                                        field_name
                                    ]
                                },
                                "qNullSuppression": true,
                                "qOtherTotalSpec": {
                                    "qOtherMode": "OTHER_OFF",
                                    "qSuppressOther": true,
                                    "qOtherSortMode": "OTHER_SORT_DESCENDING",
                                    "qOtherCounted": {
                                        "qv": "5"
                                    },
                                    "qOtherLimitMode": "OTHER_GE_LIMIT"
                                }
                            },
                            {
                                "qDef": {
                                    "qFieldDefs": [
                                        field_key
                                    ]
                                },
                                "qNullSuppression": true,
                                "qOtherTotalSpec": {
                                    "qOtherMode": "OTHER_OFF",
                                    "qSuppressOther": true,
                                    "qOtherSortMode": "OTHER_SORT_DESCENDING",
                                    "qOtherCounted": {
                                        "qv": "5"
                                    },
                                    "qOtherLimitMode": "OTHER_GE_LIMIT"
                                }
                            }
                            ],
                            "qMeasures": [],
                            "qSuppressZero": false,
                            "qSuppressMissing": false,
                            "qMode": "S",
                            "qInterColumnSortOrder": [],
                            "qStateName": "$"
                        }, function (reply, app) {

                            var valueList = reply.qHyperCube.qDataPages[0].qMatrix;
                            html = '<p style="margin-top:10px;"></p> <label style="font: bold 16px \'Source Sans Pro\', san-serif; ">' + field_header + '</label>';
                            if (field_selection_type == 'm') {//Multiple selection allowed
                                html += '<div id="list_' + field_id + unique_id + '" ><select style="min-width:100%;" multiple="" class="ui filters search selection dropdown multiple required">'
                            }
                            else {//only single selection 
                                html += '<div id="list_' + field_id + unique_id + '" ><select class="ui filters dropdown">'
                            }

                            if (field_mandatory_optional == 'o') {
                                html += '<option class="item" value="">Optional Selection</option>';
                            } else {
                                html += '<option class="item" value="">Mandatory Selection</option>';
                            }
                            //Set values for dropdown
                            valueList.forEach((element) => {
                                html += '<option class="item" value="' + element[1].qText + '">' + element[0].qText + '</option>';
                            })

                            html += '</select></div>'

                            $(div_id).append(html);
                            html = '';
                            app.destroySessionObject(reply.qInfo.qId);

                            $('.filters.ui.dropdown')
                                .dropdown({
                                    allowAdditions: true
                                });

                            $('#clearButton').click(function () {
                                $('.filters.ui.dropdown').dropdown('restore defaults');
                                $('#errorDiv').hide();
                                $('#warningDiv').hide();
                                $('#infoDiv').hide();
                                $('.date-picker').val('');
                            }
                            );
                        }); //End of create hypercube
                    }
                    if (field_type == 'dp') {//datepicker

                        html = '<p style="margin-top:10px;"></p> <label style="font: bold 16px \'Source Sans Pro\', san-serif; ">' + field_header + '</label>';
                        html += '<div class="ui input"><input class="date-picker" type="date" id="date_' + field_id + unique_id + '" name="birthday"></div>';
                        $(div_id).append(html);
                    }
                }); //end of list foreach


                function isInteger(value) {
                    return /^\d+$/.test(value);
                }


                function runQuery() {

                    var whereStatement = '';
                    var qvdWhereStatement = '';
                    var startTime = new Date();
                    var radioSaveData = layout.radioSaveData;
                    var variableName = layout.variableName;
                    var mandatorySelectionCheck = true;

                    $('#errorDiv').empty();
                    $('#infoDiv').empty();
                    $('#warningDiv').empty();
                    $('#warningDiv').hide();
                    $('#errorDiv').hide();
                    $('#infoDiv').hide();

                    if (variableName == '') {
                        $('#errorDiv').show();
                        $('#errorDiv').append(' <p class="message"><i class="fas fa-exclamation-triangle"></i> Please select a variable in general settings of the extension</p>');
                        return false;
                    }

                    
                    //Loop dimensions and create where statement for selected dimensions
                    layout.listItems.forEach(function (item, index, array) {
                        var unique_id = item.cId;
                        var field_type = item.field_type;
                        var field_name = item.dim_label.trim();
                        field_name = field_name.replace("=", "");
                        var field_id = field_name.replace(/[\W_]+/g, '');//remove any non alphanumeric character
                        var field_key = item.dim_id.trim();
                        field_key = field_key.replace("=", "");
                        //var field_data_type = item.field_data_type;//integer string
                        var field_selection_type = item.field_selection_type; //Multi Single
                        var field_mandatory_optional = item.field_mandatory_optional;//mandatory optional

                        var field_fact_key = item.fact_id.trim();
                        var field_comparison_operator = item.field_comparison_operator;

                        //Set header label for field
                        var field_header = item.field_header;

                        if (typeof (field_header) == 'undefined' || field_header == '') {
                            if (field_name != '') {
                                field_header = field_name.replace(/[^\w\s]+/g, '');
                            } else {
                                field_header = field_fact_key.replace(/[^\w\s]+/g, '');;
                            }
                        } //End of set header label for field

                        if (field_type == 'dp') {

                            if (field_fact_key == '' || typeof (field_fact_key) == 'undefined') {
                                $('#errorDiv').append(' <p class="message"><i class="fas fa-exclamation-triangle"></i> Please define a target field in settings</p>');
                                return false;
                            }

                            field_name = field_fact_key;
                            field_name = field_name.replace("[", "");
                            field_name = field_name.replace("]", "");
                            field_name = field_name.replace("\"", "");
                            var field_id = field_name.replace(/[\W_]+/g, '');;
                            //field_data_type = 's';
                            field_selection_type = 's';

                            var dateHtmlId = '#date_' + field_id + unique_id;
                            var dateSelection = $(dateHtmlId).val()

                            if (dateSelection != '') {//Check if date selected
                                var elementSelected = [];
                                elementSelected = dateHtmlId;
                                var selectedCount = 1;
                            } else if (field_mandatory_optional == 'm') {//if date is not selected but it is mandatory
                                $('#errorDiv').show();
                                $('#errorDiv').append(' <p class="message"><i class="fas fa-exclamation-triangle"></i> Please make a selection for <b>' + field_header + ' </b></p>');
                                mandatorySelectionCheck = false;
                            }
                        }
                        else {
                            field_name = field_name.replace("[", "");
                            field_name = field_name.replace("]", "");
                            var field_id = field_name.replace(/\s/g, '');
                            var elementSelected = '#list_' + field_id + unique_id + ' :selected';

                            var field_mandatory_optional = item.field_mandatory_optional;

                            var field_header = item.field_header;
                            var selectedCount = $(elementSelected).length;

                        }

                        if (field_header == '') {
                            field_header = field_name;
                        }

                        if (field_fact_key == '') {//if blank use source field key
                            field_fact_key = item.dim_id.substring(1);
                        }

                        if (field_mandatory_optional == 'm') {
                            if (selectedCount == 0 || (selectedCount == 1 && $(elementSelected).val() == ''))//if no value is selected
                            {
                                mandatorySelectionCheck = false;
                                $('#errorDiv').show();
                                $('#errorDiv').append(' <p class="message"><i class="fas fa-exclamation-triangle"></i> Please make a selection for <b>' + field_header + ' </b></p>');
                            }
                        }

                        if (selectedCount > 0) { //if there are selections for current dimension

                            if (whereStatement.length > 0) {
                                whereStatement += ' AND ';
                                qvdWhereStatement += ' AND ';
                            } else {
                                whereStatement += 'WHERE ';
                                qvdWhereStatement += 'WHERE ';
                            }

                            whereStatement += field_fact_key;

                            if (selectedCount == 1 && $(elementSelected).val() != '') { //if there is only one selection

                                qvdWhereStatement += field_fact_key;

                                $(elementSelected).each(function () {

                                    //Check if field is string but declared integer in the settings
                                    if (isInteger(this.value) == false && field_type == 'i') {
                                        $('#warningDiv').show();
                                        $('#warningDiv').append(' <p class="message"><i class="fas fa-exclamation-triangle"></i><b>' + field_header + ' </b>includes non-integer values. Please consider changing data type to string in the extension settings.</p>');
                                    }

                                    var filterItem = '';
                                    if (field_type != 'i') {//String or date
                                        filterItem = '\'' + this.value + '\'';
                                    }
                                    else {
                                        filterItem = this.value;
                                    }

                                    if (field_selection_type == 's') {
                                        whereStatement += field_comparison_operator + filterItem;
                                        qvdWhereStatement += field_comparison_operator + filterItem;
                                    } else {
                                        whereStatement += '=' + filterItem;
                                        qvdWhereStatement += '=' + filterItem;
                                    }

                                });
                            } //end if single selection
                            if (selectedCount > 1) { //if multiple selection
                                qvdWhereStatement += 'MATCH(' + field_fact_key + ',';
                                whereStatement += ' IN (';
                                var nonIntegerCount = 0;

                                $(elementSelected).each(function (index) {
                                    var filterItem = '';

                                    //Check if field is string but declared integer in the settings
                                    if (isInteger(this.value) == false && field_data_type == 'i') {
                                        nonIntegerCount++;
                                    }

                                    if (field_type != 'i') {//string or date
                                        filterItem = '\'' + this.value + '\'';
                                    }
                                    else {
                                        filterItem = this.value;
                                    }

                                    if (index > 0) {
                                        whereStatement += ', ' + filterItem;
                                        qvdWhereStatement += ', ' + filterItem;
                                    } else {
                                        whereStatement += filterItem;
                                        qvdWhereStatement += filterItem;
                                    }
                                });

                                //if there non integer values in integer field then show warning
                                if (nonIntegerCount > 0) {
                                    $('#warningDiv').show();
                                    $('#warningDiv').append(' <p class="message"><i class="fas fa-exclamation-triangle"></i><b>' + field_header + ' </b>includes non-integer values. Please consider changing data type to string in the extension settings.</p>');
                                }
                                whereStatement += ') ';
                                qvdWhereStatement += ') ';
                            } //end if multiple selection	
                        } //end if there are selections for current dimension									

                    });//end of loop each dimension 

                    if (mandatorySelectionCheck) {//If there is any mandatory selection and they are selected then continue

                        document.getElementById("refreshButton").disabled = true;
                        document.getElementById("refreshButton").classList.add("myButton--loading");

                        if (layout.fieldDatasourceType == 'q') {
                            whereStatement = qvdWhereStatement;
                        }

                        if (whereStatement.length < 7) {//If there is no selection then remove 'WHERE' from the statement.
                            whereStatement = '';
                        }

                        if (layout.radioInfo) {
                            $('#infoDiv').show();
                            $('#infoDiv').append('<p class="message"><b> Filter: </b>' + whereStatement + '</p>');
                            $('#infoDiv').append('<p class="message"><b> Selected Variable: </b>' + variableName + '</p>');
                            $('#infoDiv').append('<p class="message"><b> Start Time: </b>' + startTime.toLocaleString() + '</p>');
                        }
                        app.variable.setStringValue(variableName, whereStatement).then(function () {
                            setTimeout(function () {
                                app.doReload(0, true, false).then(function (e) {
                                    //clearTimeout(timer);

                                    // setTimeout(function () {
                                    document.getElementById("refreshButton").disabled = false;
                                    document.getElementById("refreshButton").classList.remove("myButton--loading");
                                    //}
                                    //  , 300);

                                    var finishTime = new Date();
                                    var queryDuration = new Date(null);
                                    queryDuration.setSeconds((finishTime.getTime() - startTime.getTime()) / 1000);

                                    $('#infoDiv').append('<p class="message"><b> Finish Time: </b>' + finishTime.toLocaleString() + '</p>');
                                    $('#infoDiv').append('<p class="message"><b> Duration: </b>' + queryDuration.toISOString().substr(11, 8) + '</p>');


                                    if (e) {

                                        if (radioSaveData) {//Save application if property set to Save by user
                                            app.doSave();
                                        }
                                    } else {
                                        $('#errorDiv').append('<p><i class="fas fa-exclamation-triangle"></i> An error occured! Data has not been loaded.</p>');
                                    }

                                })
                            }, 1500);

                        });

                    }
                }; // end of runQuery

                //needed for export
                return qlik.Promise.resolve();
            },
        };
    });