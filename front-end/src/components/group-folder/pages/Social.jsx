import React from 'react'
import { useNavigate } from 'react-router-dom';

const Social = ({user}) => {
    const nav = useNavigate()
    const socialGroups = [
        { name: "Black Lives Matter", abbreviation: "BLM" },
        { name: "LGBTQ+ Community", abbreviation: "LGBTQ+" },
        { name: "Mothers Against Drunk Driving", abbreviation: "MADD" },
        { name: "American Civil Liberties Union", abbreviation: "ACLU" },
        { name: "People for the Ethical Treatment of Animals", abbreviation: "PETA" },
        { name: "National Association for the Advancement of Colored People", abbreviation: "NAACP" },
        { name: "Antifa", abbreviation: "Antifa" },
        { name: "Occupy Wall Street", abbreviation: "OWS" },
        { name: "Extinction Rebellion", abbreviation: "XR" },
        { name: "Amnesty International", abbreviation: "AI" },
        { name: "Human Rights Campaign", abbreviation: "HRC" },
      ];
  return (
    <div>
      <ul className='text-white flex gap-2 justify-center items-center bg-blue-500 bg-opacity-40'>
            {socialGroups.map((group,index)=>(
                <li onClick={()=> nav(`/dashboard/${user}/groups/${group.name}`)} title={group.name} className='cursor-pointer font-thin p-2 hover:bg-white hover:bg-opacity-30' key={index}>{group.abbreviation}</li>
            ))}
        </ul>
    </div>
  )
}

export default Social
