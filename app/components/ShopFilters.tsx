import {useCallback, useState} from 'react';
import {useLocation, useNavigate} from 'react-router';

export const SORT_ENUM = {
  TITLE: 'TITLE',
  PRICE: 'PRICE',
  BEST_SELLING: 'BEST_SELLING',
  CREATED: 'CREATED',
};

export interface ISortItem {
  id: string;
  label: string;
  reverse: boolean;
  value: string | undefined;
  slug: string;
}

export interface IFilterItem {
  id: string;
  label: string;
  input: string;
}

export interface IFilters {
  id: string;
  label: string;
  type: string;
  values: IFilterItem[];
}

export const SortList: ISortItem[] = [
  {
    id: '0',
    label: 'Default',
    reverse: false,
    value: SORT_ENUM.TITLE,
    slug: 'default',
  },
  {
    id: '3',
    label: 'Alphabetically, A-Z',
    reverse: false,
    value: SORT_ENUM.TITLE,
    slug: 'title-ascending',
  },
  {
    id: '4',
    label: 'Alphabetically, Z-A',
    reverse: true,
    value: SORT_ENUM.TITLE,
    slug: 'title-descending',
  },
  {
    id: '2',
    label: 'Best Selling',
    reverse: false,
    value: SORT_ENUM.BEST_SELLING,
    slug: 'best-selling',
  },
  {
    id: '7',
    label: 'Date, old to new',
    reverse: false,
    value: SORT_ENUM.CREATED,
    slug: 'created-ascending',
  },
  {
    id: '8',
    label: 'Date, new to old',
    reverse: true,
    value: SORT_ENUM.CREATED,
    slug: 'created-descending',
  },
  {
    id: '5',
    label: 'Price, low to high',
    reverse: false,
    value: SORT_ENUM.PRICE,
    slug: 'price-ascending',
  },
  {
    id: '6',
    label: 'Price, high to low',
    reverse: true,
    value: SORT_ENUM.PRICE,
    slug: 'price-descending',
  },
];

export default function ShopFilters({filters}: {filters: IFilters[]}) {
  const location = useLocation();
  const navigate = useNavigate();

  // States ******************************************************************* //
  const [sortValue, setSortValue] = useState(SortList[0].slug);
  const [filterValues, setFilterValues] = useState<any[]>([]);
  // States ******************************************************************* //

  const handleSortChane = (slug: string) => {
    const params = new URLSearchParams(location.search);
    const optionValue = SortList.find(
      (item: ISortItem) => item.slug === slug,
    ) as ISortItem;
    if (!optionValue) alert('No Value');

    if (optionValue.value) params.set('sort', optionValue?.value);
    params.set('reverse', optionValue.reverse.toString());
    setSortValue(optionValue.slug);

    navigate(`${location.pathname}?${params.toString()}`, {
      preventScrollReset: true,
      replace: true,
    });
  };
  // filter.v.t.shopify.size
  const handleClickFilter = (val: any) => {
    alert(JSON.stringify(val));
    return;
    const params = new URLSearchParams(location.search);

    const findFilter = filterValues.find((item: any) => item.id === val.id);

    let newFilters = filterValues.filter((item: any) => item.id !== val.id);

    // IF Existing
    if (findFilter) {
      setFilterValues(newFilters);
      return;
    }

    // IF NEW FILTER ITEM
    if (val.id?.includes('filter.v.availability')) {
      // Set Variables
      newFilters = newFilters.filter(
        (item: any) => !item.id.includes('filter.v.availability'),
      );
      newFilters.push({...val, key: 'available'});
      const data: any = JSON.parse(val.input);
      params.set('available', `${data.available.toString()}`);
    }

    navigate(`${location.pathname}?${params.toString()}`, {
      preventScrollReset: true,
      replace: true,
    });

    setFilterValues(newFilters);
  };

  const handleCheckValue = useCallback(
    (val: any) => {
      const find = filterValues.find((item: any) => item.id === val.id);

      if (find) return true;
      return false;
    },
    [filterValues],
  );

  //    if (item?.value?.id?.includes('filter.v.availability')) {
  //         const value = JSON.parse(item?.value?.input);
  //         params.set('availability', value?.available);
  //       } else if (item?.label === 'Price') {
  //         params.set('filter.v.price.min', item?.value?.min);
  //         params.set('filter.v.price.max', item?.value?.max);
  //       } else if (item?.label === 'Apparel Size') {
  //         const value = JSON.parse(item?.value?.input);
  //         params.set('t-shirt', value?.variantOption?.value);
  //       } else if (item?.label === 'Shoe Size') {
  //         const value = JSON.parse(item?.value?.input);
  //         params.set('size', value?.variantOption?.value);
  //       } else if (item?.label === 'Series') {
  //         const value = JSON.parse(item?.value?.input);
  //         params.set('series', value?.tag);
  //       } else if (item?.label === 'Categories') {
  //         const value = JSON.parse(item?.value?.input);
  //         params.set('categories', value?.productType);
  //       }

  return (
    <div className="collection-filters">
      {/* Mobile Filter Button */}

      {/* Desktop Filters */}
      <div className="hidden md:flex md:flex-col md:w-64 md:pr-8">
        {/* {JSON.stringify(filterValues)} */}
        {/* Sort Options */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Sort by</h3>
          <select
            value={sortValue}
            onChange={(e) => handleSortChane(e.target.value)}
            className="w-full bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-sm text-gray-700"
          >
            {SortList.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {/* FILTER LIST *** */}
          {filters.map((item: IFilters) => (
            <div className="border-b border-gray-200 pb-6" key={item.id}>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                {item.label}
              </h3>
              {/* FILTER ITEM LIST ****** */}
              {item.values.map((val: IFilterItem) => (
                <div className="space-y-8 py-1" key={val.id}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      onClick={() => handleClickFilter(val)}
                      checked={handleCheckValue(val)}
                      //   checked={true}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer accent-black"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {val.label}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          ))}
          {/* {filters.map((filter: IFilterItem) => (
            <div key={filter.id}>{filter.label}</div>
          ))} */}
        </div>
      </div>
    </div>
  );
}
