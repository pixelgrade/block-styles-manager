const {
	Component
} = wp.element;

const {
	select,
	withSelect
} = wp.data;

function BlockStylesList( props ) {
	const selectedBlock = select( 'core/editor' ).getSelectedBlock();
	const blockStyles = selectedBlock && props.blockStyles[ selectedBlock.name ] || {};

	return (
		<div>
			{ Object.keys( blockStyles, blockStyleName => {
				return <div>{blockStyleName}</div>
			} ) }
		</div>
	);
}

const BlockStylesListWithSelect = withSelect( ( select, ownProps ) => {
	const { getBlockStyles } = select( 'block-styles' );

	return {
		blockStyles: getBlockStyles()
	}
} )( BlockStylesList );

export default BlockStylesListWithSelect;