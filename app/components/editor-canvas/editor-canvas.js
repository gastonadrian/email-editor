function editorCanvasDirective(angular, app) {
	'use strict';

	'use angular template'; //jshint ignore:line

	app.directive('editorCanvas', editorCanvasDirective);

	editorCanvasDirective.$inject = ['$log', '_','$compile', '$timeout','$window', 'constants','values'];

	/**
	* @name app.directive: editorCanvas
	*
	* @description
	*  Drag and drop email editor
	*
	* @example
	<editor-canvas>
	</editor-canvas>
	 */
	function editorCanvasDirective($log, _,compile, timeout, $window, constants, values){

		return {
			restrict:'E',
			link: link,
			template: '<div id="editor-canvas" data-ng-transclude="true"></div>',
			transclude:true,
			replace:true,
			scope: {
				'getMessage':'&',
				'onContentDropped':'&',
				'undoRedoPromise':'=',
				'performUndoRedo':'=',
				'layoutChangedPromise': '='
			}
		};


		function link(scope, element, attributes, ctrl){

			scope.dragging = false;

			var didScroll = false,
				sortableArea,
				dropHereTemplate = $('#viewTemplates .drop-here');
		    // scope.disableOverlays = false;

			element = $(element);


			init();

    		function init(){

				scope.performUndoRedo.promise.then(null, null, function(actionDescriptor){
					console.log('action promise', actionDescriptor);
					// ONLY IF UNDO. TODO: REDO FUNCTIONALITY
					if(actionDescriptor.description === 'remove') {
						// create and append the new content block
						var removedContentBlockHtml = actionDescriptor.previousValue;
						var newContentBlock = $.parseHTML(removedContentBlockHtml);
						element.append(newContentBlock);

						// get the initial position
						var initialIndex = {
								position: element.find('.' + constants.contentBlockClass).index(newContentBlock),
								value: newContentBlock
						};

						// move the contentblock to the position before delete
						alterContentBlockPosition(initialIndex, actionDescriptor.CurrentValue);
					}

				});

				scope.layoutChangedPromise.promise.then(null, null, function onLayoutChanged(){
					setupMessage();
				});

				setupMessage();
			}

			/**
			 * Gets the html message and setups drag and drop features
			 * @return {[type]} [description]
			 */
			function setupMessage(){
				scope.getMessage()
					.then(onGetMessage)
					.then(setupDroppableArea);
			}

			/**
			 * @name alterContentBlockPosition
			 * @description Organizes content block positions for undo/redo
			 */
			function alterContentBlockPosition(currentIndex, destinationIndex) {
					var movedContent = element.find('.' + constants.contentBlockClass + ':eq(' + currentIndex.position + ')');
					var elementInDestinationIndex = element.find('.' + constants.contentBlockClass + ':eq(' + destinationIndex.position + ')');

					if (currentIndex.position > destinationIndex.position) {
							movedContent.insertBefore(elementInDestinationIndex);
					} else {
							movedContent.insertAfter(elementInDestinationIndex);
					}
			}

        	/**
        	 * @name setupDroppableArea
        	 * @description Setups editor canvas as a jQuery sortable area
        	 * where contenblocks can be dropped
        	 */
        	function setupDroppableArea(){

		        // make the body of the mail able to receive draggable elements
    		    element.find('.' + constants.canvasClass).sortable({
  		        axis: 'y',
			        cursor: 'url("/images/closedhand.cur"), default',
			        items: 'tr > td > .row.' + constants.contentBlockClass,
			        handle: '.drag',
			        containment: '#layoutContainer',
			        revert: false,
			        refreshPositions: true,
			        tolerance: 'intersect',
			        start: onDropStart,
			        stop: onDropStop,
			        update: onDropUpdate
						});
        	}

		    /**
		     * @description Compiles email html and append it to canvas
		     * @param  {String} response - Html of the message
		     */
			function onGetMessage(response){
				var layoutHtml = compile(response)(scope),
        			dropHere = dropHereTemplate.clone();

        		element.html(layoutHtml);
        		element.find('.' + constants.canvasClass + '> tbody > tr > td').prepend(dropHere);
        		dropHere.droppable(values.droppableOptions);
			}

			function onDropStart(e, ui){
				element.addClass('dragging');
				sortableArea = sortableArea || element.find('.ui-sortable');

            	// disable overlays
	            // scope.disableOverlays = true;
	            // element.addClass('hideOverlays');

	            // if (!ui.item.hasClass(configuration.draggableContentBlockClass)) {
	            //     // if sortable starts with a content block
	            //     scope.dragStartPosition = {
	            //         position: element.find('.' + configuration.contentBlockClass).index(ui.item),
	            //         value: $.fn.outerHTML(ui.item)
	            //     };
	            // }
			}

			function onDropStop(e, ui){
				element.removeClass('dragging');

				// rootScope.safeApply(function () {
				// scope.disableOverlays = false;
				// });

				// element.removeClass('hideOverlays');
			}

			function onDropUpdate(e, ui) {
				var change;

				element.removeClass('dragging');
		        // this event is triggered in two occasions,
		        // 1) when we sort the content blocks inside the editor (prevent to pub the changed event -this is done on the drop stop event-)
		        // 2) when we drop a layout content block
		        if (ui.item.hasClass(constants.draggableContentBlockClass)) {
								//create the content block
								var cb = $(ui.item.find('> div').data('droppedHtml'));
								ui.item.replaceWith(cb);
								compileContentBlock(cb);

								change = { actionType: 'add', target: 1, contentBlockId: cb.data('id'), previousValue: '', currentValue: $.fn.outerHTML(cb), position: element.find('.' + constants.contentBlockClass).index(cb) };
								scope.undoRedoPromise.notify(change);
		        } else {
		            // sort
		            var id = ui.item.data('id');

		            if(ui.item.next().hasClass('drop-here')){
		            	ui.item.next().insertBefore(ui.item);
		            }

		            var dropHere = element.find('.drop-here[data-content-block='+ id +']');
		            dropHere.insertAfter(ui.item);

								change = { actionType: 'sort', target: 1, contentBlockId: id, position: element.find('.' + constants.contentBlockClass).index(ui.item) };
								scope.undoRedoPromise.notify(change);
		    	}
    		}

			/**
			 * @description compiles the html of a content block to a content block directive
			 * @param  {[type]}
			 * @param  {[type]}
			 * @return {[type]}
			 */
			function compileContentBlock(contentBlock, attrs) {
			    attrs = attrs || {};
			    var contentBlockElement = $(contentBlock);
			    //contentBlockElement.addClass(constants.contentBlockClass).attr(attrs);

			    return compile(contentBlockElement)(scope);
			}

		}
	}
}

module.exports = editorCanvasDirective;
