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
      var elementType = formElement.polymerElement.parent;
      var newElement = document.createElement(formElement.polymerElement.child);
      return Polymer.dom(this.$.form).appendChild(newElement);
    },

    findElements: function(elements){
      var arrItems = Polymer.dom(this.$.form).querySelectorAll(elements);
      return arrItems;
    },

    findLastElement: function(element){
      var arrElements = this.findElements(element);
      return arrElements[arrElements.length -1];
    },

    addTextToElement: function(text){
      var span = document.createElement('span');
      Polymer.dom(span).innerHTML = ' ' + text;
      return Polymer.dom(this.$.form).appendChild(span);
    },

    addBr: function(){
      var br = document.createElement('br');
      return Polymer.dom(this.$.form).appendChild(br);
    },

    paperInputHandler: function(formElement){
      var newElement = this.appendElement(formElement);
      newElement.label = formElement.label;
      newElement.name = formElement.inputName;
      this.addBr();
      return newElement;
    },

    paperRadioHandler: function(formElement){
      var options = formElement.options;
      var elementType = formElement.polymerElement.parent;
      var arrElement = [];
      var i = 0, l = options.length;
      for(i;i<l;i++){
        var newElement = this.appendElement(formElement);
        newElement.name = formElement.inputName;
        arrElement.push(newElement);
        this.addTextToElement(formElement.options[i].name);
        this.addBr();
      }
      return arrElement;
    },

    elementHandler: function(formElement){
      switch(formElement.polymerElement.parent){
        case 'paper-input':
          this.paperInputHandler(formElement);
          break;
        case 'paper-checkbox':
          this.paperRadioHandler(formElement);
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