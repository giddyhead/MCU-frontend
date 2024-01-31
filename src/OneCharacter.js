import { useParams, useNavigate} from 'react-router-dom'
import { useState, useEffect } from 'react';
import { API_URL } from './constants';

function OneCharacter() {

    const navigate = useNavigate()

    const { name } = useParams()

    const [character, setCharacter] = useState({
        debutFilm: "",
        debutYear: 0
    })

    // 1A. the true/false value that users can control - initially false, because reading info goes before editing
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        fetch(`${API_URL}/oneMcu/${name}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(async res => {
            let result = await res.json()
            setCharacter(result.payload)
        })
    }, [name, isEditing])

    // we can see info about one character.
    // On the backend, we have a route that will accept an object that looks like:
    // {
    //     debutFilm: "Hawkeye",
    //     debutYear: 2021
    // }

    // I want to give the users the ability to do this on the front end. Here's what I imagine they might need:
    // 1. There needs to be a clear difference between "User is reading the values" vs "User is editing the values"
    //  A - some sort of true/false value
    //  B - conditionally render either <span> or <input /> based on the true/false value
    //  C - give the users a button 
    //  D - to change this value to true from being false, and vice versa
    //  E - small detail; make the edit button say "discard" when exiting "edit mode"
    // 2. A form (some input fields) to specify the values (the film/year that we want to update)
    //  A - Let users actually type into the input field && KEEP TRACK OF IT (will need it when I send the values to my DB)
    //  B - Use the same function to handle both 
    // 3. When the user is ready to submit the form, they click a button, and can read the NEW VALUES
    //  A - Need a function to handle form submission - should send state variable `character` to the backend route
    //  B - surround the input fields in a form, give it a button that runs the `handleOnSubmit`
    //  C - Some sort of behavior to confirm to the user that changes have been made
    //  D - Clean up a bug that keeps the old values, despite clicking "Discard changes"

    // 1D
    function toggleIsEditing(){
        isEditing ? setIsEditing(false) : setIsEditing(true)
    }

    // 2A - REDUNDANT
    // function updateDebutFilm(val){
    //     setCharacter((previousValue) => {
    //         return {
    //             ...previousValue,
    //             debutFilm: val
    //         }
    //     })
    //     console.log(character.debutFilm)
    // }

    // 2A - REDUNDANT
    // function updateDebutYear(val){
    //     setCharacter((previousValue) => {
    //         return {
    //             ...previousValue,
    //             debutYear: val
    //         }
    //     })
    //     console.log(character.debutYear)
    // }

    // 2B
    function updateCharacter(event){
        // I'm gonna send in the event, which is {}
        // One of the properties of the {} is target
        // target is the element - any attribute on this element is a property of target
        setCharacter((previousValue) => {
            return {
                ...previousValue,
                [event.target.name]: event.target.value
            }
        })

        console.log(character)
    }

    // 3A
    function handleOnSubmit(e){
        // prevents refreshing the page, which would cancel all operations
        e.preventDefault()

        console.log("submitted")

        fetch(`${API_URL}/updateOneMcu/${name}`, {
            method: "put",
            body: JSON.stringify(character),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(() => {
            // 3C
            setIsEditing(false)
        })
    }
function  handleDelete(){
    fetch(`${API_URL}/deleteOneMcu/${name}`,{
        method: "delete", 
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }).then(() =>{
        navigate('/mcu')
    })
}
    return (  
        <>
            <h1>{name}</h1>
            {/* 3B */}
            <form onSubmit={(e) => handleOnSubmit(e)}>
                <p>
                    Debuted in the film&nbsp;
                    {/* 1B */}
                    {
                        isEditing
                        ?
                        <input type="text" name="debutFilm" value={character.debutFilm} onChange={(e) => updateCharacter(e)}/>
                        : 
                        <span>{character.debutFilm}</span>
                    }
                </p>
                <p>
                    Released in the year&nbsp;
                    {/* 1B */}
                    {
                        isEditing
                        ?
                        <input type="text" name="debutYear" value={character.debutYear} onChange={(e) => updateCharacter(e)}/>
                        : 
                        <span>{character.debutYear}</span>
                    }
                </p>
                {isEditing ? <button type="submit">Save Changes</button> : <br />}
            </form>
            {/* 1C */}
            <button onClick={toggleIsEditing}>
                {
                    isEditing
                    ?
                    "Discard changes"
                    :
                    "Edit Character Details"
                }
            </button>
            <br />
            <button onClick={handleDelete}>
                ONE CLICK DELETE THIS CHARACTER
            </button>
        </>
    );
}

export default OneCharacter;