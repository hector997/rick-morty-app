import React from 'react';
import '../App.css';
import { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Button, IconButton, Modal, Input } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { Paper, Box } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import CharDetails from './CharDetails';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
	MainView: {
		position: 'absolute',
		width: '100%',
		backgroundColor: '#0A222D',
		paddingTop: 30,
	},
	appTitle: {
		color: '#00DFDD',
		fontFamily: 'Montserrat',
		fontSize: 40,
		fontWeight: 400,
	},
	form: {
		padding: 20,
		display: 'flex',
		alignItems: 'center',
	},
	input: {
		color: '#00DFDD',
		fontSize: 28,
		fontWeight: 400,
	},
	inputIcon: {
		color: '#00DFDD',
		marginRight: 10,
		fontSize: 35,
	},
	search: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		maxWidth: '80%',
		paddingLeft: '8%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	tableWrap: {
		width: '90%',
		margin: 'auto',
		background: '#C4C4C480',
		borderRadius: 10,
		'& $table': {
			background: '#C4C4C40',
			width: '90%',
			marginTop: 20,
			margin: 'auto',
		},
	},
	tableWrapError: {
		width: '90%',
		margin: 'auto',
		background: '#C4C4C480',
		borderRadius: 10,
		height: '1000px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	searchError: {
		paddingLeft: 10,
		color: '#FAFAFA',
		fontSize: 30,
		fontFamily: 'Montserrat',
		fontWeight: 200,
	},
	errorIcon: {
		color: '#FAFAFA',
		fontSize: 30,
	},
	tableTitle: {
		color: '#00DFDD',
		fontSize: 20,
		fontWeight: 400,
	},
	tableItem: {
		color: '#FAFAFA',
		fontSize: 18,
		fontWeight: 400,
		border: 'none',
		padding: '5px 20px',
		'&:first-child': {
			borderTopLeftRadius: 8,
			borderBottomLeftRadius: 8,
		},
		'&:last-child': {
			borderTopRightRadius: 8,
			borderBottomRightRadius: 8,
		},
	},
	tableItemIcon: {
		color: '#FAFAFA',
		width: 20,
		'&:hover': {
			color: '#00DFDD',
		},
	},
	pagination: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 'auto',
		width: '85%',
		paddingTop: 10,
		paddingBottom: 40,
	},
	pageNumber: {
		padding: 5,
		'&:hover': {
			color: '#00DFDD',
		},
	},
	backBtn: {
		color: '#FAFAFA',
		borderColor: '#00DFDD',
		'&:hover': {
			color: '#00DFDD',
		},
	},
}));
const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: 'rgba(10, 34, 45, 0.7)',
		},
	},
}))(TableRow);

