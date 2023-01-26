import React from 'react'
import { ItemStat } from '../interface/Pokemon'

const Stat = ({ item }:{ item:ItemStat}) =>{
  return (
    <li className="pokemon-stat">
      <span className="stat-name"><b>{item.stat.name}: </b></span>
      <span>{item.base_stat}</span>
    </li>
  )
}

export default Stat;