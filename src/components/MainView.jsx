import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme) => ({
	MainView: {
		position: 'absolute',
		width: '100%',
		backgroundColor: '#0A222D',
	},
	form: {
		width: '20%',
		padding: 20,
	},
	search: {
		position: 'relative',
		left: 0,
		borderRadius: theme.shape.borderRadius,
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	tableWrap: {
		width: '95%',
		margin: 'auto',
		background: '#C4C4C480',
		borderRadius: 10,
		'& $table': {
			background: '#C4C4C40',
			width: '95%',
			marginTop: 20,
			margin: 'auto',
		},
	},
	tableTitle: {
		color: '#00DFDD',
		fontSize: 20,
		fontWeight: 400,
	},
	tableBody: {
		margin: 2,
		'& $rowBody': {
			margin: 2,
		},
	},
	input: {
		color: 'white',
	},
	pagination: {},
}));

function MainView() {
	const classes = useStyles();

	let [loading, setLoading] = useState(false);
	let [open, setOpen] = useState(false);
	let [isSearching, setIsSearching] = useState(false);

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
		console.log('pageup ran', pageUp);
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
		getCharacters();
	};
	const filteredCharacters = async (event) => {
		event.preventDefault();
		setIsSearching(true);
		let charToSearch = event.target[0].value;
		console.log('event', event.target[0].value);
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
			}
		}
		event.target.reset();
	};

	const TableComponent = () => {
		let paginationItemsArr = Array.from(
			{ length: characterList.info.pages },
			(_, i) => i + 1
		);
		return (
			<TableContainer component={Paper} className={classes.tableWrap}>
				{isSearching ? (
					<Button onClick={handleBack}>back</Button>
				) : (
					<div></div>
				)}

				<Table className={classes.table}>
					<TableHead className={classes.tableHead}>
						<TableRow className={classes.rowHead}>
							<TableCell className={classes.tableTitle}>
								Name
							</TableCell>
							<TableCell className={classes.tableTitle}>
								Status
							</TableCell>
							<TableCell className={classes.tableTitle}>
								Specie
							</TableCell>
							<TableCell className={classes.tableTitle}>
								Gender
							</TableCell>
							<TableCell className={classes.tableTitle}>
								Episodes
							</TableCell>
							<TableCell className={classes.tableTitle}>
								Details
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody className={classes.tableBody}>
						{characterList.results.map((row) => (
							<TableRow
								key={row.id}
								className={classes.rowBody}
								style={
									row.id % 2
										? {
												background:
													'rgba(10, 34, 45, 0.7)',
										  }
										: {
												background:
													'rgba(196, 196, 196, 0.5)',
										  }
								}
							>
								<TableCell>{row.name}</TableCell>
								<TableCell>{row.status}</TableCell>
								<TableCell>{row.species}</TableCell>
								<TableCell>{row.gender}</TableCell>
								<TableCell>{row.episode.length}</TableCell>
								<TableCell>
									<Button onClick={() => handleOpen(row)}>
										detalles
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className={classes.pagination}>
					<Button onClick={handlePageDown}>pageDown</Button>
					<div>
						{!isSearching ? (
							<React.Fragment>
								{paginationItemsArr.map((item) => (
									<IconButton
										className={classes.pageNumber}
										size="small"
										key={item}
										onClick={() => setPageNumber(item)}
									>
										{item}
									</IconButton>
								))}
							</React.Fragment>
						) : (
							''
						)}
					</div>
					<Button onClick={handlePageUp}>pageUp</Button>
				</div>
			</TableContainer>
		);
	};
	const handleOpen = (char) => {
		setOpen(true);
		setSelectedCharacter(char);
		console.log('curent', char);
	};
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Box className={classes.MainView}>
			<h1>rick and morty characters</h1>
			{loading ? (
				<Box>
					<div className={classes.search}>
						<form
							className={classes.form}
							onSubmit={filteredCharacters}
						>
							<Input
								placeholder="Search…"
								className={classes.input}
							/>
						</form>
					</div>
					<TableComponent />
					<Modal
						className={classes.modal}
						open={open}
						onClose={handleClose}
					>
						<CharDetails
							characterData={selectedCharacter}
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
