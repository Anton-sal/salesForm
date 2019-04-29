({
	updateModel : function(component, event) {
        var name = component.get("v.modelName");
        var defaultModel = {'sobjectType':'Model__c'};
        
        defaultModel.Name = component.get("v.modelName");
        defaultModel.Date__c = component.get("v.date");
        defaultModel.Consent__c = component.get("v.consentValue");
        defaultModel.Reason__c = component.get("v.reasonValue");
        defaultModel.Quantity__c = component.get("v.quantity");
        defaultModel.Id = component.get("v.modelId");
        
        //create string with semicolons for Picklistvalue regions
        var regions = component.get("v.optionsRegion");
        var regionsValue = '';
        for (var i = 0;i<regions.length;i++) {
            if (regions[i].isChecked == true) {
                regionsValue = regionsValue + regions[i].label + ';';
            }
        }
        regionsValue = regionsValue.substring(0,regionsValue.length-1);
        defaultModel.Region__c = regionsValue;
        
        //create string with semicolons for Picklistvalue Country
        var country = component.get("v.optionsCountry");
        var countryValue = '';
        for (var i = 0;i<country.length;i++) {
            if (country[i].isChecked == true && i != country.length-1 ) {
                countryValue = countryValue + country[i].label + ';';
            }
        }
        defaultModel.Country__c = countryValue;
        
        //fire event for update model list in brand subsection component
        var index = component.get("v.index");
        var updateModel = component.getEvent("updateModel");
        updateModel.setParams({"model":defaultModel, "index":index});
        console.log('Update model Fire');
        updateModel.fire();
	},
    
    createModelForDisplay : function(component, event) {
        var defaultModel = component.get("v.defaultModel");
        if (defaultModel != null) {
            var valuesRegion;
            var valuesCountry;
            //check that valueRegions and Value Country is not undefined
            if (defaultModel.Region__c) {
            	valuesRegion = defaultModel.Region__c;
            } else {
                valuesRegion = '';
            }
            var arrayRegion = valuesRegion.split(';');
            
            if (defaultModel.Country__c) {
            	valuesCountry = defaultModel.Country__c;
            } else {
                valuesCountry = '';
            }
            
            var arrayCountry = valuesCountry.split(';');
            var newOptionsCountry = [];
            var actionCountry = component.get("c.getPickListValuesResult");
            actionCountry.setParams({"regions":arrayRegion});
            var countSelectedCountries = 0;
            
            //create List with countries using values of country Picklist in Model__c
            actionCountry.setCallback(this,function(response) {
            	var state = response.getState();
                var countSelectedCountry = 0;
            	if (state === "SUCCESS") {
                	var result = response.getReturnValue();
                    var count = 0;
                    //create picklist with country after update picklist of regions
                	for (var i=0;i<result.length;i++) {
                        count = 0;
                        for (var j=0;j<arrayCountry.length;j++) {
                            if (result[i] == arrayCountry[j]) {
                                newOptionsCountry.push({label:result[i],isChecked:true});
                                count++;
                                countSelectedCountries++;
                            }
                        }
                        if (count == 0) {
                            newOptionsCountry.push({label:result[i],isChecked:false});
                        }
                	}
                component.set("v.optionsCountry", newOptionsCountry);
                component.set("v.countSelectedCountry", countSelectedCountries);
                component.set("v.buttonSelectLabel", 'Select All');
                component.set("v.disableButton", false);    
            	}
            });
            
            //create List with Regions using values of Regions Picklist in Model__c                          
            var optReg = [];
        	var actionRegion = component.get("c.getPickListRegions");
        	actionRegion.setCallback(this,function(response) {
            	var state = response.getState();
            	if (state === "SUCCESS") {
                	var result = response.getReturnValue();
                	for (var i=0;i<result.length;i++) {
                    	optReg.push({label:result[i],isChecked:false});
                	}
                
                    for (var i=0;i<optReg.length;i++) {
                        for (var j=0;j<arrayRegion.length;j++) {
                            if (optReg[i].label == arrayRegion[j]) {
                                optReg[i].isChecked = true;
                            }
                        }
                    }
                    component.set("v.optionsRegion", optReg);
                    $A.enqueueAction(actionCountry);
                    if (valuesRegion !== '') {
                    	component.set("v.countSelectedRegion", arrayRegion.length);
                    }    
        		}
            });
            $A.enqueueAction(actionRegion);

        	component.set("v.modelName", defaultModel.Name);
            component.set("v.date", defaultModel.Date__c);
            component.set("v.consentValue", defaultModel.Consent__c);
            if (defaultModel.Consent__c == 'No' || defaultModel.Consent__c == 'Not Now') {
            	component.set("v.displayReason", true);    
            }
            component.set("v.reasonValue", defaultModel.Reason__c);
            component.set("v.quantity", defaultModel.Quantity__c);
            component.set("v.modelId", defaultModel.Id);
        }
    }
})