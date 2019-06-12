import uuid from 'uuid/v1';

const { __ } = wp.i18n;

const {
	Component,
	Fragment,
} = wp.element;

const {
	PanelBody
} = wp.components;

const {
	compose
} = wp.compose;

const {
	dispatch,
	withDispatch,
	select,
	withSelect,
} = wp.data;

const {
	Button,
	ButtonGroup,
	TextControl,
} = wp.components;

function replaceActiveStyle( className, activeStyle, newStyle ) {
	const list = new wp.tokenList( className );

	if ( activeStyle ) {
		list.remove( 'is-style-' + activeStyle.name );
	}

	list.add( 'is-style-' + newStyle.name );

	return list.value;
}

const removeAttributes = ( attributes, attributesToRemove = [] ) => {
	const newAttributes = {};
	const newAttributesArray = Object.keys( attributes ).filter( attribute => {
		return attributesToRemove.indexOf( attribute ) === -1;
	} );

	newAttributesArray.map( attribute => {
		newAttributes[attribute] = attributes[attribute];
	} );

	return newAttributes;
}

const getBlockDefaultAttributes = ( blockName ) => {
	const attributes = {};
	const { getBlockType } = select( 'core/blocks' );

	Object.keys( getBlockType( blockName ).attributes ).filter( attribute => {
		return attribute !== 'content';
	} ).map( attribute => {
		attributes[attribute] = attribute.default;
	} );

	return attributes;
}

class BlockStylesList extends Component {

	render() {

		const {
			getActiveStyle,
			selectedBlock,
			blockStyles,
			className,
			onChangeStyle,
			updateStyle,
			selectedBlockStyles,
			selectedBlockStylesArray,
			activeStyle,
			deleteStyle,
			saveStyles
		} = this.props;

		const updateBlockActiveStyle = ( selectedBlock, style ) => {
			const styleName = style.name;
			const updatedClassName = replaceActiveStyle( className, activeStyle, style );
			const styleAttributes = blockStyles[selectedBlock.name][styleName].attributes;
			const newAttributes = styleName !== 'custom' ? removeAttributes( styleAttributes, ['content'] ) : {};

			const attributes = {
				...newAttributes,
				className: updatedClassName
			}

			onChangeStyle( selectedBlock, attributes );
		}

		return (
			<Fragment>
				{ selectedBlock && <Fragment>
				    <PanelBody>
						<div className="editor-block-styles block-editor-block-styles">
							{ selectedBlockStylesArray.map( blockStyle => {
								const classes = [ "block-editor-block-styles__item" ];
								const { className } = selectedBlock.attributes;
								if ( blockStyle.name === activeStyle.name ) {
									classes.push( 'is-active' );
								}

								const content = selectedBlock.attributes.content;
								const markup = wp.blocks.getBlockContent( selectedBlock );
								const previewMarkup = markup.replace( content, 'Aa' );

								return (
									<div className={ classes.join( ' ' ) } onClick={ () => { updateBlockActiveStyle( selectedBlock, blockStyle ) } } >
										<div className="editor-block-styles__item-preview block-editor-block-styles__item-preview">
											<span>Aa</span>
										</div>
										<div className="editor-block-styles__item-label block-editor-block-styles__item-label">
											{ blockStyle.label }
										</div>
									</div>
								)
							} ) }
							<div
								className="block-editor-block-styles__item  block-editor-block-styles__item--new"
								onClick={() => {
									const styleId = 'block-style-' + uuid();
									const newBlockStyle = {
										name: styleId,
										label: __( 'Untitled', '__plugin_txtd' ),
										isDefault: false,
										attributes: removeAttributes( selectedBlock.attributes, ['content'] )
									};
									dispatch( 'block-styles' ).addBlockStyle( selectedBlock.name, newBlockStyle ).then(() => {
										updateBlockActiveStyle( selectedBlock, newBlockStyle );
									});
								}}>
								<div className="editor-block-styles__item-preview block-editor-block-styles__item-preview"></div>
								<div className="editor-block-styles__item-label block-editor-block-styles__item-label">
									{ __( 'New Style', '__plugin_txtd' ) }
								</div>
							</div>
						</div>
					</PanelBody>
					<PanelBody>
					    <Button isLarge isPrimary onClick={ () => { saveStyles() } }>
						    { __( 'Save Styles', '__plugin_txtd' ) }
					    </Button>
					    <Button isLarge onClick={ () => {

						    const newBlockStyle = {
							    name: activeStyle.name,
							    label: activeStyle.label,
							    isDefault: activeStyle.default,
							    attributes: removeAttributes( selectedBlock.attributes, ['content'] )
						    };

					    	updateStyle( newBlockStyle );

					    } }>
						    { __( 'Update Style', '__plugin_txtd' ) }
					    </Button>
					    <Button isLarge isDanger onClick={ () => {
					    	deleteStyle( activeStyle );
					    } }>
						    { __( 'Delete Style', '__plugin_txtd' ) }
					    </Button>
					</PanelBody>
					{ activeStyle && <PanelBody title={ __( 'Edit Style', '__plugin_txtd' ) }>
						<TextControl
							label={ __( 'Style Label', '__plugin_txtd' ) }
							value={ activeStyle.label }
							onChange={ value => {
								updateStyle( selectedBlock.name, activeStyle.name, { ...activeStyle, label: value } )
							} }
						/>
					</PanelBody> }
				</Fragment> }
			</Fragment>
		);
	}
}

