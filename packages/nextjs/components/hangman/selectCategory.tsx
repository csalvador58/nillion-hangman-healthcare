import { BookOpenIcon, ExclamationCircleIcon, GlobeAltIcon, WrenchScrewdriverIcon } from "@heroicons/react/20/solid";

const Icons = {
  modalities: <WrenchScrewdriverIcon className="w-16 h-16 mx-auto" />,
  diseases: <ExclamationCircleIcon className="w-16 h-16 mx-auto" />,
  terminologies: <BookOpenIcon className="w-16 h-16 mx-auto" />,
  web3: <GlobeAltIcon className="w-16 h-16 mx-auto" />,
};

interface SelectCategoryProps {
  categories: string[];
  setTopicAndInitGame: (selectedCategory: string) => void;
}

export default function SelectCategory({ categories, setTopicAndInitGame }: SelectCategoryProps) {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-center">Select a Topic</h1>
      <ul role="list" className="grid gap-6 sm:grid-cols-2 p-4">
        {categories.map(item => {
          const iconComponent = Object.entries(Icons).find(([key, _value]) => key === item)?.[1] ?? null;
          return (
            <li key={item} className="col-span-1 min-w-[215px]">
              <button
                className="btn btn-lg h-fit w-full"
                onClick={() => setTopicAndInitGame(item.charAt(0).toUpperCase() + item.slice(1, item.length))}
              >
                <div className="flex w-full items-center justify-center space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {item.charAt(0).toUpperCase() + item.slice(1, item.length)}
                    </p>
                    <div className="flex-shrink-0">{iconComponent}</div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
