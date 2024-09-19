import React from 'react'
import { useNavigate } from 'react-router-dom';

const Academic = ({user}) => {
    const nav = useNavigate()
    const academicGroups = [
        { name: "American Psychological Association", abbreviation: "APA" },
        { name: "Institute of Electrical and Electronics Engineers", abbreviation: "IEEE" },
        { name: "Association for Computing Machinery", abbreviation: "ACM" },
        { name: "National Academy of Sciences", abbreviation: "NAS" },
        { name: "Modern Language Association", abbreviation: "MLA" },
        { name: "American Medical Association", abbreviation: "AMA" },
        { name: "International Society for Technology in Education", abbreviation: "ISTE" },
        { name: "National Association for the Education of Young Children", abbreviation: "NAEYC" },
        { name: "American Association of University Professors", abbreviation: "AAUP" },
        { name: "American Educational Research Association", abbreviation: "AERA" },
        { name: "Council for the Advancement and Support of Education", abbreviation: "CASE" },
        { name: "American Society of Civil Engineers", abbreviation: "ASCE" },
        { name: "American Philosophical Association", abbreviation: "APA" },
        { name: "National Honor Society", abbreviation: "NHS" },
        { name: "American Sociological Association", abbreviation: "ASA" },
      ];
  return (
    <div>
      <ul className='text-white flex gap-2 justify-center items-center bg-blue-500 bg-opacity-40'>
            {academicGroups.map((group,index)=>(
                <li onClick={()=> nav(`/dashboard/${user}/groups/${group.name}`)} title={group.name} className='cursor-pointer p-2 font-thin hover:bg-white hover:bg-opacity-30' key={index}>{group.abbreviation}</li>
            ))}
        </ul>
      
    </div>
  )
}

export default Academic
