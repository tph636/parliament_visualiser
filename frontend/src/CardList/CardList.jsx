import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './CardList.css';


/* CardList chooses which members will be shown based on the given filters */

const CardList = ({ seats, members, onCardClick}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('valihuuto-descending');
  const [parliamentGroup, setparliamentGroup] = useState('Kaikki eduskuntaryhmät')


  // Filter and sort seats based on search term and sort order
  const filteredSeats = seats
    .filter(seat => {
      const member = members.find(mem => mem.personId === seat.hetekaId);
      if (!member) return false;
      const fullName = `${member.firstname} ${member.lastname}`.toLowerCase();
      if (parliamentGroup != 'Kaikki eduskuntaryhmät') {
        return fullName.includes(searchTerm.toLowerCase()) && ( member.parliamentGroup == parliamentGroup)
      } else {
        return fullName.includes(searchTerm.toLowerCase())
      }
    })
    .sort((a, b) => {
      const memberA = members.find(mem => mem.personId === a.hetekaId);
      const memberB = members.find(mem => mem.personId === b.hetekaId);
      const huutoA = memberA.valihuuto_count || 0;
      const huutoB = memberB.valihuuto_count || 0;
      const birthYearA = memberA.birthYear;
      const birthYearB = memberB.birthYear;

      if (sortOrder === 'valihuuto-ascending') {
        return huutoA - huutoB;
      } else if (sortOrder === 'valihuuto-descending') {
        return huutoB - huutoA;
      } else if (sortOrder === 'age-ascending') {
        return birthYearA - birthYearB;
      } else if (sortOrder === 'age-descending') {
        return birthYearB - birthYearA;
      } else {
        return 0;
      }
    });

  return (
    <div className='card-list'>

      <div className='filter-container'>
        
        <input
          type="text"
          placeholder="Etsi kansanedustajaa"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <div className='parliamentGroup-dropdown'>
          <select id="parliamentGroup" value={parliamentGroup} onChange={e => setparliamentGroup(e.target.value)} className="dropdown">
            {["Kaikki eduskuntaryhmät", ...new Set(members.map(mem => mem.parliamentGroup))].map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select> 
        </div>

        <div className='sort-dropdown'>
          <select id="sortOrder" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="dropdown">
            <option value="valihuuto-ascending">Vähiten välihuutoja</option>
            <option value="valihuuto-descending">Eniten välihuutoja</option>
            <option value="age-descending">Nuorin</option>
            <option value="age-ascending">Vanhin</option>
          </select>
        </div>

      </div>

      <div className="cards">
        {filteredSeats.map(seat => {
          const member = members.find(mem => mem.personId === seat.hetekaId);
          const huuto = member.valihuuto_count || 0;
          return (
            <Card key={seat.seatNumber} seat={seat} member={member} valihuutoAmount={huuto || { count: 0 }} onCardClick={onCardClick} />
          );
        })}
      </div>

    </div>
  );
};

export default CardList;
