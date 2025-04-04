import OptionsClosedPosition from "@/components/OptionsClosedPosition";
import StockClosedPosition from "@/components/stockClosedPosition";

const ClosedPositionPage = () => {
  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col gap-2 align-middle">
          <h1 className="text-2xl md:text-3xl flex flex-row gap-3 font-bold text-black dark:text-white">
            Closed Position
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1 w-20 bg-primary rounded"></span>
            <span className="h-1 w-4 bg-primary/60 rounded"></span>
            <span className="h-1 w-2 bg-primary/40 rounded"></span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View your closed positions.
          </p>
        </div>
      </div>

      <OptionsClosedPosition />
    </div>
  )
}

export default ClosedPositionPage;
