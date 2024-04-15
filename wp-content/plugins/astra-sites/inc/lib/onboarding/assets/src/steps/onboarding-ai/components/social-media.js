import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useState, useMemo } from '@wordpress/element';
import {
	FacebookIcon,
	InstagramIcon,
	LinkedInIcon,
	TwitterIcon,
	YouTubeIcon,
	GoogleIcon,
	YelpIcon,
} from '../../ui/icons';
import Dropdown from './dropdown';
import Input from './input';

const getPlaceholder = ( socialMedia ) => {
	switch ( socialMedia ) {
		case 'Facebook':
		case 'Twitter':
		case 'Instagram':
		case 'LinkedIn':
		case 'YouTube':
			return `Enter your ${ socialMedia } account URL`;
		case 'Google My Business':
			return 'Enter your Google Business URL';
		case 'Yelp':
			return 'Enter your Yelp business URL';
		default:
			return 'Enter your account URL';
	}
};

const SocialMediaItem = ( { socialMedia, onRemove, onEdit } ) => {
	const [ isEditing, setIsEditing ] = useState( false );
	const url = new URL( socialMedia.url );
	const [ editedUrl, setEditedUrl ] = useState( socialMedia.url );

	const handleDoubleClick = () => {
		setEditedUrl( socialMedia.url );
		setIsEditing( true );
	};

	const handleUpdateURL = ( value = '' ) => {
		setIsEditing( false );
		if ( ! value.trim() ) {
			setEditedUrl( url.pathname.substring( 1 ) );
			return;
		}
		onEdit( value );
	};

	const handleBlur = () => {
		handleUpdateURL( editedUrl );
	};

	const handleKeyDown = ( event ) => {
		if ( event.key === 'Enter' ) {
			event.preventDefault();
			handleUpdateURL( editedUrl );
		} else if ( event.key === 'Escape' ) {
			handleUpdateURL();
		}
	};

	return (
		<div
			key={ socialMedia.id }
			className="relative h-[50px] pl-[23px] pr-[25px] rounded-[25px] bg-white flex items-center gap-3 shadow-sm"
			onDoubleClick={ handleDoubleClick }
		>
			{ ! isEditing && (
				<div
					role="button"
					className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center cursor-pointer bg-nav-active"
					onClick={ onRemove }
					tabIndex={ 0 }
					onKeyDown={ onRemove }
				>
					<XMarkIcon className="w-4 h-4 text-white" />
				</div>
			) }
			<socialMedia.icon className="shrink-0 text-nav-active inline-block" />
			{ isEditing ? (
				<Input
					ref={ ( node ) => {
						if ( node ) {
							node.focus();
						}
					} }
					name="socialMediaURL"
					inputClassName="!border-0 !bg-transparent !shadow-none focus:!ring-0 px-0"
					value={ editedUrl }
					onChange={ ( e ) => {
						setEditedUrl( e.target.value );
					} }
					className="w-full"
					placeholder={ `Enter your ${ socialMedia.name } URL` }
					noBorder
					onBlur={ handleBlur }
					onKeyDown={ handleKeyDown }
					enableAutoGrow
				/>
			) : (
				<p className="text-base font-medium text-body-text">
					{ socialMedia.url }
				</p>
			) }
		</div>
	);
};

