import React, { useState } from 'react';
import { API_URL } from './constants';
import {useNavigate} from 'react-router-dom'


function CreateCharacter() {

    const navigate = useNavigate()
    // const [name, setName] = useState("")
    // const [debut, setDebut] = useState("")
    // const [debutYear, setDutYear] = useState(0)'

    const [character, setCharacter] = useState({
        name: "",
        debutFilm: "",
        debutYear: 0
    })

    async function postCharacter(){
        fetch(`${API_URL}/createOneMcu`,{
            method: "post",
            body: JSON.stringify(character),
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(async res => {
            let serverResponse = await res.json()
            navigate(`/mcu/${serverResponse.payload.name}`)
            console.log(serverResponse)
        }).catch((e) => console.log(e))


        setCharacter({
            name: "",
            debutFilm: "",
            debutYear: 0
        })
    }

    function handleOnSubmit(event){
        event.preventDefault()
    
        postCharacter()
    }
    return ( 
        <form onSubmit={(e) => handleOnSubmit(e)}>
            <label>Name</label>
            <input value={character.name} onChange={(e) => setCharacter({...character, name: e.target.value})} />
            <br /><br />
            <label>debutFilm</label>
            <input value={character.debutFilm} onChange={(e) => setCharacter({...character, debutFilm: e.target.value})} />
            <br /><br />
            <label>debutYear</label>
            <input value={character.debutYear} onChange={(e) => setCharacter({...character, debutYear: e.target.value})} />
            <br /><br />
            <button type="submit">Submit new Character</button>
        </form>

     );
}

export default CreateCharacter;