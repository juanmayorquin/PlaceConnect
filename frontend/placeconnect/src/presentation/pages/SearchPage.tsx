/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchProps } from '../../infrastructure/searchService';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SearchPage: React.FC = () => {
  const [filters, setFilters] = useState({ type:'', minPrice:'', maxPrice:'' });
  const [results, setResults] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const handleSearch = async () => {
    const res = await searchProps(filters);
    setResults(res.data);
    if(!res.data.length) setMsg('No se encontraron resultados');
  };
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Buscar Avisos</h1>
      <div className="grid gap-4 mb-6 md:grid-cols-4">
        <Input placeholder="Tipo" value={filters.type} onChange={e=>setFilters({...filters,type:e.target.value})}/>
        <Input placeholder="Precio min" type="number" value={filters.minPrice} onChange={e=>setFilters({...filters,minPrice:e.target.value})}/>
        <Input placeholder="Precio max" type="number" value={filters.maxPrice} onChange={e=>setFilters({...filters,maxPrice:e.target.value})}/>
        <Button onClick={handleSearch}>Buscar</Button>
      </div>
      {msg && <p className="text-red-500 mb-4">{msg}</p>}
      <div className="grid gap-4 md:grid-cols-3">
        {results.map(p=>(
          <Link key={p._id} to={`/properties/${p._id}`} className="border p-4 rounded">
            <h2 className="font-semibold">{p.title}</h2>
            <p>${p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default SearchPage;