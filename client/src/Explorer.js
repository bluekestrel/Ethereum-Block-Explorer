import React from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

class Explorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            blockInfo: [],
            open: {},
        }
    }

    componentDidMount() {
        this.callBackendAPI("/")
            .then((res) => {
                this.setState(
                    () => {
                        this.checkForNewBlock();
                    }
                );
            })
            .catch(err => console.log(err));
    }

    // fetching the GET route from the Express server which matches the GET route from server.js
    callBackendAPI = async (route) => {
        const response = await fetch(`http://localhost:3042${route}`);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    };

    checkForNewBlock() {
        setInterval(() => {
            this.callBackendAPI("/poll")
            .then((res) => {
                if (!(this.state.data.includes(res.block.number))) {
                    let openState = { ...this.state.open };
                    openState[res.block.number] = false;
                    this.setState((prevState) => (
                        {
                            data: [...prevState.data, res.block.number],
                            blockInfo: [...prevState.blockInfo, res.block],
                            open: openState,
                        }
                    ));
                }
            })
            .catch(err => console.log(err));
        }, 10000)
    }

    updateState(currBlockNumber) {
        let newOpenState = { ...this.state.open };
        newOpenState[currBlockNumber] = !newOpenState[currBlockNumber];
        this.setState({open: newOpenState});
    }

    render() {
        return (
            <div className="App">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ethereum Blocks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.blockInfo.map((block) => (
                                <><TableRow
                                    key={block.number}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => this.updateState(block.number)}
                                        >
                                            {this.state.open[block.number] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {block.number}
                                    </TableCell>
                                </TableRow><TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={this.state.open[block.number]} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Block Information
                                                    </Typography>
                                                    <Table size="small" aria-label="purchases">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Timestamp</TableCell>
                                                                <TableCell>Gas Used</TableCell>
                                                                <TableCell>Hash</TableCell>
                                                                <TableCell>Miner</TableCell>
                                                                <TableCell>Nonce</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow key={JSON.stringify(block.timestamp)}>
                                                                <TableCell component="th" scope="row">
                                                                    {JSON.stringify(block.timestamp)}
                                                                </TableCell>
                                                                <TableCell>{JSON.stringify(block.gasUsed.hex)}</TableCell>
                                                                <TableCell>{JSON.stringify(block.hash)}</TableCell>
                                                                <TableCell>{JSON.stringify(block.miner)}</TableCell>
                                                                <TableCell>{JSON.stringify(block.nonce)}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow></>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

export default Explorer