'use client'

import TitleLine from "@/components/TitleLine"
import ProfitLost from "@/components/ProfitLose"
import { useEffect, useState } from "react"
import apiClient from "@/lib/axios"

const ProfitLossPage = () => {

  const [plData , setPlData] = useState([])
  const [isLoading , setIsLoading] = useState(false)

  useEffect(()=>{
    setIsLoading(true)
    apiClient.get("/api/brokerage/profitLoss").then((res)=>{
      setPlData(res.data)
      console.log(res.data)
      setIsLoading(false)
    }).catch((err)=>{
      setIsLoading(false)
    })
  },[])                                                                                                           

  if(isLoading){
    return <div>Loading...</div>
  }

    return (
        <div>
          <TitleLine title="Profit & Loss" description="View your profit and loss" />

          <ProfitLost data={plData} />
        </div>
    )
}
    
export default ProfitLossPage
