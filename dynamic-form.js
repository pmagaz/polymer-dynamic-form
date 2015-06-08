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

    paperInputHandler: function(formComponent){
      return function(){
        this.addTextToElement(this.$.form,formComponent.title);
        if(formComponent.description) this.addTextToElement(this.$.form,formComponent.description);
        var newComponent = this.appendElement(this.$.form,formComponent.type);
        newComponent.setAttribute('name', formComponent.fieldName);
        newComponent.setAttribute('label', formComponent.label);
        return newComponent;
      }
    },

    paperCheckboxHandler: function(formComponent){
      return function(){
        var options = formComponent.options;
        var elementType = formComponent.type;
        var arrElement = [];
        this.addTextToElement(this.$.form,formComponent.label);
        
        var i = 0, l = options.length;
        for(i;i<l;i++){
          var newComponent = this.appendElement(this.$.form,elementType);
          this.addTextToElement(this.$.form, options[i].name);
          newComponent.setAttribute('name', options[i].name);
          newComponent.setAttribute('label', options[i].name);
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
        
        this.addTextToElement(this.$.form, formComponent.label);
        this.appendContent(radioGroup,document.createElement('paper-radio-button'));  
        
        var i = 0, l = options.length;
        for(i;i<l;i++){
          var newComponent = this.appendElement(radioGroup,'paper-radio-button');
          this.addTextToElement(radioGroup, options[i].name);
          newComponent.setAttribute('name', options[i].name);
          newComponent.setAttribute('label', options[i].name);
          arrElement.push(newComponent);
        }
         return Polymer.dom(this.$.form).appendChild(radioGroup);
      }
    },

    submitForm: function(event){
      document.getElementById('form').submit();
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