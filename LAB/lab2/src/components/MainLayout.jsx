import React from 'react';
import { Outlet } from 'react-router-dom';
import Banner from './Banner';
import SearchByName from './SearchByName';
import FilterSort from './FilterSort';
import OrchidsData from '../listofOrchid/listofOrchid';

// Nhận props từ App.jsx để điều khiển Search/Sort
const MainLayout = ({ setSearchText, setFilterCategory, setSortOption }) => {
  return (
    <>
      <Banner />
      <div className="container py-4">
        {/* Thanh Search và Sort cố định */}
        <div className="bg-light p-3 rounded shadow-sm mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-7">
              <SearchByName onSearch={setSearchText} />
            </div>
            <div className="col-md-5">
              <FilterSort
                categories={[...new Set(OrchidsData.map((o) => o.category))]}
                onFilterChange={setFilterCategory}
                onSortChange={setSortOption}
              />
            </div>
          </div>
        </div>
        
        {/* Nội dung thay đổi (List hoặc Detail) sẽ hiển thị ở đây */}
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;