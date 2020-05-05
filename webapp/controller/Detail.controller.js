sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"../model/formatter",
	"sap/ui/core/Popup",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function (Controller,JSONModel,Fragment,formatter,Popup,MessageToast,Dialog,Button,Text) {
	"use strict";

	return Controller.extend("com.sap.innovision.controller.Detail", {
		
		formatter: formatter,
		
		onInit: function () {
			var oR = sap.ui.core.UIComponent.getRouterFor(this);
			oR.getRoute("Detail_r").attachMatched(this._onAttachMatched, this);
		},
		
		_onAttachMatched: function(oEvent){
			this.oArg = oEvent.getParameter("arguments");
			this.botname = this.oArg.botid;
			this.sysname = this.oArg.sysid;
			var oView = this.getView();
			var	oVizFrame1 = oView.byId("idVizFrame1");
			oView.byId("title").setText(this.botname);
			
			//obtain the past 5 test runs data to display in the chart
		    	var url1 = "http://127.0.0.1:3005/prevdata/"+this.botname+"/"+this.sysname;
				$.ajax({
				type: "GET",
				dataType: "json",
				url: url1,
				cors: true,
				secure: true,
				async: false,
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function (data, textStatus, jqXHR) {
				var	oModel1 = new JSONModel();
				oModel1.setData(data);
	            //oVizFrame1.setModel(oModel1);
	            oView.setModel(oModel1);
				}});
				
				//obtain details of the area, developer and spoc of each bot
				var url2 = "http://127.0.0.1:3005/detail/"+this.botname;
				$.ajax({
				type: "GET",
				dataType: "json",
				url: url2,
				cors: true,
				secure: true,
				async: false,
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function (data, textStatus, jqXHR) {
				// var	oModel2 = new JSONModel(data);
	            // oView.byId("vb1").setModel(oModel2);
	           oView.byId("a1").setText("Area: "+data.detail[0].area);
	           oView.byId("d1").setText("Developer: "+data.detail[0].developer);
	           oView.byId("m1").setText("SPOC: "+data.detail[0].maintainer);
				}});
			
			    //set properties of viz chart
	            var oVizPop = oView.byId("idPopOver2");
	            oVizFrame1.setVizProperties({
						title: {
							visible: true,
							text: "Test run result"
						},
					categoryAxis: {
						    title:{text:"Time of run"}
			        	},
					plotArea: {
						dataLabel:{
							visible:true,
							hideWhenOverlap:false
							},
							drawingEffect: 'glossy',
							colorPalette: ['#4cba6b', '#f33334']
						}
					});
	        oVizPop.connect(oVizFrame1.getVizUid());
	        
	        //to display report
			var html=this.getView().byId("html");
			this.botname_url = (this.botname).replace(/ /g, "%20");
			this.rurl = "http://127.0.0.1:3005/report/"+this.botname_url+"/"+this.sysname;
		    var data1 = "<iframe src='"+this.rurl+"' height='800' width='100%'/>";
            html.setContent(data1);
            
            //to check if the bot is a part of the favourites list of user and accordingly change the icon of favourites button
            this.fav = this.botname_url+","+this.sysname;
            var fav_url = "http://localhost:3001/fav/i518733/"+this.fav;
            	$.ajax({
				type: "GET",
				//dataType: "json",
				url: fav_url,
				cors: true,
				secure: true,
				async: false,
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function (data, textStatus, jqXHR) {
					var fav_btn = oView.byId("fav");
		            if(data === "not found"){
		            fav_btn.setIcon("sap-icon://add-favorite");
		            //fav_btn.setTooltip("Add to favourites");
		            }
		            else 
		            fav_btn.setIcon("sap-icon://favorite");
		            //fav_btn.setTooltip("Remove from favourites");
				}});
				},
				
				
		onSendEmailPress: function(oEvent){
		   var Developer = ((this.getView().byId("d1").getText()).split(":"))[1];
		   var Maintainer =((this.getView().byId("m1").getText()).split(":"))[1];
			sap.m.URLHelper.triggerEmail(Developer, "Bot run details: "+this.botname,"Bot Report: "+this.rurl+" Bot log: "+((this.rurl).replace("report","log")),Maintainer);
			},
			
		onLogClick: function(oEvent){
		var html=this.getView().byId("html");
		this.lurl = (this.rurl).replace("report","log");
		var data1 = "<iframe src='"+this.lurl+"' height='800' width='100%'/>";
        html.setContent(data1);
        this.getView().byId("gb").setVisible(true);//go back button enabled to view report
		},
		
		//trigerred on pressing go back function
		onBack: function(oEvent){
		var html=this.getView().byId("html");
		this.rurl = (this.lurl).replace("log","report");
		var data1 = "<iframe src='"+this.rurl+"' height='800' width='100%'/>";
        html.setContent(data1);
		this.getView().byId("gb").setVisible(false);
		this.getView().byId("openMenu").setVisible(true);
		},

        /* on click of an item in view previous reports drop down menu show the report associated with that particular day*/
		handleMenuItemPress: function(oEvent) {
			var oItem = oEvent.getParameter("item");
			var time =  oItem.getText();
			var time_url = (time).replace(/ /g, "%20");
			this.rurl = "http://127.0.0.1:3005/report/"+this.botname_url+"/"+this.sysname+"/"+time_url;
			var html=this.getView().byId("html");
		    var data1 = "<iframe src='"+this.rurl+"' height='800' width='100%'/>";
            html.setContent(data1);
		},
		
		
		toggleFullScreen: function () {
			var oModel = this.getView().getModel("app");
			var bFullScreen = oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			oModel.setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				oModel.setProperty("/previousLayout", oModel.getProperty("/layout"));
				oModel.setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				oModel.setProperty("/layout", oModel.getProperty("/previousLayout"));
			}
		},
		
		onCloseDetailPress: function () {
			var oListItem=sap.ui.getCore().byId("container-innovision---master_id--list").getSelectedItem();
			sap.ui.getCore().byId("container-innovision---master_id--list").setSelectedItem(oListItem, false);
			var oModel = this.getView().getModel("app");
			oModel.setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			oModel.setProperty("/layout", "OneColumn");
			this.getOwnerComponent().getRouter().navTo("Master_r", {}, true);
		},
		
		myChartClickHandler: function(oEvent){
			var content = oEvent.getParameters();
			var timestamp = content.data[0].data.Time;
			var criteria = (content.data[0].data.measureNames).toUpperCase();
			var oView=this.getView();
			
			//display vbox containing the table
			oView.byId("v1").setVisible(true);
			
			/*obtain the test case details of a particular day according to the criteria => pass/fail
			and display it in the table when the user clicks on the bar chart*/
		    var time_url = (timestamp).replace(/ /g, "%20");
			var url = "http://127.0.0.1:3005/output/"+this.botname_url+"/"+this.sysname+"/"+time_url+"/"+criteria;
			$.ajax({
				type: "GET",
				dataType: "json",
				url: url,
				cors: true,
				secure: true,
				async: false,
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function (data, textStatus, jqXHR) {
				var Jmod = new JSONModel(data);
				oView.byId("t1").setModel(Jmod);
				}});
		},
		
		onCloseTable:function(oEvent){
			this.getView().byId("v1").setVisible(false);
		},
		
		addtofav:function(oEvent){
		var oView = this.getView();
		var fav_btn = oView.byId("fav");
		var fav_icon = fav_btn.getIcon();
		
		
		/* if fav_icon=>sap-icon://favorite : then this bot is already a part of favourites 
		so bring up the remove from favourites option on click of the fav_btn*/
		if(fav_icon === "sap-icon://favorite")
		{   var t =this;
			var oDialog = new Dialog({
				title: "Confirm",
				type: "Message",
				content: new Text({ text: "Remove from favourites?" }),
				beginButton: new Button({
					type: Button.Emphasized,
					text: "Remove",
					press: function () {
		     	var url = "http://127.0.0.1:3001/addfav/i518733/"+t.fav+"/remove";
		     	$.ajax({
				type: "PUT",
				//dataType: "json",
				url: url,
				cors: true,
				secure: true,
				async: false,
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function (data, textStatus, jqXHR) {
					MessageToast.show("Removed from favourites");
					fav_btn.setIcon("sap-icon://add-favorite");
					//fav_btn.setTooltip("Add to favourites");
				}});
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});

			oDialog.open();
		}
		
		//if bot is not a part of favourite list of user then add it
		else
		{
		var url = "http://127.0.0.1:3001/addfav/i518733/"+this.fav+"/add";
			$.ajax({
				type: "PUT",
				//dataType: "json",
				url: url,
				cors: true,
				secure: true,
				async: false,
				headers: {
					'Access-Control-Allow-Origin': '*'
				},
				success: function (data, textStatus, jqXHR) {
					MessageToast.show("Added to favourites");
					fav_btn.setIcon("sap-icon://favorite");
					//fav_btn.setTooltip("Remove from favourites");
				}});
		}
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