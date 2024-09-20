import React from 'react'
import { useNavigate } from 'react-router-dom';

const Religion = ({user}) => {
    const nav = useNavigate()
    const religions = [
      { name: "Christianity", abbreviation: "CHR" },
      { name: "Islam", abbreviation: "ISL" },
      { name: "Hinduism", abbreviation: "HIN" },
      { name: "Buddhism", abbreviation: "BUD" },
      { name: "Judaism", abbreviation: "JUD" },
      { name: "Sikhism", abbreviation: "SIK" },
      { name: "Bahá'í Faith", abbreviation: "BAH" },
      { name: "Jainism", abbreviation: "JAI" },
      { name: "Shinto", abbreviation: "SHI" },
      { name: "Zoroastrianism", abbreviation: "ZOR" },
      { name: "Taoism", abbreviation: "TAO" },
      { name: "Confucianism", abbreviation: "CON" }
    ];
    
  return (
    <div>
      <ul className='text-white flex gap-2 justify-center items-center bg-blue-500 bg-opacity-40'>
        {religions.map((group, index)=>(
            <li onClick={()=> nav(`/dashboard/${user}/groups/${group.name}`)} className='cursor-pointer p-2 hover:bg-white font-thin hover:bg-opacity-30' key={index} title={group.name}>{group.abbreviation}</li>
        ))}
      </ul>
    </div>
  )
}

export default Religion
