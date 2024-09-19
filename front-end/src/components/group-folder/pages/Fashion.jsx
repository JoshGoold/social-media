import React from 'react'
import { useNavigate } from 'react-router-dom';

const Fashion = ({user}) => {
    const nav = useNavigate()
    const fashionGroups = [
        { name: "Council of Fashion Designers of America", abbreviation: "CFDA" },
        { name: "British Fashion Council", abbreviation: "BFC" },
        { name: "Fashion Designers Association of America", abbreviation: "FDAA" },
        { name: "International Textile and Apparel Association", abbreviation: "ITAA" },
        { name: "Fashion Group International", abbreviation: "FGI" },
        { name: "Camera Nazionale della Moda Italiana", abbreviation: "CNMI" },
        { name: "Fédération de la Haute Couture et de la Mode", abbreviation: "FHCM" },
        { name: "International Wool Textile Organization", abbreviation: "IWTO" },
        { name: "World Fashion Organization", abbreviation: "WFO" },
        { name: "European Fashion Council", abbreviation: "EFC" },
        { name: "The Business of Fashion", abbreviation: "BoF" },
        { name: "Textile Exchange", abbreviation: "TE" },
        { name: "International Fashion Academy", abbreviation: "IFA" },
        { name: "Asia Fashion Federation", abbreviation: "AFF" },
        { name: "International Association of Clothing Designers & Executives", abbreviation: "IACDE" },
        { name: "Fashion Law Institute", abbreviation: "FLI" },
        { name: "The Ethical Fashion Initiative", abbreviation: "EFI" },
        { name: "Sustainable Apparel Coalition", abbreviation: "SAC" }
      ];
  return (
    <div>
      <ul className='text-white flex gap-2 justify-center items-center bg-blue-500 bg-opacity-40'>
        {fashionGroups.map((group, index)=>(
            <li onClick={()=> nav(`/dashboard/${user}/groups/${group.name}`)} className='cursor-pointer p-2 hover:bg-white font-thin hover:bg-opacity-30' key={index} title={group.name}>{group.abbreviation}</li>
        ))}
      </ul>
    </div>
  )
}

export default Fashion
