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
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.common.white,
		'&:hover': {
			backgroundColor: theme.palette.common.white,
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	pagination: {},
}));

function MainView() {
	const classes = useStyles();

	const [loading, setLoading] = useState(false);
	let [characterList, setCharacterList] = useState([]);
	let [selectedCharacter, setSelectedCharacter] = useState(null);
	const [open, setOpen] = useState(false);

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
		}
	};
	const handlePageDown = async () => {
		if (pageDown) {
			const response = await axios.get(`${pageDown}`);
			setCharacterList(response.data);
			response.data.info.prev
				? setPageDown(response.data.info.prev)
				: setPageDown(null);
		}
	};
	const filteredCharacters = async (event) => {
		event.preventDefault();
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
			} catch {
				console.log('search error');
			}
		}
	};
	const SearchBar = () => {
		return (
			<div className={classes.search}>
				<form onSubmit={filteredCharacters}>
					<Input
						placeholder="Search…"
						className={classes.inputRoot}
					/>
				</form>
			</div>
		);
	};
	const Pagination = () => {
		let pageNumbersArr = Array.from(
			{ length: characterList.info.pages },
			(_, i) => i + 1
		);
		if (pageNumbersArr.length > 40) {
			//mejorar como diferenciar entre la lista por defecto y una busqueda personalizada
			//para no mostrar los numeros de la paginacion ya que la api no permite ingresar un
			//parametro de busqueda con un numer de pagina al mismo tiempo

			return (
				<React.Fragment>
					{pageNumbersArr.map((item) => (
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
			);
		} else {
			return null;
		}
	};
	const TableComponent = () => {
		return (
			<React.Fragment>
				<TableContainer component={Paper}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell>Nombre</TableCell>
								<TableCell align="right">Status</TableCell>
								<TableCell align="right">Specie</TableCell>
								<TableCell align="right">Gender</TableCell>
								<TableCell align="right">Episodes</TableCell>
								<TableCell align="right">Details</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{characterList.results.map((row) => (
								<TableRow key={row.id}>
									<TableCell component="th" scope="row">
										{row.name}
									</TableCell>
									<TableCell align="right">
										{row.status}
									</TableCell>
									<TableCell align="right">
										{row.specie}
									</TableCell>
									<TableCell align="right">
										{row.gender}
									</TableCell>
									<TableCell align="right">
										{row.episode.length}
									</TableCell>
									<TableCell align="right">
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
						<Pagination />
						<Button onClick={handlePageUp}>pageUp</Button>
					</div>
				</TableContainer>
			</React.Fragment>
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
	function ModalDisplay() {
		return <CharDetails characterData={selectedCharacter}></CharDetails>;
	}
	return (
		<Box className={classes.MainView}>
			<p>rick and morty characters</p>
			<Box>
				{loading ? (
					<Box>
						<SearchBar />
						<TableComponent />
						<Modal
							className={classes.modal}
							open={open}
							onClose={handleClose}
						>
							<ModalDisplay />
						</Modal>
					</Box>
				) : (
					<CircularProgress style={{ marginTop: 40 }} />
				)}
			</Box>
		</Box>
	);
}

export default MainView;
