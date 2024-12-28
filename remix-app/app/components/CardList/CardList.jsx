import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './CardList.css';

const CardList = ({ members, onCardClick }) => {
  // Initialize state with default values
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('valihuuto-descending');
  const [parliamentGroup, setParliamentGroup] = useState('Kaikki eduskuntaryhmät');

  // Restore state from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSearch = sessionStorage.getItem('searchTerm');
      const storedSortOrder = sessionStorage.getItem('sortOrder');
      const storedParliamentGroup = sessionStorage.getItem('parliamentGroup');

      if (storedSearch) setSearchTerm(storedSearch);
      if (storedSortOrder) setSortOrder(storedSortOrder);
      if (storedParliamentGroup) setParliamentGroup(storedParliamentGroup);
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('searchTerm', searchTerm);
      sessionStorage.setItem('sortOrder', sortOrder);
      sessionStorage.setItem('parliamentGroup', parliamentGroup);
    }
  }, [searchTerm, sortOrder, parliamentGroup]);



  // Filter and sort members based on search term and sort order
  const filteredMembers = members
    .filter(member => {
      const fullName = `${member.firstname} ${member.lastname}`.toLowerCase();
      if (parliamentGroup !== 'Kaikki eduskuntaryhmät') {
        return fullName.includes(searchTerm.toLowerCase()) && (member.parliament_group === parliamentGroup);
      } else {
        return fullName.includes(searchTerm.toLowerCase());
      }
    })
    .sort((a, b) => {
      const huutoA = a.valihuuto_count || 0;
      const huutoB = b.valihuuto_count || 0;
      const birthYearA = a.birth_year;
      const birthYearB = b.birth_year;

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
          <select id="parliamentGroup" value={parliamentGroup} onChange={e => setParliamentGroup(e.target.value)} className="dropdown">
            {["Kaikki eduskuntaryhmät", ...new Set(members.map(mem => mem.parliament_group))].map(group => (
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
      <div className="cards" key={`${searchTerm}-${sortOrder}-${parliamentGroup}`}>
        {filteredMembers.map(member => {
          const huuto = member.valihuuto_count || 0;
          return (
            <Card key={member.person_id} member={member} valihuutoAmount={huuto} onCardClick={onCardClick} />
          );
        })}
      </div>
    </div>
  );
};

export default CardList;
