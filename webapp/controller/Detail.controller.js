sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller,JSONModel) {
	"use strict";

	return Controller.extend("com.sap.innovision.controller.Detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sap.innovision.view.Detail
		 */
		onInit: function () {
		    
			var oR = sap.ui.core.UIComponent.getRouterFor(this);
			oR.getRoute("Detail_r").attachMatched(this._onAttachMatched, this);
		// 		var oBotData = 
		// 	{
	 //      bots: {
		// 	BotName: "Bot1",
		// 	Developer: "ABC",
		// 	passed: 1,
		// 	failed: 0,
		// 	total: 1
			
		// }};
        
		// var oModel = new JSONModel(oBotData);
		// this.getView().setModel(oModel);
		// console.log(oModel);
		
		//var botid = this.oArg.botid;
		},
		_onAttachMatched: function(oEvent){
			this.oArg = oEvent.getParameter("arguments");
			this.botname = this.oArg.botid;
			var html=this.getView().byId("html");
			 //botname = "Physical_Inventory_Count_Generate_Count_List";
			 this.botname_url = (this.botname).replace(/ /g, "%20");
			 var url = "http://127.0.0.1:3004/report/"+this.botname_url;
			 console.log(url);
		     var data1 = "<iframe src='"+url+"' height='800' width='100%'/>";
            html.setContent(data1);
			//alert(botname);
		},
		onSendEmailPress: function(oEvent){
			//var developer = sap.ui.getCore().byId(evt.getParameter('id')).getValue();
			sap.m.URLHelper.triggerEmail("developer;s2", "Info Request");
			},
		
		onLogClick: function(oEvent){
		var html=this.getView().byId("html");
		var url = "http://127.0.0.1:3004/log/"+this.botname_url;
		 var data1 = "<iframe src='"+url+"' height='800' width='100%'/>";
         html.setContent(data1);
			
		}
		
		
	

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.sap.innovision.view.Detail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.sap.innovision.view.Detail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.sap.innovision.view.Detail
		 */
		//	onExit: function() {
		//
		//	}

	});

});