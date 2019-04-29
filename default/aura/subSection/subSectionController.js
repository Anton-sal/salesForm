({
    doInit: function(component, event, helper) {
        helper.createModelForDisplay(component, event);
    },
    
    handleChange: function(component, event, helper) {
        helper.createModelForDisplay(component, event);
    },
    
    handleUpdateCountry: function(component, event, helper) {
		var optionsRegion = event.getParam("picklistOptions");
        component.set("v.optionsRegion", optionsRegion);
        var listRegions = [];
        var oldOptionsCountry = component.get("v.optionsCountry");
        var newOptionsCountry = [];
        
        //create list with checked regions
        if (optionsRegion) {
        for (var i=0;i<optionsRegion.length;i++) {
            if (optionsRegion[i].isChecked == true) {
                console.log('выбранный элемент = ' + optionsRegion[i].label);
                listRegions.push(optionsRegion[i].label);
            }

        }
    }
        //create list with country for selected regions without checked values
		if (listRegions.length>0) {
        	var action = component.get("c.getPickListValuesResult");
        	action.setParams({"regions":listRegions});
        	var optionsCountry = [];
            
        	action.setCallback(this,function(response) {
            	var state = response.getState();
                var countSelectedCountry = 0;
            	console.log('Ответ пришел ' + state);
            	if (state === "SUCCESS") {
                	var result = response.getReturnValue();
                	for (var i=0;i<result.length;i++) {
                    optionsCountry.push({label:result[i],isChecked:true})
                	}
                //create list with country for selected regions with values 
                //what checked early   
                    for (var i=0;i<optionsCountry.length;i++) {
                        var count=0;
                        for (var j=0;j<oldOptionsCountry.length;j++) {
                            if (optionsCountry[i].label === oldOptionsCountry[j].label) {
                                newOptionsCountry.push(oldOptionsCountry[j]);
                                count++;
                                if (oldOptionsCountry[j].isChecked == true) {
                                    countSelectedCountry++;
                                }
                            }
                        }
                        if (count == 0) {
                            newOptionsCountry.push(optionsCountry[i]);
                            countSelectedCountry++;
                        }
                    }     
                component.set("v.optionsCountry", newOptionsCountry);
                component.set("v.countSelectedCountry", countSelectedCountry);
                component.set("v.buttonSelectLabel", 'Select All');
                component.set("v.disableButton", false);    
            	}
            });
            $A.enqueueAction(action); 
        } else {
          component.set("v.optionsCountry",[]);
          component.set("v.buttonSelectLabel", 'Deselect All');
          component.set("v.disableButton", true);
        }
	},
    
    handleUpdateListCountry: function(component, event, helper) {
        var optionsCountry = event.getParam("picklistOptions");
        component.set("v.optionsCountry", optionsCountry);
    },
    
    handleChangeConsent: function(component, event, helper) {
        var consentValue = event.getParam("value");
        component.set("v.consentValue", consentValue);
        if (consentValue == 'No'||consentValue == 'Not Now') {
            component.set("v.displayReason", true);
        } else {
        	component.set("v.displayReason", false);
        }
    },
    
    emptyModelUpdate: function(component, event, helper) {
        helper.updateModel(component, event);
    }, 
    
    deleteSubsection : function(component, event, helper) {
        helper.updateModel(component, event);
        var index = component.get("v.index");
        var deleteEvent = component.getEvent("deleteSubsection");
        deleteEvent.setParams({"index":index});
        deleteEvent.fire();
    },
    
    saveModel : function(component, event, helper) {
        component.set("v.requiredFields", false);
        var name = component.get("v.modelName");
        var defaultModel = {'sobjectType':'Model__c'};
        defaultModel.Name = component.get("v.modelName");
        defaultModel.Date__c = component.get("v.date");
        defaultModel.Consent__c = component.get("v.consentValue");
        defaultModel.Reason__c = component.get("v.reasonValue");
        defaultModel.Quantity__c = component.get("v.quantity");
        defaultModel.Id = component.get("v.modelId");
        	
        
        var regions = component.get("v.optionsRegion");
        var regionsValue = '';
        for (var i = 0;i<regions.length;i++) {
            if (regions[i].isChecked == true) {
                regionsValue = regionsValue + regions[i].label + ';';
            }
           
        }
        regionsValue = regionsValue.substring(0,regionsValue.length-1);
        defaultModel.Region__c = regionsValue;
        
        var country = component.get("v.optionsCountry");
        var countryValue = '';
        for (var i = 0;i<country.length;i++) {
            if (country[i].isChecked == true && i != country.length-1 ) {
                countryValue = countryValue + country[i].label + ';';
            }
        }
        defaultModel.Country__c = countryValue;
        var index = component.get("v.index");
        var saveModel = component.getEvent("saveMyModel");
        saveModel.setParams({"model":defaultModel, "index":index});
        console.log('Update model Fire');
        saveModel.fire();
    },
    
    submitModel : function(component, event, helper) {
        component.set("v.requiredFields", true);
        var name = !!component.get("v.modelName");
        var quantity = !!component.get("v.quantity");
        var date = !!component.get("v.date");
        var consentValue = !!component.get("v.consentValue");
        if (consentValue === 'No' || consentValue === 'Not Now') {
            var reasonValue = !!component.get("v.reasonValue");
        } else {
            var reasonValue = true;
        }
        var selectedCountry = !!component.get("v.countSelectedCountry");
        var countSelectedRegion = !!component.get("v.countSelectedRegion");
        var readyForSubmit = name && quantity && date && consentValue && selectedCountry && countSelectedRegion;
        var readyEvent = component.getEvent("checkReadyForSubmit");
        readyEvent.setParams({"isReadyForSubmit":readyForSubmit});
        readyEvent.fire();
    }
    
})