function editorActionsServiceWrapper(angular, app) {
	'use strict';


	app.factory('editorActionsService', editorActionsService);

	editorActionsService.$inject = ['constants','values', '$q', '$http', 'messageService'];

	function editorActionsService(constants, values, $q, $http, messageService){

    function getBrowserCollection() {
				var collection = JSON.parse(localStorage.getItem(constants.storageEditorContentKey));
				console.log('GETTING FROM LS', collection);
        return collection;
    }

    function saveBrowserCollection(collection) {
        localStorage.setItem(constants.storageEditorContentKey, JSON.stringify(collection));
    }

    function saveChanges(change) {
      // modification to save
      var actionDescriptor = {
        description: change.actionType,
        editorInstanceId: change.target,
        contentBlockId: change.contentBlockId,
        previousValue: change.previousValue,
        currentValue: change.currentValue
      };
      console.log('ACTION', actionDescriptor);

      // default collection data
      var collectionStructure = {
          currentIndex: -1,
          history: []
      };

      // get collection
      var collection = getBrowserCollection() || collectionStructure;
      console.log('COLLECTION', collection);

      // remove "redoable" actions if some new change is made
      if (collection.currentIndex < (collection.history.length - 1)) {
          for (var i = collection.currentIndex; i < collection.history.length; i++) {
              collection.history.pop();
          }
      }

      // append to collection
      collection.history.push(actionDescriptor);
      collection.currentIndex = collection.history.length - 1;
      console.log('COLLECTION AFTER CHANGE', collection);

      // save
      saveBrowserCollection(collection);
    }

		function saveUndo(){
      var collection = getBrowserCollection();

			return collection.history[collection.history.length - 1];
		}

    function saveRedo(){
			console.log('save redo');
		}

		return {
      saveChanges:saveChanges,
			saveUndo:saveUndo,
      saveRedo:saveRedo
		};
	}
}

module.exports = editorActionsServiceWrapper;
