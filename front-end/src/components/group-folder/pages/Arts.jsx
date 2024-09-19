import React from 'react'
import { useNavigate } from 'react-router-dom';

const Arts = ({user}) => {
    const nav = useNavigate()
    const artsGroups = [
        { name: "American Society of Composers, Authors, and Publishers", abbreviation: "ASCAP" },
        { name: "Broadcast Music, Inc.", abbreviation: "BMI" },
        { name: "Academy of Motion Picture Arts and Sciences", abbreviation: "AMPAS" },
        { name: "American Theatre Wing", abbreviation: "ATW" },
        { name: "National Endowment for the Arts", abbreviation: "NEA" },
        { name: "Society of Illustrators", abbreviation: "SOI" },
        { name: "Writers Guild of America", abbreviation: "WGA" },
        { name: "Directors Guild of America", abbreviation: "DGA" },
        { name: "Screen Actors Guild", abbreviation: "SAG" },
        { name: "The Art Directors Guild", abbreviation: "ADG" },
        { name: "Graphic Artists Guild", abbreviation: "GAG" },
        { name: "Royal Academy of Arts", abbreviation: "RA" },
        { name: "International Association of Art", abbreviation: "IAA" },
        { name: "The Dramatists Guild of America", abbreviation: "DGA" },
        { name: "American Guild of Musical Artists", abbreviation: "AGMA" },
        { name: "The Recording Academy", abbreviation: "NARAS" },
        { name: "International Sculpture Center", abbreviation: "ISC" }
      ];
  return (
    <div>
      <ul className='text-white flex gap-2 justify-center items-center bg-blue-500 bg-opacity-40'>
        {artsGroups.map((group, index)=>(
            <li onClick={()=> nav(`/dashboard/${user}/groups/${group.name}`)} className='cursor-pointer p-2 hover:bg-white font-thin hover:bg-opacity-30' key={index} title={group.name}>{group.abbreviation}</li>
        ))}
      </ul>
    </div>
  )
}

export default Arts
