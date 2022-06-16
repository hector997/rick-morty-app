import React, { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import axios from 'axios';
import {
	Paper,
	Box,
	Table,
	Button,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

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
		[theme.breakpoints.down('sm')]: {
			zoom: 0.7,
			width: 350,
		},
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
	tableWrap: {
		width: '90%',
		margin: 'auto',
		background: '#C4C4C480',
		'& $table': {
			background: '#C4C4C40',
			width: '90%',
			marginTop: 20,
			margin: 'auto',
		},
	},
	table: {
		background: '#C4C4C40',
		marginTop: 20,
		margin: 'auto',
	},
	tableContainer: {
		height: 200,
		width: 'auto',
		overflowX: 'scroll',
	},
	titleCell: {
		backgroundColor: '#0A222D',
		color: '#fafafa',
	},
	rowWrap: {
		'& $rowCell': {},
	},
	rowCell: {
		color: '#fafafa',
	},
	imgDisplay: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	btnContainer: {
		display: 'flex',
		justifyContent: 'center',
		padding: 5,
	},
	closeBtn: {
		color: '#FAFAFA',
		borderColor: '#00DFDD',
		'&:hover': {
			color: '#00DFDD',
		},
	},
}));

const Modal = ({ characterData, onClose }) => {
	const classes = useStyles();
	const [episodeList, setEpisodeList] = useState([]);
	let [isLoading, setIsLoading] = useState(false);
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
			setEpisodeList(response.data);
			isLoading(true);
		} catch {
			console.log('error loading episodes');
		}
	};
	const DateFormat = (date) => {};
	const EpisodeTable = () => {
		const headerList = ['Episode', 'Code', 'Air date'];
		if (isLoading) {
			return <CircularProgress style={{ marginTop: 40 }} />;
		} else {
			return (
				<>
					<Table stickyHeader className={classes.table}>
						<TableHead>
							<TableRow>
								{headerList.map((label) => (
									<TableCell className={classes.titleCell}>
										{label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{episodeList.length > 1 ? (
								episodeList.map((row) => (
									<TableRow
										key={row.id}
										style={
											row.id % 2
												? { background: '#0A222D' }
												: { background: '#C4C4C480' }
										}
									>
										<TableCell
											className={classes.rowCell}
											style={{ width: 200 }}
										>
											{row.name}
										</TableCell>
										<TableCell className={classes.rowCell}>
											{row.episode}
										</TableCell>
										<TableCell className={classes.rowCell}>
											{dateFormat(
												row.air_date,
												'dd-m-yy'
											)}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow
									key={episodeList.id}
									style={{ background: '#C4C4C480' }}
								>
									<TableCell
										className={classes.rowCell}
										style={{ width: 150 }}
									>
										{episodeList.name}
									</TableCell>
									<TableCell lassName={classes.rowCell}>
										{episodeList.episode}
									</TableCell>
									<TableCell
										lassName={classes.rowCell}
										align="right"
									>
										{episodeList.air_date}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</>
			);
		}
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
				<footer className={classes.btnContainer}>
					<Button
						variant="outlined"
						className={classes.closeBtn}
						onClick={onClose}
					>
						Close
					</Button>
				</footer>
			</Paper>
		</div>
	);
};
export default Modal;
