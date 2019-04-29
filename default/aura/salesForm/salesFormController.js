({
	doInit: function(component, event, helper) {
        var actionBrands = component.get("c.getListModels");
        actionBrands.setParams({"recordId":component.get("v.recordId")});
        var actionFormName = component.get("c.getFormName");
        actionFormName.setParams({"recordId":component.get("v.recordId")});
        actionFormName.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                component.set("v.salesFormName", response.getReturnValue().Name);
                console.log('Form name = ' + response.getReturnValue());
                component.set("v.opportunityForLink", response.getReturnValue().Opportunity__c);
                component.set("v.readyForApprove", response.getReturnValue().Ready_For_Approve__c);
                console.log('READY INIT = ' + response.getReturnValue().Ready_For_Approve__c);
            }
        });
        
        var actionOpportunity = component.get("c.getOpportunity");
        actionOpportunity.setParams({"recordId":component.get("v.recordId")});
        
        //Get list with Brands from Saleforce
        actionBrands.setCallback(this, function(response) {
        	var state = response.getState();
            if (state === 'SUCCESS') {
                var brands = response.getReturnValue();
                if (brands[0].length>0) {
                    component.set("v.brandAudi", brands[0]);
                    var brandAudi = brands[0];
                    component.set("v.brandAudiId", brandAudi.Brand__c);
                } 
                if (brands[1].length>0) {
                    component.set("v.brandBmw", brands[1]);
                    var brandBmw = brands[1];
                    component.set("v.brandAudiId", brandBmw.Brand__c);
                } 
                if (brands[2].length>0) {
                    component.set("v.brandMercedes", brands[2]);
                    var brandMercedes = brands[2];
                    component.set("v.brandMercedesId", brandMercedes.Brand__c);
                } 
                console.log('СРАБОТАЛО ДЕЙСТВИЕ ДЛЯ ПРОСМОТРА');
                $A.enqueueAction(actionFormName);
            }
            console.log('Record ID = ' + component.get("v.recordId"));
            console.log('TYPE' + typeof brands);
        });
        
        //Check that create new SalesForm or edit existing SalesForm, if edit existing - get List with models
        actionOpportunity.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var opportunity = response.getReturnValue();
                if (opportunity === null) {
                    component.set("v.salesFormId", component.get("v.recordId"));
                    $A.enqueueAction(actionBrands);
                } else {
                    component.set("v.opportunityId", component.get("v.recordId"));
                    component.set("v.opportunityForLink", component.get("v.recordId"));
                }
            }
        });
        $A.enqueueAction(actionOpportunity);
    },

    //Update picklist for display BRANDS
    handleUpdateBrand : function(component, event, helper) {
		var updateOptions = event.getParam("picklistOptions");
        var count=0;
        for (var i=0;i<updateOptions.length;i++) {
            if (updateOptions[i].isChecked === true) {
                count++;
            }
        }
        component.set("v.optionsForSectionBrands", updateOptions);
        component.set("v.countSelectedBrands", count);
	},
    
    //run event for update List with models when update one model
    updateModelList : function(component, event, helper) {
        var brandName = event.getParam("brandName");
        var modelList = event.getParam("modelsList");
        if (brandName === 'Audi') {
            for (var i=0;i<modelList.length;i++) {
                modelList[i].Brand__c = component.get("v.brandAudiId");
            }
            component.set("v.brandAudi", modelList);
        }
        if (brandName === 'BMW') {
            for (var i=0;i<modelList.length;i++) {
                modelList[i].Brand__c = component.get("v.brandBmwId");
            }
            component.set("v.brandBmw", modelList);
        }
        if (brandName === 'Mercedes') {
            for (var i=0;i<modelList.length;i++) {
                modelList[i].Brand__c = component.get("v.brandMercedesId");
            }
            component.set("v.brandMercedes", modelList);
        }
    },
    
    //Run handler on change in child components for update and save SF
    saveForm : function(component, event, helper) {
        component.set("v.countForSave", 0);
        var countSelectedBrands = component.get("v.countSelectedBrands");
        if (countSelectedBrands < 3) {
            component.set("v.helpMessage", 'Select for display all brands before Save or Submit Sales Form and try again!');
        } else {
            component.set("v.helpMessage", '');
            component.set("v.saveSalesForm", component.get("v.saveSalesForm")+10);
        }
        
    },
    
    //function for update All brands lists and save SF
    updateModelListForSave : function(component, event, helper) {
        var brandName = event.getParam("brandName");
        var modelList = event.getParam("modelsList");
     	var countForSave = component.get("v.countForSave");
        
    	if (brandName === 'Audi') {
            component.set("v.brandAudi", modelList);
            countForSave++;
    		component.set("v.countForSave", countForSave);
        }
        if (brandName === 'BMW') {
            component.set("v.brandBmw", modelList);
            countForSave++;
    		component.set("v.countForSave", countForSave);
        }
        if (brandName === 'Mercedes') {
            component.set("v.brandMercedes", modelList);
            countForSave++;
            component.set("v.countForSave", countForSave);
        }
		if (component.get("v.countForSave") === 3) {
    		var actionSave = component.get("c.saveSalesForm");
            actionSave.setParams({"salesFormId":component.get("v.salesFormId"),
            	"opportunityId":component.get("v.opportunityId"),
            	"salesFormName":component.get("v.salesFormName"),
            	"listAudi":component.get("v.brandAudi"),
            	"listBmw":component.get("v.brandBmw"),
            	"listMercedes":component.get("v.brandMercedes"),
                "readyForApprove":component.get("v.readyForApprove")});
                
            actionSave.setCallback(this, function (response) {
                var state = response.getState();
                if (state === 'SUCCESS') {
                    location.href = 'https://brave-panda-w36zb6-dev-ed.lightning.force.com/lightning/r/Opportunity/' 
                        + response.getReturnValue() + '/view';
                }
            });
            $A.enqueueAction(actionSave);
		}
	},
    
    cancelForm : function(component, event, helper) {
        location.href = 'https://brave-panda-w36zb6-dev-ed.lightning.force.com/lightning/r/Opportunity/' 
            + component.get("v.opportunityForLink") + '/view';
    },
    
    isReadyForSubmit : function(component, event, helper) {
        var isReadyOneBrand = event.getParam("isReadyForSubmit");
        var countBrandsForSubmit = component.get("v.countBrandsForSubmit");
        var isReadyThisFormForSubmit = component.get("v.isReadyThisFormForSubmit");
        
        isReadyThisFormForSubmit = isReadyThisFormForSubmit && isReadyOneBrand;
        countBrandsForSubmit++;
        component.set("v.isReadyThisFormForSubmit", isReadyThisFormForSubmit);
        component.set("v.countBrandsForSubmit", countBrandsForSubmit);
        
        if (component.get("v.countBrandsForSubmit") === 3) {
            console.log('Готовность к СОХРАНЕНИЮ = ' + isReadyThisFormForSubmit);
            component.set("v.countBrandsForSubmit", 0);
            component.set("v.isReadyThisFormForSubmit", true);
            
            if (isReadyThisFormForSubmit) {
                console.log('SF READY FOR SUBMIT');
                component.set("v.readyForApprove", true);
                component.set("v.saveSalesForm", component.get("v.saveSalesForm")+10);
            } else {
                component.set("v.helpMessage", 'Complete all fields in Models and try again!');
            }
        }
    },
    
    submitForm : function(component, event, helper) {
        var countSelectedBrands = component.get("v.countSelectedBrands");
        if (countSelectedBrands < 3) {
            component.set("v.helpMessage", 'Select for display all brands before Save or Submit Sales Form and try again!');
        } else {
            component.set("v.helpMessage", '');
        	component.set("v.submitSalesForm", component.get("v.submitSalesForm")+12);
        }
    }
})