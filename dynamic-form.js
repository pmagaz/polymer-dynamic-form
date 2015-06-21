Polymer({
    
    is: "dynamic-form",
    
    properties: {

      action : {
        type : String
      },

      method : {
        type : String,
        value : 'POST'
      },
      
      data : {
        type : Object,
        notify : false,
        observer : 'dataObserver'
      },

      bowerPath : {
        type : String,
        value : '../../bower_components/'
      },

    },

    appendElement: function(node, element){
      var newComponent = document.createElement(element);
      return Polymer.dom(node).appendChild(newComponent);
    },

    appendContent: function(node, content){
     return Polymer.dom(node).innerHTML = content; 
    },

    addTextToElement: function(element, text){
      var span = document.createElement('span');
      this.appendContent(span,' ' + text);
      return Polymer.dom(element).appendChild(span);
    },

    addClass: function(element, cssClass){
      return element.classList.add(cssClass);
    },

    addTitle: function(title){
      var titleElement = this.addTextToElement(this.$.form,title);
      this.addClass(titleElement,'title');
      return titleElement;
    },
    
    addDescription: function(description){
      var descElement = this.addTextToElement(this.$.form,description);
      return this.addClass(descElement,'description');
    },

    addOption: function(node, optionType, optionName){
      var newComponent = this.appendElement(node, optionType);
      newComponent.setAttribute('name', optionName);
      newComponent.setAttribute('label', optionName);
      
      var span = document.createElement('span');
      span.textContent = optionName; 
      newComponent.appendChild(span);
      return newComponent;
    },

    paperInputHandler: function(formComponent){
      return function(){
        this.addTitle(formComponent.title);
        if(formComponent.description) this.addDescription(formComponent.description);
        var newComponent = this.appendElement(this.$.form,formComponent.type);
        newComponent.setAttribute('name', formComponent.title);
        newComponent.setAttribute('label', formComponent.label);
        return newComponent;
      }
    },

    paperCheckboxHandler: function(formComponent){
      return function(){
        var options = formComponent.options;
        var elementType = formComponent.type;
        var arrElement = [];
        this.addTitle(formComponent.title);
        
        var i = 0, l = options.length;
        for(i;i<l;i++){
          var newComponent = this.addOption(this.$.form, elementType, options[i].name);
          newComponent.setAttribute('id', formComponent.title);
          arrElement.push(newComponent);
        }
        return arrElement;
      }
    },

    paperRadioHandler: function(formComponent){
      return function(){
        var arrElement = [];
        var options = formComponent.options;
        var elementType = formComponent.type;
        var radioGroup = document.createElement('paper-radio-group');
        radioGroup.setAttribute('id', formComponent.title);
        this.addTitle(formComponent.title);
        
        var i = 0, l = options.length;
        for(i;i<l;i++){
          var newComponent = this.addOption(radioGroup, 'paper-radio-button',options[i].name);
        }
        return Polymer.dom(this.$.form).appendChild(radioGroup);
      }
    },

    parseData: function(){
      var data = {};
      var arr = this.$.form._composedChildren;
      var i = 0, l = arr.length;
      
      for(i;i<l;i++){
        var isPaperInput = arr[i].value ? true : false;
        var isPaperCheckbox = arr[i].checked ? true : false;
        var isPaperRadio = arr[i].selected ? true : false;
        
        if(isPaperInput){
          data[arr[i].name] = arr[i].value;
        }
        else if (isPaperCheckbox){
          if(data[arr[i].id] instanceof Array){
            data[arr[i].id].push(arr[i].innerText);
          } else {
            data[arr[i].id] = new Array();
            data[arr[i].id].push(arr[i].innerText);
          }
        }
        else if(isPaperRadio){
          data[arr[i].id] = arr[i].selected;
        } 
      }
      return data;
    },

    submitForm: function(event){
      console.log(JSON.stringify(this.parseData()));
      //Polymer.dom(event).localTarget.parentElement.submit();
    },

    paperButtonHandler: function(formComponent){
      return function(){
        var newComponent = this.appendElement(this.$.form,'paper-button');
        this.appendContent(newComponent,formComponent.label); 
        newComponent.setAttribute('raised', true);
        this.listen(newComponent,'click','submitForm');
        newComponent.setAttribute('label', formComponent.label);
        return newComponent;
      }
    },

    importComponent: function(path, callback){
      this.importHref(path, function(e) {
        callback();
      }, function(e) {
          throw new Error("Can't import "+ e.path[0].href);
      });
    },

    importDependencies: function(formComponent){
      switch(formComponent.type){
        case 'paper-input':
          var path = this.bowerPath + 'paper-input/paper-input.html';
          var callback = this.paperInputHandler(formComponent).bind(this);
          break;
        case 'paper-textarea':
          var path = this.bowerPath + 'paper-input/paper-textarea.html';
          var callback = this.paperInputHandler(formComponent).bind(this);
          break;
        case 'paper-checkbox':
          var path = this.bowerPath + 'paper-checkbox/paper-checkbox.html';
          var callback = this.paperCheckboxHandler(formComponent).bind(this);
          break;
        case 'paper-radio-group':
          var path = this.bowerPath + 'paper-radio-group/paper-radio-group.html';
          var callback = this.paperRadioHandler(formComponent).bind(this);
          break;
        case 'paper-button':
          var path = this.bowerPath + 'paper-button/paper-button.html';
          var callback = this.paperButtonHandler(formComponent).bind(this);
          break;
        }

        this.importComponent(path, callback);
    },

    dataObserver: function(data){
      var formComponents = data.items;
      var i = 0, l = formComponents.length;
      for(i;i<l;i++){
        this.importDependencies(formComponents[i]);
      }
    }
});