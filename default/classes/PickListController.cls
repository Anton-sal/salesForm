public with sharing class PickListController {
	
    @AuraEnabled        
    public static List<String> getPickListValuesIntoList(String objectType, String selectedField) {
        List<String> pickListValuesList = new List<String>();
        Schema.SObjectType convertToObj = Schema.getGlobalDescribe().get(objectType);
        Schema.DescribeSObjectResult res = convertToObj.getDescribe();
        Schema.DescribeFieldResult fieldResult = res.fields.getMap().get(selectedField).getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            pickListValuesList.add(pickListVal.getLabel());
        }     
        return pickListValuesList;
    }
    
    @AuraEnabled
    public static List<String> getPickListRegions() {
        List<String> allList = PicklistController.getPickListValuesIntoList('Model__c', 'Region__c');
        return allList;
    }
    
    @AuraEnabled
    public static List<String> getPickListValuesByRegion(String region) {
        if (region.equals('Europe')) {
            return PicklistController.getPickListValuesIntoList('Country__c', 'Europe__c');
        } else {
            if (region.equals('Asia')) {
            	return PicklistController.getPickListValuesIntoList('Country__c', 'Asia__c');    
            } else {
            	if (region.equals('North Amerika')) {
            	  return PicklistController.getPickListValuesIntoList('Country__c', 'North_America__c');    
            	} else {
            		if (region.equals('South Amerika')) {
            	    	return PicklistController.getPickListValuesIntoList('Country__c', 'South_America__c');    
              		} else {
						return null;
              		}
        		}
        	} 
    	}
    }
    
    @AuraEnabled
    public static List<String> getPickListValuesResult(List<String> regions) {
        List<String> resultList = new List<String>();
        for (Integer i=0;i<regions.size();i++) {
            resultList.addAll(PickListController.getPickListValuesByRegion(regions.get(i)));
        }
        System.debug('last ib All = ' + resultList.get(resultList.size()-1));
        return resultList;
    }
    
     @AuraEnabled
    public static Model__c getTestModel() {
        Model__c[] model = [select id, Name, Region__c, Country__c, Date__c, Consent__c, Reason__c, Quantity__c FROM Model__c limit 1];
        System.debug('model = ' + model[0]);
        return model[0];
    }
}