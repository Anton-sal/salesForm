({
	doInit : function(component, event, helper) {
		var inputOptions = component.get("v.optionsRegion");
        if (inputOptions == '') {
        	var optReg =[];
        	var actionRegion = component.get("c.getPickListRegions");
        	actionRegion.setCallback(this,function(response) {
            	var state = response.getState();
            	if (state === "SUCCESS") {
                	var result = response.getReturnValue();
                	for (var i=0;i<result.length;i++) {
                    	optReg.push({label:result[i],isChecked:false})
                	}
                component.set("v.optionsRegion", optReg);
                }
        	});
        
        $A.enqueueAction(actionRegion);
        }
	},
    
    handleUpdateOptions : function(component, event, helper) {
		var updateOptions = event.getParam("picklistOptions");
        var updateRegion = component.getEvent("updateRegionsOptions");
        updateRegion.setParams({"picklistOptions":updateOptions});
        updateRegion.fire();
	}
})