function MainView() {
	const classes = useStyles();

	let [loading, setLoading] = useState(false);
	let [open, setOpen] = useState(false);
	let [isSearching, setIsSearching] = useState(false);
	let [searchError, setSearchError] = useState(false);

	let [characterList, setCharacterList] = useState([]);

	let [selectedCharacter, setSelectedCharacter] = useState(null);
	let [pageNumber, setPageNumber] = useState(1);
	let [pageUp, setPageUp] = useState(null);
	let [pageDown, setPageDown] = useState(null);

	useEffect(() => {
		getCharacters();
	}, [pageNumber]);

	const getCharacters = async () => {
		try {
			const response = await axios.get(
				`https://rickandmortyapi.com/api/character/?page=${pageNumber}`
			);
			setCharacterList(response.data);
			setLoading(true);
		} catch {
			console.log('API error');
		}
	};
	const handlePageUp = async () => {
		if (pageUp) {
			const response = await axios.get(`${pageUp}`);
			setCharacterList(response.data);
			response.data.info.next
				? setPageUp(response.data.info.next)
				: setPageUp(null);
			setLoading(true);
		}
	};
	const handlePageDown = async () => {
		if (pageDown) {
			const response = await axios.get(`${pageDown}`);
			setCharacterList(response.data);
			response.data.info.prev
				? setPageDown(response.data.info.prev)
				: setPageDown(null);
			setLoading(true);
		}
	};
	const handleBack = () => {
		setIsSearching(false);
		setSearchError(false);
		getCharacters();
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSearching(true);

		let charToSearch = event.target[0].value;
		if (charToSearch) {
			try {
				const response = await axios.get(
					`https://rickandmortyapi.com/api/character/?name=${charToSearch}`
				);
				response.data.info.next
					? setPageUp(response.data.info.next)
					: setPageUp(null);
				response.data.info.prev
					? setPageDown(response.data.info.prev)
					: setPageDown(null);
				setCharacterList(response.data);
				setLoading(true);
			} catch {
				console.log('search error');
				setSearchError(true);
			}
		}
		event.target.reset();
	};

	const TableComponent = () => {
		let paginationItemsArr = Array.from(
			{ length: characterList.info.pages },
			(_, i) => i + 1
		);
		const headerList = [
			'Name',
			'Status',
			'Specie',
			'Gender',
			'Episodes',
			'',
		];
		if (searchError) {
			return (
				<TableContainer
					component={Paper}
					className={classes.tableWrapError}
				>
					<ErrorOutlineIcon className={classes.errorIcon} />
					<h2 className={classes.searchError}>
						No characters found. Please try again
					</h2>
				</TableContainer>
			);
		} else {
			return (
				<TableContainer component={Paper} className={classes.tableWrap}>
					<Table className={classes.table}>
						<TableHead className={classes.tableHead}>
							<TableRow className={classes.rowHead}>
								{headerList.map((label) => (
									<TableCell className={classes.tableTitle}>
										{label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody className={classes.tableBody}>
							{characterList.results.map((row) => (
								<StyledTableRow
									key={row.id}
									className={classes.rowBody}
								>
									<TableCell className={classes.tableItem}>
										{row.name}
									</TableCell>
									<TableCell className={classes.tableItem}>
										{row.status}
									</TableCell>
									<TableCell className={classes.tableItem}>
										{row.species}
									</TableCell>
									<TableCell className={classes.tableItem}>
										{row.gender}
									</TableCell>
									<TableCell
										align="center"
										width={40}
										className={classes.tableItem}
									>
										{row.episode.length}
									</TableCell>
									<TableCell
										align="right"
										className={classes.tableItem}
									>
										<IconButton
											onClick={() => handleOpen(row)}
											className={classes.tableItemIcon}
										>
											<VisibilityOutlinedIcon />
										</IconButton>
									</TableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
					<div className={classes.pagination}>
						<IconButton
							className={classes.pageNumber}
							onClick={handlePageDown}
						>
							<KeyboardArrowLeftIcon />
						</IconButton>
						<div>
							{!isSearching ? (
								<>
									{paginationItemsArr.map((item) => (
										<IconButton
											className={classes.pageNumber}
											style={
												item === pageNumber
													? { color: '#00DFDD' }
													: {}
											}
											key={item}
											onClick={() => setPageNumber(item)}
										>
											{item}
										</IconButton>
									))}
								</>
							) : (
								<></>
							)}
						</div>
						<IconButton
							className={classes.pageNumber}
							onClick={handlePageUp}
						>
							<KeyboardArrowRightIcon />
						</IconButton>
					</div>
				</TableContainer>
			);
		}
	};
	const handleOpen = (char) => {
		setOpen(true);
		setSelectedCharacter(char);
	};
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Box className={classes.MainView}>
			<h1 className={classes.appTitle}>Rick and Morty characters</h1>
			{loading ? (
				<Box>
					<div className={classes.search}>
						<form className={classes.form} onSubmit={handleSubmit}>
							<SearchIcon className={classes.inputIcon} />
							<Input
								placeholder="Search…"
								className={classes.input}
							/>
						</form>
						<div>
							{isSearching ? (
								<Button
									className={classes.backBtn}
									variant="outlined"
									onClick={handleBack}
								>
									Back
								</Button>
							) : (
								<></>
							)}
						</div>
					</div>
					<TableComponent />
					<Modal className={classes.modal} open={open}>
						<CharDetails
							characterData={selectedCharacter}
							onClose={handleClose}
						></CharDetails>
					</Modal>
				</Box>
			) : (
				<CircularProgress style={{ marginTop: 40 }} />
			)}
		</Box>
	);
}

export default MainView;
