'use client'

import OpenOptionsPositions from '@/components/OpenOptionsPositions';
import OpenStockPositions from '@/components/OpenStockPositions';
import TitleLine from '@/components/TitleLine';
import apiClient from '@/lib/axios';
import { useState , useEffect } from 'react';

const OpenPositionPage = () => {

  const [openPositions, setOpenPositions] = useState([]);
  const [stockOpenPositions, setStockOpenPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/api/trader/openpositions");
        setStockOpenPositions(response.data.stocks);
        setOpenPositions(response.data.options);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval
    const interval = setInterval(fetchData, 10000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);


    if (isLoading) {
      return <div>Loading...</div>
    }

      

    return (
      <div>
        <TitleLine title="Open Positions" description="My stock and options open positions" />

          {/* Table Controls */}
        <div className='flex flex-col gap-4'>
          
          <OpenStockPositions   stockOpenPositions={stockOpenPositions} />

          <br className=''/>

          <OpenOptionsPositions openPositions={openPositions} />
        </div>
      
      </div>
    )
}

export default OpenPositionPage;