export default compose([
	withSelect( ( select, ownProps ) => {

		const blockStyles = select( 'block-styles' ).getBlockStyles();
		const selectedBlock = select( 'core/editor' ).getSelectedBlock();
		const className = selectedBlock ? selectedBlock.attributes.className : {};

		const selectedBlockStyles = selectedBlock && blockStyles[ selectedBlock.name ] || {};
		const selectedBlockStylesArray = Object.keys( selectedBlockStyles ).map(blockStyleName => {
			return selectedBlockStyles[ blockStyleName ];
		} );

		const getActiveStyle = className => {

			for ( const style of new wp.tokenList( className ).values() ) {
				if ( style.indexOf( 'is-style-' ) === -1 ) {
					continue;
				}

				const potentialStyleName = style.substring( 9 );
				const found = selectedBlockStylesArray.find( obj => {
					return obj.name === potentialStyleName;
				} );

				if ( found ) {
					return found;
				}
			}

			const custom = selectedBlockStylesArray.find( obj => {
				return obj.name === 'custom';
			} );

			return custom;
		}

		const filterAttributes = ( attributes ) => {
			const newAttributes = {};

			if ( activeStyle ) {
				Object.keys( attributes ).filter( attribute => {
					return attribute !== 'content';
				} ).map( attribute => {
					newAttributes[attribute] = attributes[attribute];
				} );
			}

			return newAttributes;
		}

		const activeStyle = getActiveStyle( className );

		if ( activeStyle && activeStyle.name !== 'custom' ) {
			const blockAttributes = filterAttributes( selectedBlock.attributes );
			const styleAttributes = filterAttributes( selectedBlockStyles[ activeStyle.name ].attributes );
		}

		function saveStyles() {
			return wp.apiFetch({
				method: 'POST',
				path: 'block-styles/v1/styles',
				data: { styles: blockStyles }
			}).then(response => {
			});
		}

		return {
			activeStyle,
			blockStyles,
			className,
			selectedBlock,
			selectedBlockStyles,
			selectedBlockStylesArray,
			getActiveStyle,
			saveStyles
		}
	} ),
	withDispatch( ( dispatch, props ) => {
		return {
			onChangeStyle( selectedBlock, attributes ) {
				console.log( attributes );
				dispatch( 'core/block-editor' ).updateBlockAttributes( selectedBlock.clientId, attributes );
			},
			deleteStyle( style ) {
				dispatch( 'block-styles' ).deleteBlockStyle( props.selectedBlock.name, style.name );
			},
			updateStyle( style ) {
				dispatch( 'block-styles' ).updateBlockStyle( props.selectedBlock.name, style.name, style );

				const myBlocks = wp.data.select( 'core/block-editor' ).getBlocks().map( block => {
					const { className } = block.attributes;
					if ( className && className.indexOf( 'is-style-' + props.activeStyle.name ) > -1 ) {
						dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, style.attributes );
					}
				} );
			}
		};
	} )
])( BlockStylesList );

