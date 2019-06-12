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

	wp.data.dispatch( 'block-styles' ).fetchBlockStyles().then( myStyles => {

		const blockTypes = select( 'core/blocks' ).getBlockTypes();

		blockTypes.map( blockType => {
			let blockStyles = select( 'core/blocks' ).getBlockStyles( blockType.name );
			const styles = blockType.styles;

			if ( ! myStyles[blockType.name] || ! myStyles[blockType.name].length ) {
				dispatch( 'block-styles' ).addBlockStyle( blockType.name, {
					name: 'custom',
					label: 'Custom',
					isDefault: true,
					attributes: {}
				} );
			}
		});
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
