Polymer({
    
    is: "dynamic-form",
    
    properties: {
      
      data : {
        type: Object,
        observer: 'dataObserver'
      },

      bowerPath: {
        type: String,
        value: '../../../bower_components/'
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
      return newElement;
    },

    paperRadioHandler: function(formElement){
      var options = formElement.options;
      var arrElement = [];
      var i = 0, l = options.length;
      for(i;i<l;i++){
        var newElement = this.appendElement(formElement);
        newElement.name = formElement.inputName;
        arrElement.push(newElement);
      }
      return arrElement;
    },

    elementHandler: function(formElement){
      switch(formElement.polymerElement.parent){
        case 'paper-input':
          this.paperInputHandler(formElement);
          break;
        case 'paper-radio-button':
          this.paperRadioHandler(formElement);
          break;
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

    dataObserver: function(data){
      var formElements = data.items;
      var i = 0, l = formElements.length;
      for(i;i<l;i++){
        this.importComponent(formElements[i]);
      }
    }

});