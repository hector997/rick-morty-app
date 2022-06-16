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
		backgroundColor: '#0A222D',
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(4, 8, 3),
		direction: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 500,
	},
	image: {
		width: 120,
		height: 120,
		borderRadius: 100,
	},
	fieldTitle: {
		color: '#F4F4F4',
		fontWeight: 300,
		marginBottom: 4,
	},
	fieldWrap: {
		backgroundColor: '#FAFAFA',
		borderRadius: 10,
		padding: '0.5px 20px',
	},
	fieldData: {
		margin: '10px',
	},
	tableContainer: {
		height: 200,
		width: 'auto',
		overflowX: 'scroll',
	},
	table: {
		color: '#FAFAFA',
	},
	imgDisplay: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
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
			console.log('arr', episodeArr);
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
					{episodeList.length > 1 ? (
						episodeList.map((row) => (
							<TableRow key={row.id}>
								<TableCell component="th" scope="row">
									{row.name}
								</TableCell>
								<TableCell align="right">
									{row.episode}
								</TableCell>
								<TableCell align="right">
									{row.air_date}
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow key={episodeList.id}>
							<TableCell component="th" scope="row">
								{episodeList.name}
							</TableCell>
							<TableCell align="right">
								{episodeList.episode}
							</TableCell>
							<TableCell align="right">
								{episodeList.air_date}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		);
	};
	return (
		<div>
			<Paper className={classes.paper}>
				<Box className={classes.imgDisplay}>
					<img
						className={classes.image}
						src={characterData.image}
						alt=""
					/>
				</Box>
				<Box className={classes.infoDisplay}>
					<h3 className={classes.fieldTitle}>Name</h3>
					<div className={classes.fieldWrap}>
						<p className={classes.fieldData}>
							{characterData.name}
						</p>
					</div>
				</Box>
				<Box className={classes.infoDisplay}>
					<h3 className={classes.fieldTitle}>Status</h3>
					<div className={classes.fieldWrap}>
						<p className={classes.fieldData}>
							{characterData.status}
						</p>
					</div>
				</Box>
				<Box className={classes.infoDisplay}>
					<h3 className={classes.fieldTitle}>Species</h3>
					<div className={classes.fieldWrap}>
						<p className={classes.fieldData}>
							{characterData.species}
						</p>
					</div>
				</Box>
				{/* type viene vacio en todos los characters, por eso decidí omitirlo */}
				<Box className={classes.infoDisplay}>
					<h3 className={classes.fieldTitle}>Gender</h3>
					<div className={classes.fieldWrap}>
						<p className={classes.fieldData}>
							{characterData.gender}
						</p>
					</div>
				</Box>
				<Box className={classes.infoDisplay}>
					<h3 className={classes.fieldTitle}>Origin</h3>
					<div className={classes.fieldWrap}>
						<p className={classes.fieldData}>
							{characterData.origin.name}
						</p>
					</div>
				</Box>
				<Box className={classes.infoDisplay}>
					<h3 className={classes.fieldTitle}>Location</h3>
					<div className={classes.fieldWrap}>
						<p className={classes.fieldData}>
							{characterData.location.name}
						</p>
					</div>
				</Box>
				<Box className={classes.tableContainer}>
					<EpisodeTable />
				</Box>
			</Paper>
		</div>
	);
};
export default Modal;
