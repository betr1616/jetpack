/**
 * WordPress dependencies
 */
import { BlockIcon, InspectorControls, URLInput } from '@wordpress/block-editor';
import {
	Button,
	ColorPicker,
	ExternalLink,
	Notice,
	PanelBody,
	Placeholder,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import icon from './icon';

const getNewAttributesFromSrc = src => {
	const attributes = {};
	const url = new URL( src );
	attributes.url = url.origin + url.pathname;

	if ( ! url.search ) {
		return attributes;
	}

	const searchParams = new URLSearchParams( url.search );
	if ( searchParams.get( 'hide_event_type_details' ) ) {
		attributes.hideEventTypeDetails = searchParams.get( 'hide_event_type_details' );
	}

	if ( searchParams.get( 'background_color' ) ) {
		attributes.backgroundColor = searchParams.get( 'background_color' );
	}

	if ( searchParams.get( 'primary_color' ) ) {
		attributes.primary_color = searchParams.get( 'primary_color' );
	}

	if ( searchParams.get( 'text_color' ) ) {
		attributes.text_color = searchParams.get( 'text_color' );
	}

	return attributes;
};

export default function CalendlyEdit( {
	attributes: { backgroundColor, hideEventTypeDetails, primaryColor, textColor, url },
	className,
	setAttributes,
} ) {
	const [ embedCode, setEmbedCode ] = useState();
	const [ notice, setNotice ] = useState();

	const setErrorNotice = () =>
		setNotice(
			<>
				<strong>{ __( 'We ran into an issue', 'jetpack' ) }</strong>
				<br />
				{ __( 'Please ensure this embed matches the one from your Calendly account', 'jetpack' ) }
			</>
		);

	const parseEmbedCode = event => {
		if ( ! event ) {
			setErrorNotice();
			return;
		}

		event.preventDefault();

		if ( ! embedCode ) {
			setErrorNotice();
			return;
		}

		let src;
		if ( embedCode.indexOf( 'http' ) === 0 ) {
			src = embedCode;
		} else {
			const scriptTagAttributes = embedCode.match( / *data-url *= *["']?([^"']*)/i );
			if ( ! scriptTagAttributes || ! scriptTagAttributes[ 1 ] ) {
				setErrorNotice();
				return;
			}

			if ( scriptTagAttributes[ 1 ].indexOf( 'http' ) === 0 ) {
				src = scriptTagAttributes[ 1 ];
			}
		}

		setAttributes( getNewAttributesFromSrc( src ) );
	};

	const embedCodeForm = (
		<form onSubmit={ parseEmbedCode }>
			<TextareaControl
				onChange={ value => setEmbedCode( value ) }
				placeholder={ __( 'Paste your Calendly URL or embed code or here…' ) }
			>
				{ embedCode }
			</TextareaControl>
			<div>
				<Button isLarge type="submit">
					{ _x( 'Embed', 'button label', 'jetpack' ) }
				</Button>
			</div>
			<p>
				<ExternalLink
					href="https://help.calendly.com/hc/en-us/articles/223147027-Embed-options-overview"
					target="_blank"
				>
					{ __( 'Need help finding your embed code?' ) }
				</ExternalLink>
			</p>
		</form>
	);

	const blockPlaceholder = (
		<Placeholder
			label={ __( 'Calendly', 'jetpack' ) }
			icon={ <BlockIcon icon={ icon } /> }
			notices={
				notice && (
					<Notice status="error" isDismissible={ false }>
						{ notice }
					</Notice>
				)
			}
		>
			{ embedCodeForm }
		</Placeholder>
	);

	const iframeSrc = () => {
		let src =
			'https://calendly.com/scruffian/usability-test?embed_domain=scruffian.com&amp;embed_type=Inline';
		src += '&amp;hide_event_type_details=' + ( hideEventTypeDetails ? 1 : 0 );
		src += '&amp;background_color=' + backgroundColor;
		src += '&amp;primary_color=' + primaryColor;
		src += '&amp;text_color=' + textColor;
		return src;
	};

	const preview = (
		<>
			<div className={ `${ className }-overlay` }></div>
			<iframe
				src={ iframeSrc() }
				width="100%"
				height="100%"
				frameborder="0"
				data-origwidth="100%"
				data-origheight="100%"
				style={ { minWidth: '320px', height: '630px', width: '100%' } }
				title="Calendly"
			></iframe>
		</>
	);

	const inspectorControls = (
		<InspectorControls>
			{ url && (
				<PanelBody title={ __( 'Settings', 'jetpack' ) }>
					<ToggleControl
						label={ __( 'Hide Event Type Details', 'jetpack' ) }
						checked={ hideEventTypeDetails }
						onChange={ () => setAttributes( { hideEventTypeDetails: ! hideEventTypeDetails } ) }
					/>
				</PanelBody>
			) }
			{ url && (
				<PanelBody title={ __( 'Background Color', 'jetpack' ) } initialOpen={ false }>
					<ColorPicker
						color={ backgroundColor }
						onChangeComplete={ newBackgroundColor =>
							setAttributes( { backgroundColor: newBackgroundColor.hex.substr( 1 ) } )
						}
						disableAlpha
					/>
				</PanelBody>
			) }
			{ url && (
				<PanelBody title={ __( 'Primary Color', 'jetpack' ) } initialOpen={ false }>
					<ColorPicker
						color={ primaryColor }
						onChangeComplete={ newPrimaryColor =>
							setAttributes( { primaryColor: newPrimaryColor.hex.substr( 1 ) } )
						}
						disableAlpha
					/>
				</PanelBody>
			) }
			{ url && (
				<PanelBody title={ __( 'Text Color', 'jetpack' ) } initialOpen={ false }>
					<ColorPicker
						color={ textColor }
						onChangeComplete={ newTextColor =>
							setAttributes( { textColor: newTextColor.hex.substr( 1 ) } )
						}
						disableAlpha
					/>
				</PanelBody>
			) }
			<PanelBody title={ __( 'Embed code', 'jetpack' ) } initialOpen={ false }>
				{ embedCodeForm }
			</PanelBody>
		</InspectorControls>
	);

	return (
		<>
			{ inspectorControls }
			{ url ? preview : blockPlaceholder }
		</>
	);
}
