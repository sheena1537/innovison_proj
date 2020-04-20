sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function (Controller, JSONModel, formatter) {
	"use strict";

	return Controller.extend("com.sap.innovision.controller.Master", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sap.innovision.view.Master
		 */
		formatter: formatter,
		onInit: function () {
// 				var oBotData = 
// 			{
// 	       bots: [{
// 			BotName: "Bot1",
// 			Status: "PASS",
// 			starttime: "start time: 23-08-2019 12:32:987"
// 		},
// 		{
// 		BotName: "Bot2",
// 			Status: "FAIL",
// 			starttime: "start time: 23-08-2019 12:32:987"
// 		},
// 		{
// 			BotName: "Bot3",
// 			Status: "PASS",
// 			starttime: "start time: 23-07-2019 12:32:987"
// 		}
// 	]
// };

// 		var oModel = new JSONModel(oBotData);
		
// 		this.getView().setModel(oModel);
		var oList = this.byId("list");
					$.ajax({
				type: "GET",
				dataType: "json",
				url: "http://127.0.0.1:3000/output",
				cors: true,
				secure: true,
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function (data, textStatus, jqXHR) {
					
					var oModel = new JSONModel();
					oModel.setData(data);
					oList.setModel(oModel);
				//	console.log(data.statistics.suite.stat);
					
				}
			});
		},
		
		onSelectionChange: function(oEvent){
			
			var evnt = (oEvent.getParameter("listItem") || oEvent.getSource());
			var botname = evnt.getBindingContext().getProperty("_attributes/name");
			var oR = sap.ui.core.UIComponent.getRouterFor(this);
			oR.navTo("Detail_r", {"botid": botname});
		},
       
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