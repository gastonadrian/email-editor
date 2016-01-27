function constants(angular, app, options, _){
	'use strict';

	var defaultOptions = {
		sessionKey: null,
		hasSocialMediaEnabled: false,
		maxFileSize: 5 * 1048576,  // 5 MB
		editorDefinitions: {
            TextOnlyEditor: 'text',
            ImageEditor: 'image'
        },
        contentBlockEvents: {
            Reordered: 'Content Blocks Reordered',
            Deleted: 'Content Block Deleted',
            Created: 'Content Block Created'
        },
        canvasClass: 'layoutTable',
        droppableContentBlockClass: 'droppableContentBlock',
        contentBlockClass: 'editorContentBlock',
        editorHtmlContainerId: 'editorCanvas',
        overlayClass: 'ui-widget-overlay',
        imageEditorModal: 'imageEditorModal',
        overlayMenuBarClass: 'contentBlockHoverMenuBar',
        contentBlockDefaultValue: 'editor-default-value',
        multiColumnClass: 'multiColumn',
		onEditorContentChangeMessage: 'OnEditorContentChange',
		storageEditorContentKey: 'EditorContent',
        defaultValueText: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam, magni natus voluptas vero sit nesciunt consequatur eveniet iure tempora ex! Quas iure mollitia aut aspernatur. Voluptas non harum reiciendis vel? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, nobis, at, accusamus cumque sit laboriosam non voluptatibus totam iste fugit earum harum nam voluptates officiis et laudantium rem dolorem minus!</p>',
        autoSaveFrequency: 180000,
        allowedHtml: null,
        debug: false,
        loaded: false
	};

	_.extend(defaultOptions, options);

	app.constant('constants', defaultOptions);
    // console.log('constants', defaultOptions);
}

module.exports = constants;