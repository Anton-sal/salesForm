({
    doInit: function(component, event, helper) {
        component.set("v.modelsHelper", component.get("v.models"));
    },
    
    handleUpdateModel : function(component, event, helper) {
        console.log('update model');
        var updatedModel = event.getParam("model");
        var index = event.getParam("index");
        var listModels = component.get("v.models");
        console.log('Длина массива = ' + listModels.length);
        listModels[index] = updatedModel;
        component.set("v.modelsHelper", listModels);
        var countUpdated = component.get("v.modelsHelperCount");
        console.log(countUpdated);
        component.set("v.modelsHelperCount", countUpdated+1);
        console.log('Длина массива = ' + listModels.length);
        
        if (countUpdated === listModels.length-1) {
            console.log('Сработал ИФ = ' + listModels.length);
            var modelsHelper = component.get("v.modelsHelper");
            var modelsForSet = component.get("v.models");

            component.set("v.modelsHelperCount", 0);
            modelsHelper.push(modelsForSet[modelsForSet.length-1]);
            component.set("v.models", modelsHelper);

        	var modelLIstEvent = component.getEvent("updateModelsList");
        	modelLIstEvent.setParams({"modelsList":listModels,"brandName":component.get("v.brandName")});
        	modelLIstEvent.fire();
            component.set("v.modelsHelperCount", 0);
        }
	},
    
    emptyModelUpdate : function(component, event, helper) {
		component.set("v.emptySection", 5);
	},
    
    deleteSubsection : function(component, event, helper) {
        var indexForDelete = event.getParam("index");
		console.log('SUBSECTION DELLLLLLEEEEEETETTETTETTETETE   ' + indexForDelete);
        var models = component.get("v.models");
        models.splice(indexForDelete, 1);
        component.set("v.models", models);
	},
    
    addSubsection : function(component, event, helper) {
        component.set("v.modelsHelperCount", 0);
        var numberSection = component.get("v.emptySection");
        component.set("v.emptySection", numberSection+1);
        var models = component.get("v.models");
        var emptyModel = component.get("v.modelForEmptySection");
        models.push(emptyModel);
        component.set("v.models", models);
        component.set("v.emptySection", numberSection+1);
    }, 
    
    cloneSubsection : function(component, event, helper) {
        component.set("v.modelsHelperCount", 0);
        var numberSection = component.get("v.emptySection");
        component.set("v.emptySection", numberSection+1);
        var models = component.get("v.models");
        var cloneModel = models[0];
        cloneModel.Id = '';
        models.push(cloneModel);
        component.set("v.models", models);
    },
    
    handleSaveModel : function(component, event, helper) {
        var updatedModel = event.getParam("model");
        var index = event.getParam("index");
        var models = component.get("v.models");
        console.log('Start event for save ' + index);
        var listForSave = component.get("v.listForSave");
        var listForSaveCount = component.get("v.listForSaveCount");
        listForSaveCount++;
        console.log('Количесто переданных моделей ' + listForSaveCount);
        console.log('Длина массива МОДЕЛС ' + models.length);
        
        listForSave[index] = updatedModel;
        component.set("v.listForSave", listForSave);
        component.set("v.listForSaveCount", listForSaveCount);
        
        if (listForSaveCount === models.length) {
            var updateModelsListForSave = component.getEvent("updateModelsListForSave");
            updateModelsListForSave.setParams({"modelsList":listForSave,"brandName":component.get("v.brandName")});
        	updateModelsListForSave.fire();
        }
    },
    
    handleReadyForSubmit : function(component, event, helper) {
        var ReadyForSubmit = event.getParam("isReadyForSubmit");
        
        var isReadyBrand = component.get("v.isReadyBrand");
        console.log('Начальное состояние isReadyBrand =  ' + isReadyBrand);
        var readyForSubmitCount = component.get("v.readyForSubmitCount");
        isReadyBrand = isReadyBrand && ReadyForSubmit;
        component.set("v.isReadyBrand", isReadyBrand);
        readyForSubmitCount++;
        component.set("v.readyForSubmitCount", readyForSubmitCount);
        var models = component.get("v.models");
        
        if (readyForSubmitCount === models.length) {
            console.log('Brand fire to SF ready = ' + isReadyBrand);
            component.set("v.readyForSubmitCount", 0);
            var readyEvent = component.getEvent("checkIsReadyForSubmit");
        	readyEvent.setParams({"isReadyForSubmit":isReadyBrand});
            component.set("v.isReadyBrand", true);
        	readyEvent.fire();
        }
    }
    
})