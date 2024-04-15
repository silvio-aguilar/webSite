import { useEffect } from 'react';
import { withDispatch, useSelect, useDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import apiFetch from '@wordpress/api-fetch';
import { STORE_KEY } from './store';
import Divider from './components/divider';
import Heading from './heading';
import NavigationButtons from './navigation-buttons';
import LanguageSelection from './language-selection';
import BusinessTypes from './components/business-types';
import { useForm } from 'react-hook-form';
import Input from './components/input';

const BusinessDetails = ( { onClickContinue } ) => {
	const { setSiteLanguageListAIStep, setWebsiteNameAIStep } =
		useDispatch( STORE_KEY );
	const { businessType, siteLanguageList, businessName } = useSelect(
		( select ) => {
			const { getAIStepData } = select( STORE_KEY );
			return getAIStepData();
		}
	);

	const handleClickContinue = () => {
		if ( ! businessType || '' === businessType ) {
			return;
		}

		setWebsiteNameAIStep( watchedBusinessName );
		onClickContinue();
	};

	const getLanguages = async () => {
		try {
			const response = await apiFetch( {
				path: 'zipwp/v1/site-languages',
				method: 'GET',
				headers: {
					'X-WP-Nonce': astraSitesVars.rest_api_nonce,
				},
			} );
			if ( response.success ) {
				setSiteLanguageListAIStep( response?.data?.data );
			} else {
				//  Handle error.
			}
		} catch ( error ) {
			// Handle error.
		}
	};

	useEffect( () => {
		if ( siteLanguageList?.length ) {
			return;
		}
		getLanguages();
	}, [ siteLanguageList ] );

	/* Business Name */
	const {
		register,
		formState: { errors },
		setFocus,
		watch,
	} = useForm( { defaultValues: { businessName } } );
	const watchedBusinessName = watch( 'businessName' );

	useEffect( () => {
		setFocus( 'businessName' );
	}, [ setFocus ] );

	return (
		<div className="w-full max-w-container flex flex-col gap-8">
			<Heading
				heading="Let's build your website!"
				subHeading="Please share some basic details of the website to get started."
			/>
			<div className="w-full max-w-container flex flex-col gap-8">
				<div className="!space-y-2">
					<h5 className="text-base flex font-semibold leading-6 items-center !mb-2">
						Name of the website:
					</h5>
					<Input
						className="w-full"
						name="businessName"
						placeholder="Enter name or title of the website"
						register={ register }
						validations={ {
							required: 'Name is required',
						} }
						error={ errors.businessName }
						height="12"
					/>
				</div>
				<div className="w-full flex items-start justify-start flex-wrap lg:flex-nowrap gap-8">
					<div className="flex-1 min-h-[48px] min-w-[calc(100%_/_2)] md:min-w-0 !space-y-2">
						<h5 className="text-base flex font-semibold leading-6 items-center">
							This website is for:
						</h5>
						<BusinessTypes />
					</div>
					<LanguageSelection />
				</div>
			</div>
			{ /* Types */ }
			<Divider />
			{ /* Footer */ }
			<NavigationButtons
				onClickContinue={ handleClickContinue }
				disableContinue={ ! businessType || ! watchedBusinessName }
			/>
		</div>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const { setNextAIStep } = dispatch( STORE_KEY );
		return {
			onClickContinue: setNextAIStep,
		};
	} )
)( BusinessDetails );
