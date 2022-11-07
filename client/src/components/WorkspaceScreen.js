import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/

const alertStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1976d2',
    boxShadow: 24,
    p: 4,
    color: '#FFFFFF'
};

const buttonStyle = {
    position: 'absolute',
    top: '-10%',
    left: '85%',
    width: 400,
    p: 4,
    color: '#FFFFFF',
    width: '1%',
    height: '1%',
    fontSize: '24px',
    fontWeight: 'bold'
}

// GETPLAYLISTBYID WILL THROW A 400 IF THE LIST DOES NOT BELONG
// TO THE USER
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();
    const history = useHistory();
    const [listAccessModalIsActive, setModalIsActive] = useState(false);
    
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    // SET THE APPROPRIATE VALUE FOR LISTACCESSMODALISACTIVE
    // THIS VALIDATES THAT ONLY THE USERS OWNED LISTS WILL BE SHOWN
    // AND THAT WE ARE NOT ACCESSING SOMEONE ELSES LISTS
    if (!store.currentList && !listAccessModalIsActive) {
        setModalIsActive(true);
    } else if (store.currentList && listAccessModalIsActive) {
        setModalIsActive(false);
    }

    return (
        <>
        {listAccessModalIsActive &&
            <Modal
                open={true}
                onClose={() => { setModalIsActive(false);
                    history.push("/"); }}
            >
                <Alert severity="warning" sx={alertStyle}>
                    <Button 
                        sx={buttonStyle}
                        onClick={() => {setModalIsActive(false);
                            history.push("/");}}
                    >
                            ✖
                    </Button>
                    <AlertTitle>Error</AlertTitle>
                    You cannot access the playlist this way. You can access
                    only your owned playlists through the home screen. 
                </Alert>
            </Modal>
        }
        <Box>
        <List 
            id="playlist-cards" 
            sx={{ width: '100%', bgcolor: 'background.paper' }}
        >
            {
                store.currentList && store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))  
            }
         </List>            
         { modalJSX }
         </Box>
         </>
    )
}

export default WorkspaceScreen;