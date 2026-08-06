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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET User By Id Request"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Approval Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Approvals Request"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Expense Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET One Expense Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET All User Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET Expense by Date"], "isController": false}, {"data": [1.0, 500, 1500, "GET User By Username Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Expenses Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET Expense By User Non Pending Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET Approval by Expense Id Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET Approval By Id Request"], "isController": false}, {"data": [1.0, 500, 1500, "POST Create Expense Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET Expense By User Request"], "isController": false}, {"data": [1.0, 500, 1500, "Login Request"], "isController": false}, {"data": [1.0, 500, 1500, "POST Approval Request"], "isController": false}, {"data": [1.0, 500, 1500, "GET Expense by Status"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Expense Request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 0, 0.0, 3.5899999999999985, 1, 72, 3.0, 5.0, 7.0, 21.0, 166.45326504481434, 358.3885593389885, 30.947403169014088], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET User By Id Request", 100, 0, 0.0, 3.119999999999999, 1, 19, 2.0, 3.9000000000000057, 10.949999999999989, 18.989999999999995, 19.66181675186787, 5.760297876523791, 3.091359860401101], "isController": false}, {"data": ["DELETE Approval Request", 50, 0, 0.0, 5.300000000000001, 3, 14, 5.0, 7.899999999999999, 11.799999999999983, 14.0, 10.206164523372117, 2.511673300673607, 1.8937219330475608], "isController": false}, {"data": ["GET All Approvals Request", 100, 0, 0.0, 2.91, 1, 27, 2.0, 3.0, 4.0, 26.929999999999964, 18.765246762994934, 103.37122056201915, 2.98704611559392], "isController": false}, {"data": ["PUT Expense Request", 50, 0, 0.0, 6.619999999999999, 4, 22, 5.0, 10.899999999999999, 17.89999999999999, 22.0, 10.10713563776026, 3.000555892460077, 2.970945143521326], "isController": false}, {"data": ["GET One Expense Request", 100, 0, 0.0, 2.7000000000000006, 1, 23, 2.0, 3.0, 4.0, 22.89999999999995, 17.448961786773687, 5.427240555749433, 2.8201202887803176], "isController": false}, {"data": ["GET All User Request", 100, 0, 0.0, 3.939999999999999, 2, 72, 3.0, 4.0, 4.0, 71.7999999999999, 19.6347928529354, 12.962031219320636, 3.048761780875712], "isController": false}, {"data": ["GET Expense by Date", 50, 0, 0.0, 4.9, 1, 66, 2.0, 11.699999999999996, 17.799999999999983, 66.0, 9.863878477017163, 3.3521774511738016, 1.7146195008877492], "isController": false}, {"data": ["GET User By Username Request", 50, 0, 0.0, 2.26, 1, 4, 2.0, 3.0, 3.0, 4.0, 10.105092966855295, 3.276260610347615, 1.7170763439773644], "isController": false}, {"data": ["GET All Expenses Request", 100, 0, 0.0, 2.8800000000000003, 1, 26, 2.0, 3.0, 4.949999999999989, 25.85999999999993, 17.105713308244955, 167.20099747690728, 2.7061773007184398], "isController": false}, {"data": ["GET Expense By User Non Pending Request", 50, 0, 0.0, 2.6599999999999997, 2, 5, 3.0, 3.0, 4.449999999999996, 5.0, 10.183299389002038, 4.53475050916497, 1.7601992107942972], "isController": false}, {"data": ["GET Approval by Expense Id Request", 50, 0, 0.0, 2.8200000000000003, 2, 18, 2.0, 3.0, 4.0, 18.0, 10.158472165786264, 3.134841019910606, 1.7459874034945144], "isController": false}, {"data": ["GET Approval By Id Request", 100, 0, 0.0, 2.6100000000000008, 1, 21, 2.0, 3.0, 3.0, 20.909999999999954, 18.6706497386109, 6.399802791262136, 3.035803888162808], "isController": false}, {"data": ["POST Create Expense Request", 50, 0, 0.0, 4.640000000000001, 3, 20, 4.0, 5.0, 12.399999999999949, 20.0, 10.248001639680261, 2.962312973970076, 2.912273903463825], "isController": false}, {"data": ["GET Expense By User Request", 100, 0, 0.0, 2.7999999999999994, 1, 12, 3.0, 4.0, 4.949999999999989, 11.95999999999998, 17.03867779860283, 153.84544987433975, 2.8120474101209747], "isController": false}, {"data": ["Login Request", 100, 0, 0.0, 3.7699999999999982, 1, 61, 2.0, 3.0, 8.749999999999943, 60.74999999999987, 18.09954751131222, 5.284926470588235, 4.286269796380091], "isController": false}, {"data": ["POST Approval Request", 50, 0, 0.0, 4.919999999999999, 3, 31, 4.0, 5.899999999999999, 10.0, 31.0, 10.052271813429835, 3.151151613389626, 3.1315182700040207], "isController": false}, {"data": ["GET Expense by Status", 50, 0, 0.0, 2.6999999999999997, 1, 18, 2.0, 3.0, 8.14999999999997, 18.0, 9.821253191907287, 7.365939893930466, 1.7072100274995088], "isController": false}, {"data": ["DELETE Expense Request", 50, 0, 0.0, 7.060000000000001, 4, 28, 5.0, 17.799999999999997, 22.349999999999987, 28.0, 10.264832683227263, 2.506062666803531, 1.8945833761034694], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
