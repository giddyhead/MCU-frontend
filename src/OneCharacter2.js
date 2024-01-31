// Use for dynamic parameter like :name, :type, etc

import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { API_URL } from "./constants";


function OneCharacter() {

    const { name } = useParams()
    const [character, setCharacter] = useState({
        debutFilm: "",
        debutYear: 0
    })
    // 1A. the true/false value that user can control - initailly false, because read info goes before editing
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        fetch(`${API_URL}/oneMcu/${name}`,  {
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then(async res =>{
            let result = await res.json()
            setCharacter(result.payload)
        })
    }, [name, isEditing])

    // 1D
    function toogleIsEditing(){
        isEditing ? setIsEditing(false) : setIsEditing (true)
    }

    // 2B
    function updateCharacter(event){
        // I'm going send in the event, which is {}4
        // One of the properties of the {} is target
        // target is the element = any attribute on this element is a property of target
        setCharacter((prevState) => {
            return{
                ...prevState,
                //[someDynamicVlaue]: someNewValue will come from the form
                [event.target.name]: event.target.value
            }
        })
        console.log(character)

    }
    // 2A
    // function updateDebutFilm(val){
    //     setCharacter((previousValue) => {
    //         return{
    //         ...previousValue,
    //         debutFilm: val
    //         }
    //     })

    // }

        // 2A
        // function updateDebutYear(val){
        //     setCharacter((previousValue) => {
        //         return{
        //         ...previousValue,
        //         debutYear: val
        //         }
        //     })
    
        // }

    function handleOnSubmit(e){
        // prevents refresing the page, which would cancel all operations
        e.preventDefault()

        console.log("submitted")

        fetch(`${API_URL}/updateOneMcu/${name}`,{
            method: "put",
            body: JSON.stringify(character),
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(() => {
            //3C
            setIsEditing(false)
        })

    }

    // we can see info about one character
    // On the backend, we have one route that wil accetp an object that looks liks
    // {
    //     "debutFilm": "Hawkeye",
    //     "debutYear": 2021
    // }

    // I want to give users the abiluty to do this on the front end. Here's what I imagine they might need:
    
    // 1. There needs to be a clear diffenece betwen "User is reading the values" vs "User is editng the values"
    //  A - some sort of true/false value
    //  B - conditionally render either <span> or <input /> bvased on the true/false value
    //  C - give the users a button to change this value to true from false, and vice versa
    //  D - to change this alue to true from being false, and vice versa
    //  E - small detail; 
    // 2. A form(some input fields) to specify the values (the film/year that we want to update)
    //  A - Let users actually type into the input field && KEEP TACK OF IT(will need it when i send the values to my DB)
    //  B - Use the same function to handle both
    // 3. When the user is ready to submit the form, they click a button, and can read the NEW VALUES
    //  A - Need a functino to handle fomr submission - should send sate varible `character` to the backend route that we aleady setup
    //  B - surround the input fields in a form, give it a button that runs the `handleOnSubmit`
    //  C-  Some sort of behavior to confirm tot he user that changes have been made
    //  D- Clean up a bug that keeps the old values, despite clicking cancelled.

    return(
        <>
           <h1>{name}</h1>
           {/* 3B */}
           <form onSubmit={(e) => handleOnSubmit(e)}>
                <p>
                        Debuted in the film&nbsp;
                        { 
                            isEditing 
                            ? 
                            <input  type="text" name="debutFilm" value={character.debutFilm} onChange={(e) => updateCharacter(e)}/> 
                            : 
                            <span>{character.debutFilm}</span>
                        }
                    </p>
                    <p>
                        Released in the year&nbsp;
                        {/* 1B */ }
                        {
                            isEditing 
                            ? 
                            <input  type="text" name="debutYear" value={character.debutYear} onChange={(e) => updateCharacter(e)}/> //onChange={updateCharacter}/> 
                            : 
                            <span>{character.debutYear}</span>
                        }
                    </p>
            {isEditing ? <button type="submit">Save Changes</button>: <br />}
           </form>
           {/* 1C */}
           <button onClick={toogleIsEditing}>
            {
                isEditing 
                ? 
                <span>Discard Changes</span>
                : 
                <span>Edit Character Details</span>
            }
           </button>
        </>
    );
}

export default OneCharacter;
// //dynamic param
// import ( useParams)