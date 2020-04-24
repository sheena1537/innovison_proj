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
			var oView = this.getView();
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
					oView.setModel(oModel);
			     	console.log(oModel);
				}
			});
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
			this.sysname = this.oArg.sysid;
			var t = this;
			var oView = this.getView();
			
			var url1 = "http://127.0.0.1:3005/output/"+this.botname+"/"+this.sysname;
			$.ajax({
				type: "GET",
				dataType: "json",
				url: url1,
				cors: true,
				secure: true,
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function (data, textStatus, jqXHR) {
				var	oModel = new JSONModel();
				var data1 = data.robot.statistics;
					oModel.setData(data1);
					oView.setModel(oModel);
					var pass_no = data1.total.stat[1]._attributes.pass;
                   var fail_no = data1.total.stat[1]._attributes.fail;
                   var model = new sap.ui.model.json.JSONModel();
					model.setData({
						Report :[
							{
							desc : "pass: "+pass_no,
							num: pass_no
							},
							{
								desc : "fail: "+fail_no,
								num : fail_no
							}
						]
					});
	    var	oVizFrame = oView.byId("idVizFrame");
	    var oVizPop = oView.byId("idPopOver2");
	    //""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
	    oVizFrame.setVizProperties({
	
			title: {
				visible: false
			},
		
			plotArea: {
			
				colorPalette :  ['#2b7d2b', '#bb0000']
			}
			
		});
		oVizPop.connect(oVizFrame.getVizUid());
		
		 //""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
		oVizFrame.setModel(model);
				}
			});
			oView.byId("title").setText(this.botname);
			var html=this.getView().byId("html");
			this.botname_url = (this.botname).replace(/ /g, "%20");
			var url = "http://127.0.0.1:3005/report/"+this.botname_url+"/"+this.sysname;
		    var data1 = "<iframe src='"+url+"' height='800' width='100%'/>";
            html.setContent(data1);
            
			
		},
		onSendEmailPress: function(oEvent){
			//var developer = sap.ui.getCore().byId(evt.getParameter('id')).getValue();
			sap.m.URLHelper.triggerEmail("developer;s2", "Info Request");
			},
		
		onLogClick: function(oEvent){
		var html=this.getView().byId("html");
		var url = "http://127.0.0.1:3005/log/"+this.botname_url+"/"+this.sysname;
		var data1 = "<iframe src='"+url+"' height='800' width='100%'/>";
        html.setContent(data1);
        this.getView().byId("gb").setVisible(true);
			
		},
		onBack: function(oEvent){
			var html=this.getView().byId("html");
		var url = "http://127.0.0.1:3005/report/"+this.botname_url+"/"+this.sysname;
		 var data1 = "<iframe src='"+url+"' height='800' width='100%'/>";
         html.setContent(data1);
		this.getView().byId("gb").setVisible(false);	
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