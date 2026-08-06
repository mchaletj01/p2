/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Expense by Date"], "isController": false}, {"data": [1.0, 500, 1500, "GET User By Username Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Expenses Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET User By Id Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET Approval By Id Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Approvals Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET Expense By User Request"], "isController": false}, {"data": [1.0, 500, 1500, "Login Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET One Expense Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET Expense by Status"], "isController": false}, {"data": [1.0, 500, 1500, "GET All User Request"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 0, 0.0, 1.392727272727275, 0, 28, 1.0, 2.0, 2.0, 3.0, 79.89540964555492, 54.332992491647296, 13.583070798227775], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Expense by Date", 200, 0, 0.0, 1.360000000000001, 0, 16, 1.0, 2.0, 2.0, 7.9500000000000455, 7.8811522244552155, 2.678360326279702, 1.3699659140166294], "isController": false}, {"data": ["GET User By Username Request", 200, 0, 0.0, 1.4649999999999996, 0, 17, 1.0, 2.0, 2.0, 11.950000000000045, 7.890791446382071, 2.5583425392566874, 1.3408180778032037], "isController": false}, {"data": ["GET All Expenses Request", 200, 0, 0.0, 1.4099999999999997, 0, 17, 1.0, 2.0, 2.0, 7.960000000000036, 7.832080200501252, 12.000521322838345, 1.2390595629699248], "isController": false}, {"data": ["GET User By Id Request", 200, 0, 0.0, 1.4549999999999996, 0, 14, 1.0, 2.0, 2.0, 3.990000000000009, 7.89421748569173, 2.5594533254391156, 1.2411806789027038], "isController": false}, {"data": ["GET Approval By Id Request", 200, 0, 0.0, 1.3299999999999998, 0, 2, 1.0, 2.0, 2.0, 2.0, 7.860399308284862, 2.963002083005817, 1.2665682479169942], "isController": false}, {"data": ["GET All Approvals Request", 200, 0, 0.0, 1.325, 0, 10, 1.0, 2.0, 2.0, 2.0, 7.881462799495587, 14.616111187736443, 1.2545687854665826], "isController": false}, {"data": ["GET Expense By User Request", 200, 0, 0.0, 1.2750000000000008, 1, 2, 1.0, 2.0, 2.0, 2.0, 7.87897888433659, 6.224701091238575, 1.3003392885282068], "isController": false}, {"data": ["Login Request", 200, 0, 0.0, 1.4249999999999996, 1, 7, 1.0, 2.0, 2.0, 6.960000000000036, 7.892348368256975, 2.543432579614064, 1.8651838917169803], "isController": false}, {"data": ["GET One Expense Request", 200, 0, 0.0, 1.36, 1, 17, 1.0, 2.0, 2.0, 3.990000000000009, 7.886435331230284, 2.664752563091483, 1.2630619085173502], "isController": false}, {"data": ["GET Expense by Status", 200, 0, 0.0, 1.3599999999999994, 1, 2, 1.0, 2.0, 2.0, 2.0, 7.877116975187082, 5.907837731390311, 1.3692644742024418], "isController": false}, {"data": ["GET All User Request", 200, 0, 0.0, 1.5550000000000008, 0, 28, 1.0, 2.0, 2.0, 11.910000000000082, 7.868130138872498, 4.15766134584366, 1.221711613360085], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
