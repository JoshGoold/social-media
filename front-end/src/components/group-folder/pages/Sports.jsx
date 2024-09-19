import React from 'react'
import { useNavigate } from 'react-router-dom';

const Sports = ({user}) => {
    const nav = useNavigate()
    const sports = [
        { name: "National Football League", abbreviation: "NFL" },
        { name: "National Basketball Association", abbreviation: "NBA" },
        { name: "Major League Baseball", abbreviation: "MLB" },
        { name: "National Hockey League", abbreviation: "NHL" },
        { name: "Major League Soccer", abbreviation: "MLS" },
        { name: "Professional Golfers' Association", abbreviation: "PGA" },
        { name: "Ultimate Fighting Championship", abbreviation: "UFC" },
        { name: "Association of Tennis Professionals", abbreviation: "ATP" },
        { name: "Women's Tennis Association", abbreviation: "WTA" },
        { name: "National Association for Stock Car Auto Racing", abbreviation: "NASCAR" },
        { name: "Fédération Internationale de Football Association", abbreviation: "FIFA" },
        { name: "Formula One", abbreviation: "F1" },
        { name: "National Collegiate Athletic Association", abbreviation: "NCAA" },
        { name: "World Wrestling Entertainment", abbreviation: "WWE" },
        { name: "Women's National Basketball Association", abbreviation: "WNBA" },
        { name: "Rugby Football League", abbreviation: "RFL" }
      ];
      
  return (
    <div>
        <ul className='text-white flex gap-2 justify-center items-center bg-blue-500 bg-opacity-40'>
            {sports.map((sport,index)=>(
                <li onClick={()=> nav(`/dashboard/${user}/groups/${sport.name}`)} title={sport.name} className='cursor-pointer font-thin p-2 hover:bg-white hover:bg-opacity-30' key={index}>{sport.abbreviation}</li>
            ))}
        </ul>
      
    </div>
  )
}

export default Sports