const SocialMediaAdd = ( { list, onChange } ) => {
	const socialMediaList = [
		{
			name: 'Facebook',
			id: 'facebook',
			icon: FacebookIcon,
		},
		{
			name: 'Twitter',
			id: 'twitter',
			icon: TwitterIcon,
		},
		{
			name: 'Instagram',
			id: 'instagram',
			icon: InstagramIcon,
		},
		{
			name: 'LinkedIn',
			id: 'linkedin',
			icon: LinkedInIcon,
		},
		{
			name: 'YouTube',
			id: 'youtube',
			icon: YouTubeIcon,
		},
		{
			name: 'Google My Business',
			id: 'google',
			icon: GoogleIcon,
		},
		{
			name: 'Yelp',
			id: 'yelp',
			icon: YelpIcon,
		},
	];

	const [ selectedSocialMedia, setSelectedSocialMedia ] = useState( null );
	const [ socialMediaURL, setSocialMediaURL ] = useState( '' );

	const socialMediaHandles = {
		twitter: 'twitter.com/',
		facebook: 'facebook.com/',
		instagram: 'instagram.com/',
		linkedin: 'linkedin.com/in/',
		youtube: 'youtube.com/',
		google: 'google.com/maps/place',
		yelp: 'yelp.com/biz/',
	};

	const socialMediaHandlesRegex = {
		twitter: /twitter\.com\/[a-zA-Z0-9_#?&=+]+\/?$/,
		facebook: /facebook\.com\/[a-zA-Z0-9._#?&=+]+\/?$/,
		instagram: /instagram\.com\/[a-zA-Z0-9._@#?&=+]+\/?$/,
		linkedin: /linkedin\.com\/in\/([a-zA-Z0-9\-]+)\/?$/,
		youtube: /youtube\.com\/[a-zA-Z0-9_#?&=+@]+\/?$/,
		google: /google\.com\/maps\/place\/[a-zA-Z0-9-+_.#?&=+]+\/?$/,
		yelp: /yelp\.com\/biz\/[a-zA-Z0-9-_#?&=+]+\/?$/,
	};
	const validateSocialMediaURL = ( url, type ) => {
		if ( url === '' ) {
			return true;
		}
		return socialMediaHandlesRegex[ type ].test( url );
	};

	const extractHandle = ( input ) => {
		const urlParts = input
			.split( '/' )
			.filter( ( part ) => part && ! part.includes( '.' ) );
		return urlParts?.pop()?.replace( 'http:' )?.replace( 'https:' );
	};

	const getSocialMediaURL = ( LINK, SOCIAL_MEDIA_TYPE ) => {
		const socialMediaDomain =
			socialMediaHandles[ SOCIAL_MEDIA_TYPE?.toLowerCase() ];
		if ( ! socialMediaDomain ) {
			return null;
		}

		if ( SOCIAL_MEDIA_TYPE === 'google' ) {
			// Check if the input URL is already in the correct format
			if ( LINK.startsWith( `https://www.${ socialMediaDomain }/` ) ) {
				return LINK;
			}

			// Replace spaces with '+' and handle special characters
			const searchQuery = LINK?.replace( / /g, '+' )?.replace(
				/%2B/g,
				'+'
			);

			return `https://www.${ socialMediaDomain }/${ searchQuery }`;
		}

		let handle;
		let url;
		let urlParts;
		switch ( SOCIAL_MEDIA_TYPE.toLowerCase() ) {
			case 'twitter':
			case 'facebook':
			case 'instagram':
				urlParts = LINK.split( '/' ).filter(
					( part, index ) =>
						part &&
						( index === LINK.split( '/' ).length - 1 ||
							! part.includes( '.' ) )
				);
				handle =
					urlParts?.pop()?.replace( 'http:' )?.replace( 'https:' ) ||
					'';
				if ( handle === undefined ) {
					url = `https://${ socialMediaHandles[ SOCIAL_MEDIA_TYPE ] }`;
				}
				url = `https://${ socialMediaHandles[ SOCIAL_MEDIA_TYPE ] }${ handle }`;
				try {
					new URL( url );
				} catch ( e ) {
					url = `https://${ socialMediaHandles[ SOCIAL_MEDIA_TYPE ] }`;
				}
				break;
			case 'linkedin':
				const match = LINK.match(
					/(linkedin\.com\/in[\/]{0,1})(.*)\/?$/
				);
				const fullUrl = match?.[ 1 ] ?? '';
				if ( ! fullUrl ) {
					handle = LINK;
				} else {
					handle = match?.[ 2 ] ?? '';
				}
				if ( ! handle ) {
					url = `https://${ socialMediaHandles[ SOCIAL_MEDIA_TYPE ] }`;
				}
				url = `https://${ socialMediaHandles[ SOCIAL_MEDIA_TYPE ] }${ handle }`;
				try {
					new URL( url );
				} catch ( e ) {
					url = `https://${ socialMediaHandles[ SOCIAL_MEDIA_TYPE ] }`;
				}
				break;
			case 'youtube':
			case 'google':
			case 'yelp':
				handle = extractHandle( LINK ) ?? '';
				if ( handle === undefined ) {
					url = `https://${ socialMediaHandles[ SOCIAL_MEDIA_TYPE ] }`;
				}
				url = `https://${ socialMediaHandles[ SOCIAL_MEDIA_TYPE ] }${ handle }`;
				try {
					new URL( url );
				} catch ( e ) {
					url = `https://${ socialMediaHandles[ SOCIAL_MEDIA_TYPE ] }`;
				}
				break;
			default:
				url = LINK;
				break;
		}
		return url;
	};

	const filterList = ( socialMediaItemList ) => {
		if ( list.length === 0 ) {
			return socialMediaItemList;
		}
		const addedSocialMediaIds = list.map( ( sm ) => sm.id );
		return socialMediaItemList.filter(
			( sm ) => ! addedSocialMediaIds.includes( sm.id )
		);
	};

	const handleEnterLink = ( type ) => {
		if (
			! (
				typeof socialMediaURL === 'string' && !! socialMediaURL?.trim()
			)
		) {
			return;
		}
		const link = getSocialMediaURL( socialMediaURL.trim(), type );
		const newList = [
			...list,
			{
				...selectedSocialMedia,
				url: link,
				valid: validateSocialMediaURL( link, type ),
			},
		];
		onChange( newList );
		setSelectedSocialMedia( null );
		setSocialMediaURL( '' );
	};

	const handleEditLink = ( id, value ) => {
		const newList = list.map( ( sm ) => {
			if ( sm.id === id ) {
				return {
					...sm,
					url: getSocialMediaURL( value, id ),
					valid: validateSocialMediaURL( value, id ),
				};
			}
			return sm;
		} );
		onChange( newList );
	};

	const updatedList = useMemo( () => {
		return list.map( ( sm ) => {
			const url = getSocialMediaURL( sm.url, sm.id );
			const valid = validateSocialMediaURL( url, sm.id );
			return {
				...sm,
				url,
				valid,
				icon: socialMediaList.find( ( item ) => item.id === sm.id )
					?.icon,
			};
		} );
	}, [ list ] );

	const socialMediaRender = () => {
		if ( selectedSocialMedia ) {
			const placeholderText = selectedSocialMedia
				? getPlaceholder( selectedSocialMedia.name )
				: 'Enter your account URL';
			return (
				<div className="h-[50px] w-[520px] rounded-[25px] bg-white flex items-center">
					<Input
						name="socialMediaURL"
						value={ socialMediaURL }
						onChange={ ( e ) => {
							setSocialMediaURL( e.target.value );
						} }
						ref={ ( node ) => {
							if ( node ) {
								node.focus();
							}
						} }
						inputClassName="!pr-10 !pl-11 !border-0 !bg-transparent !shadow-none focus:!ring-0"
						className="w-full"
						placeholder={ placeholderText }
						noBorder
						prefixIcon={
							<selectedSocialMedia.icon className="text-nav-active inline-block" />
						}
						onBlur={ ( event ) => {
							event.preventDefault();
							handleEnterLink( selectedSocialMedia.id );
						} }
						onKeyDown={ ( event ) => {
							if ( event.key === 'Enter' ) {
								event.preventDefault();
								handleEnterLink( selectedSocialMedia.id );
							} else if ( event.key === 'Escape' ) {
								setSelectedSocialMedia( null );
								setSocialMediaURL( '' );
							}
						} }
						suffixIcon={
							<div className="relative">
								<div
									className="absolute -top-7 -right-3"
									onClick={ () => {
										setSelectedSocialMedia( null );
										setSocialMediaURL( '' );
									} }
									role="button"
									tabIndex={ 0 }
									onKeyDown={ () => {
										setSelectedSocialMedia( null );
										setSocialMediaURL( '' );
									} }
								>
									<div className="w-4 h-4 rounded-full flex items-center justify-center bg-app-inactive-icon cursor-pointer bg-nav-active">
										<XMarkIcon className="w-4 h-4 text-white" />
									</div>
								</div>
							</div>
						}
					/>
				</div>
			);
		}
		if ( filterList( socialMediaList ).length ) {
			return (
				<Dropdown
					width="60"
					contentClassName="p-4 bg-white [&>:first-child]:pb-2.5 [&>:last-child]:pt-2.5 [&>:not(:first-child,:last-child)]:py-2.5 !divide-y !divide-border-primary divide-solid divide-x-0"
					trigger={
						<div className="p-3 rounded-full flex items-center justify-center bg-white cursor-pointer border border-border-primary border-solid shadow-small">
							<PlusIcon className="w-6 h-6 text-accent-st" />
						</div>
					}
					placement="top-start"
				>
					{ filterList( socialMediaList ).map( ( item, index ) => (
						<Dropdown.Item
							as="div"
							role="none"
							key={ index }
							className="only:!py-0"
							onClick={ () => setSelectedSocialMedia( item ) }
						>
							<button
								onClick={ () => null }
								type="button"
								className="w-full flex items-center text-sm font-normal text-left py-2 px-2 leading-5 hover:bg-background-secondary focus:outline-none transition duration-150 ease-in-out space-x-2 rounded bg-transparent border-0 cursor-pointer"
							>
								<item.icon className="text-nav-inactive inline-block" />
								<span className="text-body-text">
									{ item.name }
								</span>
							</button>
						</Dropdown.Item>
					) ) }
				</Dropdown>
			);
		}
		return '';
	};

	return (
		<div>
			<div className="text-sm font-semibold leading-[21px] mb-5 text-heading-text">
				Social Media
			</div>

			<div className="flex items-start gap-4 flex-wrap">
				{ updatedList?.length > 0 && (
					<div className="flex items-start gap-4 flex-wrap">
						{ updatedList.map( ( sm ) => (
							<div key={ sm.id }>
								<SocialMediaItem
									socialMedia={ sm }
									onRemove={ () => {
										onChange(
											updatedList.filter(
												( item ) => item.id !== sm.id
											)
										);
									} }
									onEdit={ ( url ) =>
										handleEditLink( sm.id, url )
									}
								/>
								{ ! sm.valid && (
									<div className="p-3">
										<p className="!m-0 !p-0 !text-alert-error !text-sm">
											This might not be a valid{ ' ' }
											{ sm.name } URL
										</p>
									</div>
								) }
							</div>
						) ) }
					</div>
				) }

				{ socialMediaRender() }
			</div>
		</div>
	);
};

export default SocialMediaAdd;
