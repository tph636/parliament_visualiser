import React from "react";
import { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './CardList.css';
import type { Member } from "../../types/Member";


// Props for the CardList component
type CardListProps = {
  members: Member[];
  onCardClick?: (member: Member) => void;
};

export default function CardList({ members, onCardClick }: CardListProps): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('valihuuto-descending');
  const [parliamentGroup, setParliamentGroup] = useState<string>('Kaikki eduskuntaryhmät');

  // Restore state from sessionStorage
  useEffect(() => {
    const storedSearch = sessionStorage.getItem('searchTerm');
    const storedSortOrder = sessionStorage.getItem('sortOrder');
    const storedParliamentGroup = sessionStorage.getItem('parliamentGroup');

    if (storedSearch) setSearchTerm(storedSearch);
    if (storedSortOrder) setSortOrder(storedSortOrder);
    if (storedParliamentGroup) setParliamentGroup(storedParliamentGroup);
  }, []);

  // Save to sessionStorage on changes
  useEffect(() => {
    sessionStorage.setItem('searchTerm', searchTerm);
    sessionStorage.setItem('sortOrder', sortOrder);
    sessionStorage.setItem('parliamentGroup', parliamentGroup);
  }, [searchTerm, sortOrder, parliamentGroup]);

  // Filter and sort logic
  const filteredMembers = members
    .filter(member => {
      const fullName = `${member.firstname} ${member.lastname}`.toLowerCase();
      if (parliamentGroup !== 'Kaikki eduskuntaryhmät') {
        return fullName.includes(searchTerm.toLowerCase()) && member.parliament_group === parliamentGroup;
      }
      return fullName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const huutoA = a.valihuuto_count ?? 0;
      const huutoB = b.valihuuto_count ?? 0;
      const birthYearA = a.birth_year;
      const birthYearB = b.birth_year;

      switch (sortOrder) {
        case 'valihuuto-ascending':
          return huutoA - huutoB;
        case 'valihuuto-descending':
          return huutoB - huutoA;
        case 'age-ascending':
          return birthYearA - birthYearB;
        case 'age-descending':
          return birthYearB - birthYearA;
        default:
          return 0;
      }
    });

  return (
    <div className="card-list">
      <div className="filter-container">
        <input
          type="text"
          placeholder="Etsi kansanedustajaa"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <div className="parliamentGroup-dropdown">
          <select
            id="parliamentGroup"
            value={parliamentGroup}
            onChange={e => setParliamentGroup(e.target.value)}
            className="dropdown"
          >
            {["Kaikki eduskuntaryhmät", ...new Set(members.map(mem => mem.parliament_group))].map(group => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-dropdown">
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="dropdown"
          >
            <option value="valihuuto-ascending">Vähiten välihuutoja</option>
            <option value="valihuuto-descending">Eniten välihuutoja</option>
            <option value="age-descending">Nuorin</option>
            <option value="age-ascending">Vanhin</option>
          </select>
        </div>
      </div>

      <div className="cards" key={`${searchTerm}-${sortOrder}-${parliamentGroup}`}>
        {filteredMembers.map(member => {
          const huuto = member.valihuuto_count ?? 0;
          return (
            <Card
              key={member.person_id}
              member={member}
            />
          );
        })}
      </div>
    </div>
  );
}
