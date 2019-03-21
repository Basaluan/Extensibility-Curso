(function (CS) {
	//'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs PI Vision to also
		// look for HTML template and config template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'BarraCilindro',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'BarraCilindro',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/basaluan.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				DataShape: 'TimeSeries',
				DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				FormatType: null,
				// Specify the default height and width of this symbol
				Height: 700,
				Width: 900,
				// Allow large queries
				Intervals: 1000,
				// Specify the value of custom configuration options
				minimumYValue: 0,
				maximumYValue: 100,
				//includeElementName: false,
				showTitle: false,
				textColor: "black",
				fontSize: 12,
				backgroundColor: "transparent",
				plotAreaFillColor: "transparent",
				barColor1: "red",
				showChartScrollBar: false,
				legendPosition: "bottom",
				useColumns: false,
				decimalPlaces: 1,
				bulletSize: 8,
				customTitle: "",
				showAllValueLabels: true
				
				
			};
		},
		// Allow use in collections! !!!!!!!!!!!!!!!!!!!!!!!!!
		supportsCollections: true,
		// By including this, you're specifying that you want to allow configuration options for this symbol
		configOptions: function () {
			return [{
				// Add a title that will appear when the user right-clicks a symbol
				title: 'Editar Formato',
				// Supply a unique name for this cofiguration setting, so it can be reused, if needed
				mode: 'format'
		}];
		}
		// Specify the name of the function that will be called to initialize the symbol
		//init: myCustomSymbolInitFunction
	};
	//************************************
	// Function called to initialize the symbol
	//************************************
	//function myCustomSymbolInitFunction(scope, elem) {
	function symbolVis() {}
	CS.deriveVisualizationFromBase(symbolVis);
	symbolVis.prototype.init = function (scope, elem) {
		// Specify which function to call when a data update or configuration change occurs 
		this.onDataUpdate = myCustomDataUpdateFunction;           
		this.onConfigChange = myCustomConfigurationChangeFunction;
		//var labels = getLabels(scope.symbol.DataSources);

		// Locate the html div that will contain the symbol, using its id, which is "container" by default
		var symbolContainerDiv = elem.find('#container')[0];
		// Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
		// Write that new unique ID back to overwrite the old id
		symbolContainerDiv.id = newUniqueIDString;
		var chart = false;
		var dataArray = [];
	
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
			console.log("New data received: ", data);
			if (data !== null && data.Data) {
				dataArray = [];
				//Get the first tag name
				if (data.Data[0].Label) {
					var stringLabel1 = data.Data[0].Label;
					var posicion = stringLabel1.indexOf('|');
					stringLabel1 = stringLabel1.substr(posicion+1, stringLabel1.length);
				}
				//Take out the units of the first tag
				if (data.Data[0].Units) {
					var stringUnits1 = data.Data[0].Units;
				}
				//Take the name of the second tag
				if (data.Data[1].Label) {
					var stringLabel2 = data.Data[1].Label;
					var posicion = stringLabel2.indexOf('|');
					stringLabel2 = stringLabel2.substr(posicion+1, stringLabel2.length);
				}
				//Take the units of the second tag
				if (data.Data[1].Units) {
					var stringUnits2 = data.Data[1].Units;
				}
				//The vector is accommodated with the object
					var chartData = [ {
						"category": "Nivel",
						"value1": parseFloat( ("" + data.Data[0].Values[0].Value).replace(",", ".") ) - parseFloat( ("" + data.Data[1].Values[data.Data[1].Values.length - 1].Value).replace(",", ".") ),
						"value2": parseFloat( ("" + data.Data[1].Values[data.Data[1].Values.length - 1].Value).replace(",", ".") )
					} ];
				
					console.log("aca: "+data.Data[0].Values[0].Value+"\n"+data.Data[1].Values[data.Data[1].Values.length - 1].Value);
				// Create the custom visualization
				if (!chart) {
					// Create the chart
					chart = AmCharts.makeChart(symbolContainerDiv.id, {
						"theme": "none",
						"type": "serial",
						"depth3D": 100,
						"angle": 70,
						"startX": -500,
						"autoMargins": false,
						"marginBottom": 100,
						"startX": -500,
						"marginLeft": 350,
						"dataProvider": chartData,
						"backgroundColor": scope.config.backgroundColor,
						"outlineThickness": 2,
						"marginRight": 300,
						"valueAxes": [ {
							"stackType": "100%",
							"gridAlpha": 0
						} ],
						"graphs": [ {
							"type": "column",
							"topRadius": 1,
							"columnWidth": 1,
							"showOnAxis": true,
							"lineThickness": 2,
							"lineAlpha": 0.5,
							"lineColor": "#FFFFFF",
							"fillColors": "#8d003b",
							"fillAlphas": 0.8,
							"gradientRatio": [0.5, 0, -0.5],
							"valueField": "value2"
						}, {
							"type": "column",
							"topRadius": 1,
							"columnWidth": 1,
							"showOnAxis": true,
							"lineThickness": 2,
							"lineAlpha": 0.5,
							"lineColor": "#cdcdcd",
							"fillColors": "#cdcdcd",
							"fillAlphas": 0.5,
							"gradientRatio": [0.5, 0, -0.5],
							"valueField": "value1",
							"lineColor": scope.config.barColor1
						} ],
						"categoryField": "category",
						"categoryAxis": {
							"axisAlpha": 0,
							"labelOffset": 40,
							"gridAlpha": 0
						},
						"export": {
							"enabled": true
						}
					});
				} else {
					// Update the title
					if (scope.config.showTitle) {
						chart.titles = createArrayOfChartTitles();
					} else {
						chart.titles = null;
					} // Refresh the graph					
						chart.dataProvider = chartData;
						chart.validateData();
						chart.validateNow();
				}
			}
		 }
		
		function createArrayOfChartTitles() {
				// Build the titles array
				var titlesArray;
				if (scope.config.useCustomTitle) {
					titlesArray = [
						{
							"text": scope.config.customTitle,
							"size": (scope.config.fontSize + 3)
				}
			];
				} else {
					titlesArray = [
						{
							"text": " " /*+ convertMonthToString(monthNow)*/,
							"bold": true,
							"size": (scope.config.fontSize + 3)
				}
			];
				}
				return titlesArray;
			}
		//var oldLabelSettings;
		function myCustomConfigurationChangeFunction(data) {
			/* if (oldLabelSettings != scope.config.includeElementName) {
				 oldLabelSettings == scope.config.includeElementName;
				 labels = getLabels(scope.symbol.DataSources);
			 }*/
				if (chart) {
					// Update the title
					if (scope.config.showTitle) {
						chart.titles = createArrayOfChartTitles();
					} else {
						chart.titles = null;
					}
					// Update colors and fonts
					if (chart.color !== scope.config.textColor) {
						chart.color = scope.config.textColor;
					}
					if (chart.backgroundColor !== scope.config.backgroundColor) {
						chart.backgroundColor = scope.config.backgroundColor;
					}
					if (chart.plotAreaFillColors !== scope.config.plotAreaFillColor) {
						chart.plotAreaFillColors = scope.config.plotAreaFillColor;
					}
					//To change the color of the graphic
					if (chart.graphs[0].fillColors !== scope.config.barColor1) {
						chart.graphs[0].fillColors = scope.config.barColor1;
					}
					//To change the color of the contour line
					if (chart.graphs[0].lineColor !== scope.config.barColor1) {
						chart.graphs[0].lineColor = scope.config.barColor1;
					}
					
					// Update the scroll bar
					//if (chart.chartScrollbar.enabled != scope.config.showChartScrollBar) {
					//	chart.chartScrollbar.enabled = scope.config.showChartScrollBar;
					//}
					//chart.legend.enabled = scope.config.showLegend;
					//chart.legend.position = scope.config.legendPosition;
					// Commit updates to the chart
					chart.validateNow();
					//console.log("Styling updated.");
				}
			}

		};

		// Register this custom symbol definition with PI Vision
		CS.symbolCatalog.register(myCustomSymbolDefinition);

	})(window.PIVisualization);
