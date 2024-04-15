import React from 'react';
import { ToggleDropdown } from '@brainstormforce/starter-templates-components';
import { __ } from '@wordpress/i18n';
import { useStateValue } from '../../../store/store';
import { initialState } from '../../../store/reducer';
const {
	imageDir,
	isBrizyEnabled,
	isElementorDisabled,
	isBeaverBuilderDisabled,
} = starterTemplates;

import { useDispatch } from '@wordpress/data';
const zipPlans = astraSitesVars?.zip_plans;
const sitesRemaining = zipPlans?.plan_data?.remaining;
const aiSitesRemainingCount = sitesRemaining?.ai_sites_count;
const allSitesRemainingCount = sitesRemaining?.all_sites_count;

const PageBuilder = () => {
	const [ { builder }, dispatch ] = useStateValue();
	const { setLimitExceedModal } = useDispatch( 'ast-block-templates' );

	if ( builder === 'fse' ) {
		return null;
	}

	const isLimitReached =
		( typeof aiSitesRemainingCount === 'number' &&
			aiSitesRemainingCount <= 0 ) ||
		( typeof allSitesRemainingCount === 'number' &&
			allSitesRemainingCount <= 0 );

	const buildersList = [
		{
			id: 'gutenberg',
			title: __( 'Block Editor', 'astra-sites' ),
			image: `${ imageDir }block-editor.svg`,
		},
		{
			id: 'elementor',
			title: __( 'Elementor', 'astra-sites' ),
			image: `${ imageDir }elementor.svg`,
		},
		{
			id: 'beaver-builder',
			title: __( 'Beaver Builder', 'astra-sites' ),
			image: `${ imageDir }beaver-builder.svg`,
		},
		{
			id: 'ai-builder',
			title: __( 'AI Website Builder', 'astra-sites' ),
			image: `${ imageDir }ai-builder.svg`,
		},
	];

	if ( isBrizyEnabled === '1' ) {
		buildersList.push( {
			id: 'brizy',
			title: __( 'Brizy', 'astra-sites' ),
			image: `${ imageDir }brizy.svg`,
		} );
	}

	if ( isElementorDisabled === '1' ) {
		// Find the index of the Elementor builder in the array.
		const indexToRemove = buildersList.findIndex(
			( pageBuilder ) => pageBuilder.id === 'elementor'
		);

		// Remove the Elementor builder if it exists.
		if ( indexToRemove !== -1 ) {
			buildersList.splice( indexToRemove, 1 );
		}
	}

	if ( isBeaverBuilderDisabled === '1' ) {
		// Find the index of the Beaver builder in the array.
		const indexToRemove = buildersList.findIndex(
			( pageBuilder ) => pageBuilder.id === 'beaver-builder'
		);

		// Remove the Beaver builder if it exists.
		if ( indexToRemove !== -1 ) {
			buildersList.splice( indexToRemove, 1 );
		}
	}

	return (
		<div className="st-page-builder-filter">
			<ToggleDropdown
				value={ builder }
				options={ buildersList }
				className="st-page-builder-toggle"
				onClick={ ( event, option ) => {
					if ( 'ai-builder' === option.id ) {
						if ( isLimitReached ) {
							setLimitExceedModal( {
								open: true,
							} );
							// dispatch( {
							// 	type: 'set',
							// 	currentIndex: 0,
							// } );
						}
						dispatch( {
							type: 'set',
							currentIndex: 1,
							builder: option.id,
						} );
					} else {
						dispatch( {
							type: 'set',
							builder: option.id,
							siteSearchTerm: '',
							siteBusinessType: initialState.siteBusinessType,
							selectedMegaMenu: initialState.selectedMegaMenu,
							siteType: '',
							siteOrder: 'popular',
							onMyFavorite: false,
							currentIndex: 4,
						} );
					}

					const pageBuilderOptionId =
						isLimitReached && 'ai-builder' === option.id
							? 'gutenberg'
							: option.id;
					const content = new FormData();
					content.append(
						'action',
						'astra-sites-change-page-builder'
					);
					content.append( '_ajax_nonce', astraSitesVars._ajax_nonce );
					content.append( 'page_builder', pageBuilderOptionId );

					fetch( ajaxurl, {
						method: 'post',
						body: content,
					} );
				} }
			/>
		</div>
	);
};

export default PageBuilder;
