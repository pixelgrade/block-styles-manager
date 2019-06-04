const {
	registerStore
} = wp.data;

const {
	registerBlockStyle,
	unregisterBlockStyle,
} = wp.blocks;

const reducer = ( state = {}, action ) => {
	switch ( action.type ) {
		case 'ADD_BLOCK_STYLE':

			const newState = Object.assign( {}, state );

			if ( typeof newState[ action.data.blockType ] === "undefined" ) {
				newState[ action.data.blockType ] = {};
			}

			newState[ action.data.blockType ][ action.data.blockStyle.name ] = {
				label: action.data.blockStyle.label,
				isDefault: action.data.blockStyle.isDefault || false,
				attributes: action.data.attributes
			};

			return newState;
	}

	return state;
}

const actions = {


	addBlockStyle( blockType, blockStyle, attributes, register = true ) {

		if ( register ) {
			registerBlockStyle( blockType, blockStyle );
		}

		return {
			type: 'ADD_BLOCK_STYLE',
			data: { blockType, blockStyle, attributes }
		};
	}
}

const selectors = {
	getBlockStyles( state ) {
		return state;
	}
}

registerStore( 'block-styles', {
	reducer,
	selectors,
	actions
} );

// Add a new todo item
//wp.data.dispatch( 'block-styles' ).addBlockStyle( 'Finish writing a blog post about the data module', false );

// Retrieve the list of todos
//var countTodos = wp.data.select( 'block-styles' ).getBlockStyles();