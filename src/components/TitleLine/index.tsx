

const TitleLine = ({title, description}: {title: string, description: string}) => {
  return (
    <div className="mb-8 w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
            {title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1 w-20 bg-primary rounded"></span>
            <span className="h-1 w-4 bg-primary/60 rounded"></span>
            <span className="h-1 w-2 bg-primary/40 rounded"></span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
  );
};

export default TitleLine;
