const {
	registerStore
} = wp.data;

const {
	registerBlockStyle,
	unregisterBlockStyle,
} = wp.blocks;

const reducer = ( state = {}, { type, data } ) => {

	if ( type === 'ADD_BLOCK_STYLE' ) {

		if ( typeof state[ data.blockType ] === "undefined" ) {
			state[ data.blockType ] = {};
		}

		state[ data.blockType ][ data.blockStyle.name ] = {
			label: data.blockStyle.label,
			isDefault: data.blockStyle.isDefault,
			attributes: data.attributes
		};

//		registerBlockStyle( data.blockType, data.blockStyle );

		return state;
	}

	return state;
}

// These are some selectors
function getBlockStyles( state, blockType ) {
	return state[ blockType ];
}

// These are the actions
function addBlockStyle( blockType, blockStyle, attributes ) {
	return {
		type: 'ADD_BLOCK_STYLE',
		data: { blockType, blockStyle, attributes }
	};
}

registerStore( 'block-styles', {
	reducer,
	selectors: { getBlockStyles: getBlockStyles },
	actions: { addBlockStyle: addBlockStyle }
} );

// Add a new todo item
//wp.data.dispatch( 'block-styles' ).addBlockStyle( 'Finish writing a blog post about the data module', false );

// Retrieve the list of todos
//var countTodos = wp.data.select( 'block-styles' ).getBlockStyles();