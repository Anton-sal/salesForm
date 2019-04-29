({
	doInit : function(component, event, helper) {
		var defaultBrands = [{label:'Audi',isChecked:'false'},{label:'BMW',isChecked:'false'},
                                                                  {label:'Mersedes',isChecked:'false'}];
        component.set("v.optionsBrand", defaultBrands);
	},
    
    handleUpdateOptions : function(component, event, helper) {
        console.log('Событие пришло');
		var updateBrand = event.getParam("picklistOptions");
        component.set("v.optionsBrand", updateBrand);
        console.log('BMW in brand= ' + updateBrand[1].isChecked);
        var updateBrandEvent = component.getEvent("updateBrandOptions");
        updateBrandEvent.setParams({"picklistOptions":updateBrand});
        updateBrandEvent.fire();
	},
})