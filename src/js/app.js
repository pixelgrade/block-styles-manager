import '../scss/style.scss';
import './store';

import BlockStylesList from './components/block-styles-list';

const { __ } = wp.i18n;

const {
	registerPlugin
} = wp.plugins;

const {
	registerBlockType
} = wp.blocks;

const {
	PluginSidebar
} = wp.editPost;

const {
	InspectorControls
} = wp.blockEditor;

const {
	registerBlockStyle,
	unregisterBlockStyle,
} = wp.blocks;

const {
	dispatch,
	select
} = wp.data;

wp.domReady( () => {

	wp.data.dispatch( 'block-styles' ).fetchBlockStyles().then( () => {
		const myStyles = select( 'block-styles' ).getBlockStyles();
		console.log( myStyles );
		const blockTypes = select( 'core/blocks' ).getBlockTypes();

		if ( myStyles && blockTypes ) {
			blockTypes.map( blockType => {
				const blockStyles = myStyles[blockType.name];
				const styles = blockType.styles;

				if ( ! blockStyles || ! blockStyles.length ) {
					dispatch( 'block-styles' ).addBlockStyle( blockType.name, {
						name: 'custom',
						label: 'Custom',
						isDefault: true,
						attributes: {}
					} );
				}
			});
		}
	});
} );

registerPlugin( 'block-style-manager-sidebar', {


	render() {

		return (
			<PluginSidebar
				name="block-styles-manager"
				title="Block Styles Manager">
				<BlockStylesList />
				<InspectorControls.Slot />
			</PluginSidebar>
		)
	}
} );
