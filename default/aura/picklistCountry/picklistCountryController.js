({
	handleUpdateOptions : function(component, event, helper) {
        var updateOptions = event.getParam("picklistOptions");
        var updateCounty = component.getEvent("updateCountryOptions");
        component.set("v.optionsCountry", updateOptions);
        updateCounty.setParams({"picklistOptions":updateOptions});
        updateCounty.fire(); 
	},
    
    handleClick : function(component, event, helper) {
        var countries = component.get("v.optionsCountry");
        var countChecked = 0;
        for (var i=0;i<countries.length;i++) {
            if (countries[i].isChecked) {
                countChecked++;
            }
        }
        if (countChecked>0&&component.get("v.buttonSelectLabel")=='Select All') {
            for (var i=0;i<countries.length;i++) {
            	countries[i].isChecked=true;
            }
            component.set("v.optionsCountry", countries);
            component.set("v.buttonSelectLabel", 'Deselect All');
            component.set("v.countSelectedCountry", countries.length);
        } else {
            if (countChecked>0&&component.get("v.buttonSelectLabel")=='Deselect All') {
              for (var i=0;i<countries.length;i++) {
              	  countries[i].isChecked=false;
              }
              component.set("v.optionsCountry", countries);
              component.set("v.buttonSelectLabel", 'Select All');
              component.set("v.countSelectedCountry", 0);
            }
 		}
	}
})