public with sharing class SalesFormController {
    
	@AuraEnabled 
    public static List<List<Model__c>> getListModels(String recordId) {
        List<Brand__c> brands = [SELECT Id, Label__c FROM Brand__c WHERE Sales_Form__r.Id =:recordId ORDER BY Label__c ASC];
        List<Model__c> listAudi = [SELECT id, Name, Region__c, Country__c, Date__c, Consent__c, Reason__c, Quantity__c, Brand__c FROM Model__c WHERE Brand__c=:brands[0].Id];
        List<Model__c> listBmw = [SELECT id, Name, Region__c, Country__c, Date__c, Consent__c, Reason__c, Quantity__c, Brand__c FROM Model__c WHERE Brand__c=:brands[1].Id];
        List<Model__c> listMercedes = [SELECT id, Name, Region__c, Country__c, Date__c, Consent__c, Reason__c, Quantity__c, Brand__c FROM Model__c WHERE Brand__c=:brands[2].Id];
        
        List<List<Model__c>> models = new List<List<Model__c>>();
        models.add(listAudi);
        models.add(listBmw);
        models.add(listMercedes);
        return models;
    }
    
    @AuraEnabled 
    public static Sales_Form__c getFormName (String recordId) {
        Sales_Form__c form1 =  [SELECT Id, Name, Opportunity__c, Ready_For_Approve__c FROM Sales_Form__c WHERE Id = :recordId];
        return form1;
    }
        
    @AuraEnabled 
    public static Opportunity getOpportunity(String recordId) {
    try {
        Opportunity opp =  [SELECT Id, Name FROM Opportunity WHERE Id = :recordId];
        System.debug(opp);
        return opp;
	}
	catch (QueryException e){
		System.debug('Исключение');
        return null;
	}
    }
    
    @AuraEnabled 
    public static String saveSalesForm (String salesFormId, String opportunityId, String salesFormName, List<Model__c> listAudi, 
                                        List<Model__c> listBmw, List<Model__c> listMercedes, Boolean readyForApprove) {

        if (opportunityId == '') {
            String recordId = salesFormId;
            List<Brand__c> brands = [SELECT Id, Label__c FROM Brand__c WHERE Sales_Form__r.Id =:recordId ORDER BY Label__c ASC];
            
        	List<Model__c> listAudiOld = [SELECT id, Name, Region__c, Country__c, Date__c, Consent__c, Reason__c, Quantity__c, Brand__c FROM Model__c WHERE Brand__c=:brands[0].Id];
        	List<Model__c> listBmwOld = [SELECT id, Name, Region__c, Country__c, Date__c, Consent__c, Reason__c, Quantity__c, Brand__c FROM Model__c WHERE Brand__c=:brands[1].Id];
        	List<Model__c> listMercedesOld = [SELECT id, Name, Region__c, Country__c, Date__c, Consent__c, Reason__c, Quantity__c, Brand__c FROM Model__c WHERE Brand__c=:brands[2].Id];
            
            delete listAudiOld;
            delete listBmwOld;
            delete listMercedesOld;
            
            for (Model__c oneModel:listAudi) {
                oneModel.Brand__c = brands[0].Id;
                oneModel.Id = null;
            }
            for (Model__c oneModel:listBmw) {
                oneModel.Brand__c = brands[1].Id;
                oneModel.Id = null;
            }
            
            for (Model__c oneModel:listMercedes) {
                oneModel.Brand__c = brands[2].Id;
                oneModel.Id = null;
            }
            insert listAudi;
            insert listBmw;
            insert listMercedes;
            
            Sales_Form__c mySF = [SELECT Id, Opportunity__c FROM Sales_Form__c WHERE Id=:salesFormId];
            mySF.Ready_For_Approve__c = readyForApprove;
            update mySF;
            return mySF.Opportunity__c;
            
        } else {
            Sales_Form__c newSF = new Sales_Form__c(Name = salesFormName, Opportunity__c = opportunityId);
            newSF.Ready_For_Approve__c = readyForApprove;
            insert newSF;
            Brand__c newBrandAudi = new Brand__c(Label__c = 'Audi', Sales_Form__c = newSF.Id);
            insert newBrandAudi;
            Brand__c newBrandBmw = new Brand__c(Label__c = 'BMW', Sales_Form__c = newSF.Id);
            insert newBrandBmw;
            Brand__c newBrandMercedes = new Brand__c(Label__c = 'Mercedes', Sales_Form__c = newSF.Id);
            insert newBrandMercedes;
            
            for (Model__c oneModel:listAudi) {
                oneModel.Brand__c = newBrandAudi.Id;
            }
            for (Model__c oneModel:listBmw) {
                oneModel.Brand__c = newBrandBmw.Id;
            }
            for (Model__c oneModel:listMercedes) {
                oneModel.Brand__c = newBrandMercedes.Id;
            }
            insert listAudi;
            insert listBmw;
            insert listMercedes;
            return opportunityId;
        }                                           
    }
    
}