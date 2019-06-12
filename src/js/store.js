import { combineReducers, createStore, applyMiddleware } from 'redux';
import createMiddleware from '@wordpress/redux-routine';

const {
	registerStore,
	registerGenericStore
} = wp.data;

const {
	registerBlockStyle,
	unregisterBlockStyle,
} = wp.blocks;

const reducer = ( state = {}, action ) => {
	const newState = Object.assign( {}, state );

	switch ( action.type ) {

		case 'ADD_BLOCK_STYLE':

			if ( typeof newState[ action.data.blockType ] === "undefined" ) {
				newState[ action.data.blockType ] = {};
			}

			const { name, label, isDefault, attributes } = action.data.blockStyle;

			newState[ action.data.blockType ][ action.data.blockStyle.name ] = {
				name,
				label,
				isDefault: isDefault || false,
				attributes
			};

			return newState;

		case 'UPDATE_BLOCK_STYLE':
			newState[ action.data.blockType ][ action.data.blockStyleName ] = action.data.blockStyle;
			return newState;

		case 'DELETE_BLOCK_STYLE':
			delete newState[ action.data.blockType ][ action.data.blockStyleName ];
			return newState;

		case 'UPDATE_ALL_BLOCK_STYLES':
			console.log( action.data.blockStyles );
			return action.data.blockStyles
	}

	return newState;
}

const actions = {

	* addBlockStyle( blockType, blockStyle, attributes, register = true ) {

		if ( register ) {
			registerBlockStyle( blockType, blockStyle );
		}

		return {
			type: 'ADD_BLOCK_STYLE',
			data: { blockType, blockStyle, attributes }
		};
	},

	* updateBlockStyle( blockType, blockStyleName, blockStyle ) {
		return {
			type: 'UPDATE_BLOCK_STYLE',
			data: { blockType, blockStyleName, blockStyle }
		}
	},

	* deleteBlockStyle( blockType, blockStyleName ) {
		return {
			type: 'DELETE_BLOCK_STYLE',
			data: { blockType, blockStyleName }
		}
	},

	* fetchBlockStyles() {

		const blockStyles = yield {
			type: 'FETCH_DATA',
			url: 'block-styles/v1/styles'
		};

		return {
			type: 'UPDATE_ALL_BLOCK_STYLES',
			data: { blockStyles }
		};
	},

	* updateAllBlockStyles( blockStyles ) {
		return {
			type: 'UPDATE_ALL_BLOCK_STYLES',
			data: { blockStyles }
		}
	},
}

const selectors = {
	getBlockStyles( state ) {
		return state;
	}
};

const middleware = createMiddleware( {
	async FETCH_DATA( action ) {
		const response = await wp.apiFetch({ path: action.url });
		return response;
	},
} );

const reduxStore = createStore( reducer, applyMiddleware( middleware ) );

const mappedSelectors = Object.keys( selectors ).reduce( ( acc, selectorKey ) => {
	acc[ selectorKey ] = ( ...args ) => {
		console.log( reduxStore.getState() );
		return selectors[ selectorKey ]( reduxStore.getState(), ...args );
	}
	return acc;
}, {} );


const mappedActions = Object.keys( actions ).reduce( ( acc, actionKey ) => {
	acc[ actionKey ] = ( ...args ) => reduxStore.dispatch( actions[ actionKey ]( ...args ) );
	return acc;
}, {} );


const genericStore = {
	getSelectors() { return mappedSelectors },
	getActions() { return mappedActions },
	subscribe: reduxStore.subscribe,
};

registerGenericStore( 'block-styles', genericStore );

// Add a new todo item
//wp.data.dispatch( 'block-styles' ).addBlockStyle( 'Finish writing a blog post about the data module', false );

// Retrieve the list of todos
//var countTodos = wp.data.select( 'block-styles' ).getBlockStyles();
