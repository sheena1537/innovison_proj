sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/Popup"
], function (Controller,JSONModel,Fragment,Popup) {
	"use strict";

	return Controller.extend("com.sap.innovision.controller.Detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sap.innovision.view.Detail
		 */
		onInit: function () {
			//sap.ui.getCore().byId("container-innovision---app--myapp_fullscreen").setVisible(false);
	    	this.byId("openMenu").attachBrowserEvent("tab keyup", function(oEvent){
				this._bKeyboard = oEvent.type === "keyup";
			}, this);
			var oR = sap.ui.core.UIComponent.getRouterFor(this);
			oR.getRoute("Detail_r").attachMatched(this._onAttachMatched, this);
			var url ="http://localhost:3005/output/Intelligent%20Production%20Order%20Conversion/OP_1909/Mon,%2027%20Apr%202020%2006:12:36%20GMT/pass";
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
				
				console.log("latest");
				console.log(data);
				
				
			
				}});
		},
		_onAttachMatched: function(oEvent){
			this.oArg = oEvent.getParameter("arguments");
			this.botname = this.oArg.botid;
			this.sysname = this.oArg.sysid;
			var oView = this.getView();
			oView.byId("title").setText(this.botname);
		    	var url2 = "http://127.0.0.1:3005/prevdata/"+this.botname+"/"+this.sysname;
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
				var	oModel1 = new JSONModel();
				oModel1.setData(data);
				console.log("data");
				console.log(data);
	            //oVizFrame1.setModel(oModel1);
	            oView.setModel(oModel1);
				}});
			var	oVizFrame1 = oView.byId("idVizFrame1");
	            var oVizPop = oView.byId("idPopOver2");
	            oVizFrame1.setVizProperties({
						title: {
							visible: true,
							text: "Test run result"
						},
						plotArea: {

							colorPalette: ['#44d46a', '#fa6964']
						}
					});
	        oVizPop.connect(oVizFrame1.getVizUid());
			var html=this.getView().byId("html");
			this.botname_url = (this.botname).replace(/ /g, "%20");
			this.rurl = "http://127.0.0.1:3005/report/"+this.botname_url+"/"+this.sysname;
		    var data1 = "<iframe src='"+this.rurl+"' height='800' width='100%'/>";
            html.setContent(data1);
		},
		onSendEmailPress: function(oEvent){
			//var developer = sap.ui.getCore().byId(evt.getParameter('id')).getValue();
			var url = "http://127.0.0.1:3005/report/"+this.botname_url+"/"+this.sysname;
		    var data1 = "<iframe src='"+url+"' height='800' width='100%'/>";
			sap.m.URLHelper.triggerEmail(" ", "Info Request",url);
			},
		onLogClick: function(oEvent){
		var html=this.getView().byId("html");
		this.lurl = (this.rurl).replace("report","log");
		//var url = "http://127.0.0.1:3005/log/"+this.botname_url+"/"+this.sysname;
		var data1 = "<iframe src='"+this.lurl+"' height='800' width='100%'/>";
        html.setContent(data1);
        this.getView().byId("gb").setVisible(true);
        this.getView().byId("openMenu").setVisible(false);
			
		},
		onBack: function(oEvent){
			var html=this.getView().byId("html");
		//var url = "http://127.0.0.1:3005/report/"+this.botname_url+"/"+this.sysname;
		this.rurl = (this.lurl).replace("log","report");
		 var data1 = "<iframe src='"+this.rurl+"' height='800' width='100%'/>";
         html.setContent(data1);
		this.getView().byId("gb").setVisible(false);
		this.getView().byId("openMenu").setVisible(true);
		},
		handlePressOpenMenu: function(oEvent) {
			var oButton = oEvent.getSource();
			// create menu only once
			if (!this._menu) {
				Fragment.load({
					name: "com.sap.innovision.view.menu",
					controller: this
				}).then(function(oMenu){
					this._menu = oMenu;
					this.getView().addDependent(this._menu);
					this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);
				}.bind(this));
			} else {
				this._menu.open(this._bKeyboard, oButton, Popup.Dock.BeginTop, Popup.Dock.BeginBottom, oButton);
			}
		},
			handleMenuItemPress: function(oEvent) {
			var oItem = oEvent.getParameter("item");
			var	sMessage = "'" + oItem.getText() + "' pressed";
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
			console.log(sap.ui.getCore().byId("container-innovision---master_id--list"));
			console.log(oListItem);
			sap.ui.getCore().byId("container-innovision---master_id--list").setSelectedItem(oListItem, false);
			var oModel = this.getView().getModel("app");
			oModel.setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			oModel.setProperty("/layout", "OneColumn");
			
			console.log("here master");
			this.getOwnerComponent().getRouter().navTo("Master_r", {}, true);
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