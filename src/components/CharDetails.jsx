import React from 'react';
import { Paper, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	image: {
		objectFit: 'cover',
		width: 'inherit',
		height: 'inherit',
		borderRadius: 4,
	},
	favIcon: {
		position: 'absolute',
		bottom: 0,
		[theme.breakpoints.down('sm')]: {
			zoom: 0.7,
		},
	},
	isFav: {
		border: 'red',
	},
}));

const Modal = ({ characterData }) => {
	const classes = useStyles();
	return (
		<div>
			<Paper
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					bgcolor: 'background.paper',
					boxShadow: 24,
					padding: 10,
				}}
			>
				<Box>
					<p>{characterData.name}</p>
				</Box>
			</Paper>
		</div>
	);
};
export default Modal;
