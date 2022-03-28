import React from 'react';
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

function FormInput({ name, label }) {
	const { control } = useFormContext();
	return (
		<Grid item xs={12} sm={6}>
			<Controller
				render={({ field: { onChange, onBlur, value, name, ref } }) => (
					<TextField fullWidth label={label} required onChange={onChange} />
				)}
				control={control}
				name={name}
			/>
		</Grid>
	);
}

export default FormInput;
