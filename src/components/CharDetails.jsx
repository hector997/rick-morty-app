import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Paper,
	Box,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),

		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 600,
	},
	image: {
		objectFit: 'cover',
		width: 'inherit',
		height: 'inherit',
		borderRadius: 4,
	},
	tableContainer: {
		height: 300,
		width: 'auto',
		overflowX: 'scroll',
	},
}));

const Modal = ({ characterData }) => {
	const classes = useStyles();
	const [episodeList, setEpisodeList] = useState([]);
	useEffect(() => {
		getEpisodeData();
	}, []);

	const getEpisodeData = async () => {
		let episodeArr = [];
		characterData.episode.forEach((element) => {
			let episodeNumber = element.match(/\d+/)[0];
			episodeArr.push(episodeNumber);
		});
		try {
			const response = await axios.get(
				`https://rickandmortyapi.com/api/episode/${episodeArr}`
			);
			console.log(response.data);
			setEpisodeList(response.data);
		} catch {
			console.log('error loading episodes');
		}
	};
	const EpisodeTable = () => {
		return (
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell>Episode</TableCell>
						<TableCell align="right">Code</TableCell>
						<TableCell align="right">Air Date</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{episodeList.map((row) => (
						<TableRow key={row.id}>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell align="right">{row.episode}</TableCell>
							<TableCell align="right">{row.air_date}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	};
	console.log(characterData);
	return (
		<div>
			<Paper className={classes.paper}>
				<Box>
					<img src={characterData.image} alt="" />
				</Box>
				<Box>
					<p>name</p>
					<p>{characterData.name}</p>
				</Box>
				<Box>
					<p>status</p>
					<p>{characterData.status}</p>
				</Box>
				<Box>
					<p>species</p>
					<p>{characterData.species}</p>
				</Box>
				{/* type viene vacio en todos los characters, por eso decidí omitirlo */}
				<Box>
					<p>gender</p>
					<p>{characterData.gender}</p>
				</Box>
				<Box>
					<p>origin</p>
					<p>{characterData.origin.name}</p>
				</Box>
				<Box>
					<p>location</p>
					<p>{characterData.location.name}</p>
				</Box>
				<Box className={classes.tableContainer}>
					<EpisodeTable />
				</Box>
			</Paper>
		</div>
	);
};
export default Modal;
