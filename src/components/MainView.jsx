import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { TextField, Button, Modal } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { Paper, Box } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Autocomplete from '@material-ui/lab/Autocomplete';

import CharDetails from './CharDetails';

const useStyles = makeStyles((theme) => ({}));

function MainView() {
	const classes = useStyles();
	let [pageNumber, setPageNumber] = useState(1);
	const [loading, setLoading] = useState(false);
	let [idsArr, setIdsArr] = useState(0);
	let [autocompList, setAutocompList] = useState([]);
	let [characterList, setCharacterList] = useState([]);
	let [selectedCharacter, setSelectedCharacter] = useState(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		getCharacters();
		getAutData();
	}, []);

	const getCharacters = async () => {
		let totalIds = 1;
		let range = [];
		try {
			const response = await axios.get(
				`https://rickandmortyapi.com/api/character/?page=${pageNumber}`
			);
			totalIds = response.data.info.count;
			range = Array.from({ length: totalIds }, (_, i) => i + 1);
			setIdsArr(range);
			setCharacterList(response.data.results);
		} catch {
			console.log('error con la api');
		}
	};

	const getAutData = async () => {
		let autocomp = [];
		try {
			const response = await axios.get(
				`https://rickandmortyapi.com/api/character/${idsArr}`
			);
			for (let item of response.data) {
				autocomp.push(item.name);
			}
			setAutocompList(autocomp);
		} catch {
			console.log('error con el autocomplete');
		}
	};
	const filteredCharacters = async (char) => {
		let filteredList = characterList.filter((element) => {
			let elementName = element.name.toUpperCase();
			let character = char.toUpperCase();
			if (elementName.includes(character)) {
				return element;
			}
			return null;
		});
		console.log(filteredList);
		setCharacterList(filteredList);
	};
	const SearchBar = () => {
		// aca se renderiza la searchbar y todo lo del autocomplete
		return (
			<div className={classes.input}>
				<Autocomplete
					disablePortal
					id="char-autocomplete"
					getOptionLabel={(autocomp) => {
						return `${autocomp}`;
					}}
					options={autocompList}
					noOptionsText={'No characters found'}
					renderInput={(params) => (
						<div style={{ display: 'flex' }}>
							<TextField
								size="fullWidth"
								variant="outlined"
								{...params}
								label="Search characters"
								placeholder="Enter a character name"
							/>
							<Button
								style={{
									padding: 15,
									paddingLeft: 30,
									paddingRight: 30,
									marginLeft: 5,
									background: '#0794E3',
									color: '#FAFAFA',
									boxShadow: 'none',
								}}
								variant="contained"
								onClick={() => {
									filteredCharacters(params.inputProps.value);
								}}
							>
								Search
							</Button>
						</div>
					)}
				/>
			</div>
		);
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
							{characterList.map((row) => (
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
										<button onClick={() => handleOpen(row)}>
											detalles
										</button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Button
						onClick={
							((pageNumber = 1), console.log('page', pageNumber))
						}
					>
						1
					</Button>
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
		</Box>
	);
}

export default MainView;
