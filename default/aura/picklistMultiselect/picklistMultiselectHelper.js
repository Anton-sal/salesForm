({
	selectOptionHelper : function(component,label,isCheck) {
        var selectedOption='';
		var allOptions = component.get('v.options');
        var count=0;
        for(var i=0;i<allOptions.length;i++){ 
            if (allOptions[i].label==label) { 
                if (isCheck=='true') { 
                    allOptions[i].isChecked = false; 
                } else { 
                	allOptions[i].isChecked = true; 
                } 
            } 
            if (allOptions[i].isChecked) { 
                selectedOption=allOptions[i].label; 
                count++; } 
        } 
        if (count >= 0) {
            selectedOption = count + ' items selected';
        	component.set("v.countSelected", count);
        }
        component.set('v.options', allOptions);
    }
})