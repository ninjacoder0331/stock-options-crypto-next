import OptionsClosedPosition from "@/components/OptionsClosedPosition";
import StockClosedPosition from "@/components/stockClosedPosition";

const ClosedPositionPage = () => {
  return (
    <div>
      <input type="dropdown" placeholder="Select Stock or Options" />
      <OptionsClosedPosition />
    </div>
  )
}

export default ClosedPositionPage;
