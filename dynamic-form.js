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
        this.importComponent(formElements[i].type);
      }
    },

    importComponent: function(element){
      var path = this.bowerPath + element + '/' + element + '.html';
      this.importHref(path, function(e) {
        console.log('IMPORTED',e.path[0].href);
        this.AppendElement(element);
      }, function(e) {
        console.log('ERROR',e);
      });
    },

    AppendElement: function(element){
      var container = this.$.container;
      var newElement = document.createElement(element);
      Polymer.dom(container).appendChild(newElement);

    },

    mockLoaded: function(response){
      this.dataHandler(response.detail);
    },

    mockFailed: function(data){
      this.title = 'ERROR!';
    },

    dataHandler: function(data){
      this.items = data.items;
      var i = 0, l = this.items.length;
      for(i;i<l;i++){
        console.log(this.items[i].title);
      }
    }

});