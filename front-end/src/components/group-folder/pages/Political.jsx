import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Political = ({user}) => {
    const nav = useNavigate()
    const politicalParties = [
        { name: "Democratic Party", abbreviation: "DNC" },
        { name: "Republican Party", abbreviation: "GOP" },
        { name: "Conservative Party of Canada", abbreviation: "CPC" },
        { name: "Liberal Party of Canada", abbreviation: "LPC" },
        { name: "Labour Party", abbreviation: "Labour" },
        { name: "Conservative Party (UK)", abbreviation: "Conservatives" },
        { name: "Liberal Democrats", abbreviation: "Lib Dems" },
        { name: "Green Party of the United States", abbreviation: "GPUS" },
        { name: "New Democratic Party", abbreviation: "NDP" },
      ];
  return (
    <div>
      <ul className='text-white flex gap-2 justify-center items-center bg-blue-500 bg-opacity-40'>
        {politicalParties.map((party, index)=>(
            <li onClick={()=> nav(`/dashboard/${user}/groups/${party.name}`)} className='cursor-pointer p-2 font-thin hover:bg-white hover:bg-opacity-30' key={index} title={party.name}>{party.abbreviation}</li>
        ))}
      </ul>
    </div>
  )
}

export default Political
