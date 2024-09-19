import React from 'react'
import { useNavigate } from 'react-router-dom';

const Technology = ({user}) => {
    const nav = useNavigate()
    const techIndustries = [
        { name: "Artificial Intelligence", abbreviation: "AI" },
        { name: "Information Technology", abbreviation: "IT" },
        { name: "Software as a Service", abbreviation: "SaaS" },
        { name: "Cloud Computing", abbreviation: "Cloud" },
        { name: "Internet of Things", abbreviation: "IoT" },
        { name: "Cybersecurity", abbreviation: "Cybersec" },
        { name: "Blockchain Technology", abbreviation: "Blockchain" },
        { name: "Virtual Reality", abbreviation: "VR" },
        { name: "Big Data Analytics", abbreviation: "Big Data" },
        { name: "Robotics Process Automation", abbreviation: "RPA" },
        { name: "Fintech (Financial Technology)", abbreviation: "Fintech" },
        { name: "Quantum Computing", abbreviation: "Quantum" },
        { name: "Autonomous Vehicles", abbreviation: "AV" },
        { name: "Biotechnology", abbreviation: "Biotech" }
      ];
  return (
    <div>
      <ul className='text-white flex gap-2 justify-center items-center bg-blue-500 bg-opacity-40'>
            {techIndustries.map((tech,index)=>(
                <li onClick={()=> nav(`/dashboard/${user}/groups/${tech.name}`)} title={tech.name} className='cursor-pointer font-thin p-2 hover:bg-white hover:bg-opacity-30' key={index}>{tech.abbreviation}</li>
            ))}
        </ul>
    </div>
  )
}

export default Technology
