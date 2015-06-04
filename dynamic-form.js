Polymer({
    
    is: "dynamic-form",
    
    properties: {
      
      items: {
        type: Array
      },
      
      data : {
        type: Object,
        observer: 'dataObserver'
      },

      bowerPath: {
        type: String,
        value: '../../../bower_components/'
      } 
    },

    dataObserver: function(data){
      var formElements = data.items;
      var i = 0, l = formElements.length;
      for(i;i<l;i++){
        this.importComponent(formElements[i]);
      }
    },

    importComponent: function(formElement){
      var path = this.bowerPath + formElement.polymerElement.parent + '/' + formElement.polymerElement.child + '.html';
      this.importHref(path, function(e) {
        this.elementHandler(formElement);
      }, function(e) {
        console.log(e);
      });
    },

    elementHandler: function(formElement){
      switch(formElement.polymerElement.parent){
        case 'paper-input':
          this.paperInputHandler(formElement);
          break;
        case 'paper-radio-button':
          this.paperRadioHandler(formElement);
        }
    },

    appendElement: function(formElement){
      var container = this.$.form;
      var elementType = formElement.polymerElement.parent;
      var newElement = document.createElement(formElement.polymerElement.child);
      return Polymer.dom(container).appendChild(newElement);
    },

    paperInputHandler: function(formElement){
      var newElement = this.appendElement(formElement);
      newElement.label = formElement.label;
      newElement.name = formElement.inputName;
    },

    paperRadioHandler: function(formElement){
      var options = formElement.options;
      var i = 0, l = options.length;
      for(i;i<l;i++){
        var newElement = this.appendElement(formElement);
        newElement.name = formElement.inputName;
      }
    },
});