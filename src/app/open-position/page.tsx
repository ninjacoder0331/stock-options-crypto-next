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
    const result = apiClient.get("/api/trader/openpositions")
    .then((res) => {
      console.log(res.data);
      setStockOpenPositions(res.data.stocks);
      setOpenPositions(res.data.options);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    })
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
