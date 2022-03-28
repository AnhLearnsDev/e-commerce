import React, { useEffect, useState } from 'react';
import {
	InputLabel,
	Select,
	MenuItem,
	Button,
	Grid,
	Typography,
} from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';

import { commerce } from '../lib/commerce';
import FormInput from './CustomTextField';
import { Link } from 'react-router-dom';

function AddressForm({ checkoutToken, next }) {
	const [shippingCountries, setShippingCountries] = useState([]);
	const [shippingCountry, setShippingCountry] = useState('');
	const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
	const [shippingSubdivision, setShippingSubdivision] = useState('');
	const [shippingOptions, setShippingOptions] = useState([]);
	const [shippingOption, setShippingOption] = useState('');
	const methods = useForm();

	const fetchShippingCountries = async (checkoutTokenId) => {
		const { countries } = await commerce.services.localeListShippingCountries(
			checkoutTokenId
		);

		const shippingCountries = Object.entries(countries).map(([code, name]) => ({
			id: code,
			label: name,
		}));

		setShippingCountries(shippingCountries);
		setShippingCountry(shippingCountries[0].id);
	};

	const fetchSubdivisions = async (countryCode) => {
		setShippingSubdivision('');
		const { subdivisions } = await commerce.services.localeListSubdivisions(
			countryCode
		);

		const shippingSubdivisions = Object.entries(subdivisions).map(([code, name]) => ({
			id: code,
			label: name,
		}));

		setShippingSubdivisions(shippingSubdivisions);
		setShippingSubdivision(shippingSubdivisions[0].id);
	};

	const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
		setShippingOption('');
		const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {
			country,
			region,
		});

		const shippingOptions = options.map((shippingOption) => ({
			id: shippingOption.id,
			label: `${shippingOption.description} - (${shippingOption.price.formatted_with_symbol})`,
		}));

		setShippingOptions(shippingOptions);
		setShippingOption(shippingOptions[0].id);
	};

	useEffect(() => {
		fetchShippingCountries(checkoutToken.id);
	}, []);

	useEffect(() => {
		if (shippingCountry) fetchSubdivisions(shippingCountry);
	}, [shippingCountry]);

	useEffect(() => {
		if (shippingSubdivision)
			fetchShippingOptions(checkoutToken, shippingCountry, shippingSubdivision);
	}, [shippingSubdivision]);

	return (
		<>
			<Typography varian='h6' gutterBottom>
				Shipping Address
			</Typography>
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit((data) =>
						next({
							...data,
							shippingCountry,
							shippingSubdivision,
							shippingOption,
						})
					)}
				>
					<Grid container spacing={3}>
						<FormInput name='firstName' label='First Name' />
						<FormInput name='lastName' label='Last Name' />
						<FormInput name='address1' label='Address' />
						<FormInput name='email' label='Email' />
						<FormInput name='city' label='City' />
						<FormInput name='zip' label='ZIP / Postal Code' />
						<Grid item xs={12} sm={6}>
							<InputLabel>Shipping Country</InputLabel>
							<Select
								value={shippingCountry}
								fullWidth
								onChange={(e) => setShippingCountry(e.target.value)}
							>
								{shippingCountries.map((shippingCountry) => (
									<MenuItem
										key={shippingCountry.id}
										value={shippingCountry.id}
									>
										{shippingCountry.label}
									</MenuItem>
								))}
							</Select>
						</Grid>
						<Grid item xs={12} sm={6}>
							<InputLabel>Shipping Subdivision</InputLabel>

							<Select
								value={shippingSubdivision}
								fullWidth
								onChange={(e) => setShippingSubdivision(e.target.value)}
							>
								{shippingSubdivisions.map((shippingSubdivision) => (
									<MenuItem
										key={shippingSubdivision.id}
										value={shippingSubdivision.id}
									>
										{shippingSubdivision.label}
									</MenuItem>
								))}
							</Select>
						</Grid>
						<Grid item xs={12} sm={6}>
							<InputLabel>Shipping Options</InputLabel>
							<Select
								value={shippingOption}
								fullWidth
								onChange={(e) => setShippingOption(e.target.value)}
							>
								{shippingOptions.map((shippingOption) => (
									<MenuItem
										key={shippingOption.id}
										value={shippingOption.id}
									>
										{shippingOption.label}
									</MenuItem>
								))}
							</Select>
						</Grid>
					</Grid>
					<br />
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Button component={Link} to='/cart' variant='outlined'>
							Back to Cart
						</Button>
						<Button type='submit' variant='contained' color='primary'>
							Next
						</Button>
					</div>
				</form>
			</FormProvider>
		</>
	);
}

export default AddressForm;
