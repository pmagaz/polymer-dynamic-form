Polymer({
    
    is: "dynamic-form",
    
    properties: {
      
      data : {
        type: Object,
        notify: false,
        observer: 'dataObserver'
      },

      bowerPath: {
        type: String,
        value: '../../../bower_components/'
      } 
    },

    appendElement: function(node, element){
      var newElement = document.createElement(element);
      return Polymer.dom(node).appendChild(newElement);
    },

    appendContent: function(node, content){
     return Polymer.dom(node).innerHTML = content; 
    },

    addTextToElement: function(element, text){
      var span = document.createElement('span');
      this.appendContent(span,' ' + text);
      return Polymer.dom(element).appendChild(span);
    },

    paperInputHandler: function(formElement){
      return function(formElement){
        this.addTextToElement(this.$.form,formElement.title);
        if(formElement.description) this.addTextToElement(this.$.form,formElement.description);
        var newElement = this.appendElement(this.$.form,formElement.type);
        newElement.id = formElement.id;
        newElement.label = formElement.label;
        newElement.name = formElement.fieldName;
        return newElement;
      }
    },

    paperCheckboxHandler: function(formElement){
      return function(formElement){
        var options = formElement.options;
        var elementType = formElement.type;
        var arrElement = [];
        this.addTextToElement(this.$.form,formElement.label);
        
        var i = 0, l = options.length;
        for(i;i<l;i++){
          var newElement = this.appendElement(this.$.form,elementType);
          this.addTextToElement(this.$.form,formElement.options[i].name);
          newElement.name = formElement.fieldName;
          newElement.label = formElement.label;
          arrElement.push(newElement);
        }
        return arrElement;
      }
    },

    paperRadioHandler: function(formElement){
      return function(formElement){
        var arrElement = [];
        var options = formElement.options;
        var elementType = formElement.type;
        var radioGroup = document.createElement('paper-radio-group');
        
        this.addTextToElement(this.$.form, formElement.label);
        this.appendContent(radioGroup,document.createElement('paper-radio-button'));  
        
        var i = 0, l = options.length;
        for(i;i<l;i++){
          var newElement = this.appendElement(radioGroup,'paper-radio-button');
          this.addTextToElement(radioGroup, options[i].name);
          newElement.name = options[i].name;
          newElement.label = options[i].name;
          arrElement.push(newElement);
        }
         return Polymer.dom(this.$.form).appendChild(radioGroup);
      }
    },

    importComponent: function(formElement){
      switch(formElement.type){
        
        case 'paper-input':
          var path = this.bowerPath + 'paper-input/paper-input.html';
          var elementHandler = this.paperInputHandler().bind(this);
          break;
        case 'paper-textarea':
          var path = this.bowerPath + 'paper-input/paper-textarea.html';
          var elementHandler = this.paperInputHandler().bind(this);
          break;
        case 'paper-checkbox':
          var path = this.bowerPath + 'paper-checkbox/paper-checkbox.html';
          var elementHandler = this.paperCheckboxHandler().bind(this);
          break;
        case 'paper-radio-group':
          var path = this.bowerPath + 'paper-radio-group/paper-radio-group.html';
          var elementHandler = this.paperRadioHandler().bind(this);
          break;
        }

        this.importHref(path, function(e) {
          elementHandler(formElement);
        }, function(e) {
          console.log(e);
        });
    },

    dataObserver: function(data){
      var formElements = data.items;
      var i = 0, l = formElements.length;
      for(i;i<l;i++){
        this.importComponent(formElements[i]);
      }
    }
});