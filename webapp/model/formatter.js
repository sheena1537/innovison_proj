sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sStatus value to be formatted
		 * @returns {string} formatted status
		 */
		date_time : function (sStatus) {
		     var datime;
			if((sStatus === undefined)||(sStatus === null))
			{return null;}
			else{
	     	datime=sStatus.slice(6,8)+"/"+sStatus.slice(4,6)+"/"+sStatus.slice(0,4)+" "+sStatus.slice(9,21);
			}
			return datime;
		},
		
		name : function (name) {
		    var chatbot_name = (name.split('\\')).slice(-2,-1);
			return chatbot_name;
		},
		
		info: function(msg){
			if((msg === null)||(msg === undefined)||(msg === " "))
			return "none";
			return msg;
		},
	
		status1 :  function (sStatus) {
			if (sStatus === "PASS") {
					return "Success";
				} else if (sStatus === "RUNNING") {
					return "Warning";
				} else if (sStatus === "FAIL"){
					return "Error";
				} else {
					return "None";
				}
		},
		
		system : function(sys){
			var sys_name = (sys.split('-'))[0];
			//console.log(sys_name);
		    return sys_name;
		}
		
		
	};
});