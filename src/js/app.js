import '../scss/style.scss';
import './store';

const {
	registerPlugin
} = wp.plugins;

const {
	PanelBody,
} = wp.components;

const {
	Fragment
} = wp.element;

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
	subscribe,
	select,
	withSelect
} = wp.data;

wp.domReady( () => {
	const blockTypes = select( 'core/blocks' ).getBlockTypes();

	blockTypes.map( blockType => {
		let blockStyles = select( 'core/blocks' ).getBlockStyles( blockType.name );
		const styles = blockType.styles;

		dispatch( 'block-styles' ).addBlockStyle( blockType.name, {
			name: 'custom',
			label: 'Custom',
			isDefault: true
		}, {} );
	} );
} );

function BlockStylesList( props ) {
	return (
		<div>
			{ Object.keys( props.blockStyles, blockStyleName => {
				return <div>{blockStyleName}</div>
			} ) }
		</div>
	);
}

function mapSelectToProps( select ) {
	const { getBlockStyles } = select( 'block-styles' );
	const selectedBlock = select( 'core/editor' ).getSelectedBlock();
	console.log( 'changed' );
	return {
		blockStyles: getBlockStyles( selectedBlock.name )
	}
}

const BlockStylesListWithSelect = withSelect( mapSelectToProps )( BlockStylesList );

registerPlugin( 'block-style-manager-sidebar', {
	render() {

		return (
			<PluginSidebar>
				<BlockStylesListWithSelect />
				<InspectorControls.Slot />
			</PluginSidebar>
		)
	}
} );