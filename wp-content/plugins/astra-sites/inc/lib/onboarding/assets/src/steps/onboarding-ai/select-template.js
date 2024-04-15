import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import { withDispatch, useSelect, useDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import apiFetch from '@wordpress/api-fetch';
import NavigationButtons from './navigation-buttons';
import { classNames, toastBody } from './helpers';
import { STORE_KEY } from './store';
import { ColumnItem } from './components/column-item';
import Input from './components/input';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { useDebounce } from './hooks/use-debounce';
import ColumnSkeleton from './components/column-skeleton';
import {
	clearSessionStorage,
	getFromSessionStorage,
	setToSessionStorage,
} from './utils/helpers';

export const USER_KEYWORD = 'st-template-search';

const SelectTemplate = ( { onClickPrevious } ) => {
	const {
		setWebsiteTemplatesAIStep,
		setWebsiteSelectedTemplateAIStep,
		setWebsiteTemplateSearchResultsAIStep,
	} = useDispatch( STORE_KEY );

	const {
		stepsData: {
			businessName,
			businessType,
			templateSearchResults,
			templateKeywords: keywords = [],
		},
	} = useSelect( ( select ) => {
		const { getAIStepData, getAllPatternsCategories, getOnboardingAI } =
			select( STORE_KEY );

		const onboardingAI = getOnboardingAI();

		return {
			stepsData: getAIStepData(),
			allPatternsCategories: getAllPatternsCategories(),
			isNewUser: onboardingAI?.isNewUser,
		};
	} );

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setFocus,
		watch,
		getValues,
	} = useForm( {
		defaultValues: {
			keyword:
				getFromSessionStorage( USER_KEYWORD ) ??
				keywords?.join( ', ' ) ??
				'',
		},
	} );
	const watchedKeyword = watch( 'keyword' );
	const debouncedKeyword = useDebounce( watchedKeyword, 300 );

	const [ isFetching, setIsFetching ] = useState( false );

	const parentContainer = useRef( null );
	const templatesContainer = useRef( null );
	const abortRequest = useRef( null );

	const TEMPLATE_TYPE = {
		RECOMMENDED: 'recommended',
		PARTIAL: 'partial',
		GENERIC: 'generic',
	};

	const getTemplates = useCallback(
		( type ) => {
			const { RECOMMENDED, GENERIC, PARTIAL } = TEMPLATE_TYPE;
			switch ( type ) {
				case RECOMMENDED:
					return templateSearchResults?.[ 0 ]?.designs || [];
				case PARTIAL:
					return templateSearchResults?.[ 1 ]?.designs || [];
				case GENERIC:
					return templateSearchResults?.[ 2 ]?.designs || [];
			}
		},
		[ templateSearchResults ]
	);

	const getInitialUserKeyword = () => {
		const type = businessType.toLowerCase();
		if ( type !== 'others' ) {
			return type;
		} else if ( keywords?.length > 0 ) {
			return keywords[ 0 ];
		}
		return businessName;
	};

	const fetchTemplates = async ( keyword = getInitialUserKeyword() ) => {
		if ( ! keyword ) {
			return;
		}

		setWebsiteTemplatesAIStep( [] );

		try {
			if ( abortRequest.current ) {
				abortRequest.current.abort();
				abortRequest.current = null;
			}
			setIsFetching( true );
			abortRequest.current = new AbortController();
			const res = await apiFetch( {
				path: 'zipwp/v1/templates',
				method: 'POST',
				data: {
					keyword,
					business_name: businessName,
				},
				signal: abortRequest.current.signal,
			} );

			const results = res?.data?.data || [];

			// Get the the designs in sequence
			const allTemplatesList = [];
			results.forEach( ( item ) => {
				if ( Array.isArray( item.designs ) ) {
					allTemplatesList.push( ...item.designs );
				}
			} );

			setWebsiteTemplatesAIStep( allTemplatesList );
			setWebsiteTemplateSearchResultsAIStep( results );
			setIsFetching( false );
		} catch ( error ) {
			if ( error?.name === 'AbortError' ) {
				return;
			}
			setIsFetching( false );
			toast.error(
				toastBody( {
					message:
						error?.response?.data?.message ||
						'Error while fetching templates',
				} )
			);
		}
	};

	useEffect( () => {
		setFocus( 'keyword' );

		// Save the manually entered keyword to session storage.
		return () => {
			const keyword = getValues( 'keyword' );
			if (
				! keyword ||
				keywords.some(
					( item ) => item?.toLowerCase() === keyword?.toLowerCase()
				)
			) {
				return clearSessionStorage( USER_KEYWORD );
			}
			setToSessionStorage( USER_KEYWORD, keyword );
		};
	}, [] );

	useEffect( () => {
		fetchTemplates(
			debouncedKeyword ? debouncedKeyword : getInitialUserKeyword()
		);
	}, [ debouncedKeyword ] );

	const handleSubmitKeyword = ( { keyword } ) => {
		onChangeKeyword( keyword );
	};

	const handleClearSearch = () => {
		if ( ! watchedKeyword ) {
			return;
		}
		reset( { keyword: '' } );
		onChangeKeyword( getInitialUserKeyword() );
	};

	const onChangeKeyword = ( value = '' ) => {
		fetchTemplates( value );
		setWebsiteSelectedTemplateAIStep( '' );
	};

	const renderTemplates = useMemo( () => {
		if (
			! getTemplates( TEMPLATE_TYPE.RECOMMENDED )?.length &&
			! getTemplates( TEMPLATE_TYPE.PARTIAL )?.length &&
			! getTemplates( TEMPLATE_TYPE.GENERIC )?.length
		) {
			return null;
		}

		return (
			<>
				{ getTemplates( TEMPLATE_TYPE.RECOMMENDED )?.map(
					( template, index ) => (
						<ColumnItem
							key={ template.uuid }
							template={ template }
							isRecommended
							position={ index + 1 }
						/>
					)
				) }
				{ getTemplates( TEMPLATE_TYPE.PARTIAL )?.map(
					( template, index ) => (
						<ColumnItem
							key={ template.uuid }
							template={ template }
							position={
								index +
								1 +
								( getTemplates( TEMPLATE_TYPE.RECOMMENDED )
									?.length || 0 )
							}
						/>
					)
				) }
				{ getTemplates( TEMPLATE_TYPE.GENERIC )?.map(
					( template, index ) => (
						<ColumnItem
							key={ template.uuid }
							template={ template }
							position={
								index +
								1 +
								( ( getTemplates( TEMPLATE_TYPE.RECOMMENDED )
									?.length || 0 ) +
									( getTemplates( TEMPLATE_TYPE.PARTIAL )
										?.length || 0 ) )
							}
						/>
					)
				) }
			</>
		);
	}, [ getTemplates ] );

	return (
		<div
			ref={ parentContainer }
			className={ twMerge(
				`mx-auto flex flex-col overflow-x-hidden`,
				'w-full'
			) }
		>
			<div className="space-y-5 px-5 md:px-10 lg:px-14 xl:px-15 pt-12">
				<h1>Choose the structure for your website</h1>
				<p className="text-base font-normal leading-6 text-app-text">
					Select your preferred structure for your website from the
					options below.
				</p>
			</div>

			<form
				className="sticky -top-1.5 z-10 pt-4 pb-4 bg-zip-app-light-bg px-5 md:px-10 lg:px-14 xl:px-15"
				onSubmit={ handleSubmit( handleSubmitKeyword ) }
			>
				<Input
					name="keyword"
					inputClassName="pl-11"
					register={ register }
					placeholder="Add a keyword"
					height="12"
					error={ errors?.keyword }
					prefixIcon={
						<button
							type="button"
							className="w-auto h-auto p-0 flex items-center justify-center cursor-pointer bg-transparent border-0 focus:outline-none"
							onClick={ handleClearSearch }
						>
							{ watchedKeyword ? (
								<XMarkIcon className="w-5 h-5 text-zip-app-inactive-icon" />
							) : (
								<MagnifyingGlassIcon className="w-5 h-5 text-zip-app-inactive-icon" />
							) }
						</button>
					}
				/>
			</form>

			<div
				ref={ templatesContainer }
				className={ classNames(
					// 'min-h-[calc(100svh_-_120px)] max-h-[calc(100svh_-_120px)] pb-2 px-10 lg:px-16 xl:px-0 overflow-x-hidden overflow-y-auto',
					'custom-confirmation-modal-scrollbar', // class for thin scrollbar
					'relative',
					'px-5 md:px-10 lg:px-14 xl:px-15',
					'xl:max-w-full'
				) }
			>
				<div
					ref={ templatesContainer }
					className={ classNames(
						'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-auto items-start justify-center gap-6 mb-10'
					) }
				>
					{ ! isFetching
						? renderTemplates
						: Array.from( { length: 6 } ).map( ( _, index ) => (
								<ColumnSkeleton key={ `skeleton-${ index }` } />
						  ) ) }
				</div>
			</div>

			<div className="sticky bottom-0 pb-6 bg-zip-app-light-bg pt-6 px-5 md:px-10 lg:px-14 xl:px-15">
				<NavigationButtons
					onClickPrevious={ onClickPrevious }
					hideContinue
				/>
			</div>
		</div>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const { setNextAIStep, setPreviousAIStep } = dispatch( STORE_KEY );

		return {
			onClickNext: setNextAIStep,
			onClickPrevious: setPreviousAIStep,
		};
	} )
)( SelectTemplate );
