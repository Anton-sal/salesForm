({
    openDropdown:function(component,event,helper){
        $A.util.addClass(component.find('dropdown'),'slds-is-open');
        $A.util.removeClass(component.find('dropdown'),'slds-is-close');
    },
    
    closeDropDown:function(component,event,helper){
        $A.util.addClass(component.find('dropdown'),'slds-is-close');
        $A.util.removeClass(component.find('dropdown'),'slds-is-open');
    },
    
    selectOption:function(component,event,helper){      
        var label = event.currentTarget.id.split("#BP#")[0];
        var isCheck = event.currentTarget.id.split("#BP#")[1];
        helper.selectOptionHelper(component,label,isCheck);
        $A.util.addClass(component.find('dropdown'),'slds-is-open');
        $A.util.removeClass(component.find('dropdown'),'slds-is-close');
        component.set("v.isOpen", false);
        
        	//Fire event for update options
        var options = component.get("v.options");
        var updateEvent = component.getEvent("updatePicklistOptions");
        updateEvent.setParams({"picklistOptions":options});
        updateEvent.fire();
    },
    
    openMyDropdown:function(component,event,helper){
        var isOpen = component.get("v.isOpen");
        if (!isOpen) {
        	$A.util.addClass(component.find('dropdown'),'slds-is-open');
        	$A.util.removeClass(component.find('dropdown'),'slds-is-close');
            component.set("v.isOpen", true);
        } else { 
            $A.util.addClass(component.find('dropdown'),'slds-is-close');
        	$A.util.removeClass(component.find('dropdown'),'slds-is-open');
            component.set("v.isOpen", false);
        }
    }       
})