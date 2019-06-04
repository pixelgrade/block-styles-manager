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
	const blockTypes = select( 'core/blocks' ).getBlockTypes();

	blockTypes.map( blockType => {
		let blockStyles = select( 'core/blocks' ).getBlockStyles( blockType.name );
		const styles = blockType.styles;

		styles && styles.map( style => {
			console.log( blockType.name, style );

			dispatch( 'block-styles' ).addBlockStyle( blockType.name, style, {} );
		} );

		dispatch( 'block-styles' ).addBlockStyle( blockType.name, {
			name: 'custom',
			label: 'Custom',
			isDefault: true
		}, {} );
	} );
} );

registerPlugin( 'block-style-manager-sidebar', {
	render() {

		return (
			<PluginSidebar>
				<BlockStylesList />
			</PluginSidebar>
		)
	}
} );
