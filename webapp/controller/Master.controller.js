sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
		"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator"
	
], function (Controller, JSONModel, formatter, Filter, FilterOperator, Sorter) {
	"use strict";

	return Controller.extend("com.sap.innovision.controller.Master", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sap.innovision.view.Master
		 */
		formatter: formatter,
		onInit: function () {
	// 			var oBotData = 
	// {	bot: [{
	// 		BotName: "Bot1",
	// 		Status: "PASS",
	// 		starttime: "start time: 23-08-2019 12:32:987"
	// 	},
	// 	{
	// 	BotName: "Bot2",
	// 		Status: "FAIL",
	// 		starttime: "start time: 23-08-2019 12:32:987"
	// 	},
	// 	{
	// 		BotName: "Bot3",
	// 		Status: "PASS",
	// 		starttime: "start time: 23-07-2019 12:32:987"
	// 	}
	// ]};


	// 	var oModel = new JSONModel(oBotData);
		
	// 	this.getView().setModel(oModel,"A");
	// 	console.log(oModel);
this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};
		
		var oList = this.byId("list");
					$.ajax({
				type: "GET",
				dataType: "json",
				url: "http://127.0.0.1:3005/output",
				cors: true,
				secure: true,
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function (data, textStatus, jqXHR) {
					 console.log(data);
					//console.log(data.suite[0].suite);
					var oModel = new JSONModel();
					oModel.setData(data.robot.suite.suite);
					oList.setModel(oModel);
				console.log(oModel);
				}
			});
		},
		
		onSelectionChange: function(oEvent){
			
			var evnt = (oEvent.getParameter("listItem") || oEvent.getSource());
			var botname = evnt.getBindingContext().getProperty("_attributes/source");
		    var system_name = evnt.getBindingContext().getProperty("_attributes/name");
		    system_name = (system_name.split('-'))[0];
			botname = (botname.split('\\')).slice(-2,-1);
			//console.log(botname[0]);
			var oR = sap.ui.core.UIComponent.getRouterFor(this);
			oR.navTo("Detail_r", {"botid": botname[0], "sysid": system_name});
		},
		
		onSearch : function (evt) {
	// create model filter
	var filters = [];
	var query = evt.getParameter("query");
	console.log("query");
	if (query && query.length > 0) {
		var filter = new sap.ui.model.Filter("_attributes/source", sap.ui.model.FilterOperator.Contains, query);
		filters.push(filter);
	}
	

	// update list binding
	var list = this.getView().byId("list");
	
	var binding = list.getBinding("items");
	binding.filter(filters);
}
       
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.sap.innovision.view.Master
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.sap.innovision.view.Master
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.sap.innovision.view.Master
		 */
		//	onExit: function() {
		//
		//	}

	});

});