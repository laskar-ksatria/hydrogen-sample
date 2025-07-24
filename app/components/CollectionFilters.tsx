import {useState, useEffect} from 'react';
import {Link, useSearchParams} from 'react-router';
import {IoFilter, IoClose} from 'react-icons/io5';

interface FilterValue {
  id: string;
  label: string;
  count: number;
  input: string;
}

interface Filter {
  id: string;
  label: string;
  type: 'LIST' | 'PRICE_RANGE';
  values: FilterValue[];
}

interface CollectionFiltersProps {
  filters: Filter[];
  sortOptions: Array<{
    value: string;
    label: string;
  }>;
  currentSortBy?: string;
  totalProducts: number;
}

export function CollectionFilters({
  filters,
  sortOptions,
  currentSortBy,
  totalProducts,
}: CollectionFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string[]}>(
    {},
  );

  // Initialize active filters from URL params on component mount
  useEffect(() => {
    const initialFilters: {[key: string]: string[]} = {};

    // Parse existing filter parameters from URL
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key.startsWith('filter.')) {
        const parts = key.split('.');
        if (parts.length >= 3) {
          const filterKey = parts[2]; // e.g., "product_type" from "filter.p.product_type"
          if (!initialFilters[filterKey]) {
            initialFilters[filterKey] = [];
          }
          initialFilters[filterKey].push(value);
        }
      }
    });

    setActiveFilters(initialFilters);
  }, [searchParams]);

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'collection-default') {
      newParams.delete('sort_by');
    } else {
      newParams.set('sort_by', value);
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (
    filterId: string,
    value: string,
    checked: boolean,
  ) => {
    const newActiveFilters = {...activeFilters};

    // Extract the actual filter key from the filter ID (e.g., "type" from "filter.p.type")
    const filterKey = filterId.includes('.')
      ? filterId.split('.').pop()!
      : filterId;

    if (!newActiveFilters[filterKey]) {
      newActiveFilters[filterKey] = [];
    }

    if (checked) {
      // Parse the JSON input to get the actual filter value
      try {
        const parsedInput = JSON.parse(value) as Record<string, any>;
        const filterValue = Object.values(parsedInput)[0];

        // Handle nested objects (like category filters)
        if (typeof filterValue === 'object' && filterValue !== null) {
          // For nested objects, use the original JSON string as the value
          newActiveFilters[filterKey] = [...newActiveFilters[filterKey], value];
        } else {
          // For simple values, use the extracted value
          newActiveFilters[filterKey] = [
            ...newActiveFilters[filterKey],
            filterValue,
          ];
        }
      } catch {
        // Fallback to using the value directly if JSON parsing fails
        newActiveFilters[filterKey] = [...newActiveFilters[filterKey], value];
      }
    } else {
      // Remove the filter value
      try {
        const parsedInput = JSON.parse(value) as Record<string, any>;
        const filterValue = Object.values(parsedInput)[0];

        // Handle nested objects (like category filters)
        if (typeof filterValue === 'object' && filterValue !== null) {
          // For nested objects, remove by the original JSON string
          newActiveFilters[filterKey] = newActiveFilters[filterKey].filter(
            (v) => v !== value,
          );
        } else {
          // For simple values, remove by the extracted value
          newActiveFilters[filterKey] = newActiveFilters[filterKey].filter(
            (v) => v !== filterValue,
          );
        }
      } catch {
        newActiveFilters[filterKey] = newActiveFilters[filterKey].filter(
          (v) => v !== value,
        );
      }
    }

    setActiveFilters(newActiveFilters);

    // Update URL params
    const newParams = new URLSearchParams(searchParams);

    // Clear existing filter params for this filter
    Array.from(newParams.keys()).forEach((key) => {
      if (
        key.startsWith(`filter.p.${filterKey}`) ||
        key.startsWith(`filter.v.${filterKey}`)
      ) {
        newParams.delete(key);
      }
    });

    // Add new filter params
    newActiveFilters[filterKey].forEach((filterValue) => {
      // Determine if it's a product-level or variant-level filter
      const isProductFilter = ['type', 'vendor', 'tag'].includes(filterKey);
      const filterPrefix = isProductFilter ? 'filter.p' : 'filter.v';

      // For complex values (JSON strings), use them directly
      if (typeof filterValue === 'string' && filterValue.startsWith('{')) {
        try {
          const parsed = JSON.parse(filterValue) as Record<string, any>;
          // Extract the actual value for URL params
          const actualValue = Object.values(parsed)[0];
          if (typeof actualValue === 'object' && actualValue !== null) {
            // For nested objects, use a stringified version
            newParams.append(
              `${filterPrefix}.${filterKey}`,
              JSON.stringify(actualValue),
            );
          } else {
            newParams.append(
              `${filterPrefix}.${filterKey}`,
              String(actualValue),
            );
          }
        } catch {
          newParams.append(`${filterPrefix}.${filterKey}`, filterValue);
        }
      } else {
        newParams.append(`${filterPrefix}.${filterKey}`, String(filterValue));
      }
    });

    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    Array.from(newParams.keys()).forEach((key) => {
      if (key.startsWith('filter.')) {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
    setActiveFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).flat().length;
  };

  return (
    <div className="collection-filters">
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <IoFilter className="w-4 h-4" />
          <span>Filter</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-black text-white text-xs rounded-full px-2 py-1">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex md:flex-col md:w-64 md:pr-8">
        {/* Sort Options */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Sort by</h3>
          <select
            value={currentSortBy || 'collection-default'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-sm text-gray-700"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Groups */}
        <div className="space-y-6">
          {filters.map((filter) => (
            <div key={filter.id} className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                {filter.label}
              </h3>

              {filter.type === 'LIST' && (
                <div className="space-y-2">
                  {filter.values.map((value) => {
                    // Extract the actual filter key and value for checking
                    const filterKey = filter.id.includes('.')
                      ? filter.id.split('.').pop()!
                      : filter.id;
                    let filterValue = value.input;
                    try {
                      const parsedInput = JSON.parse(value.input) as Record<
                        string,
                        string
                      >;
                      filterValue = Object.values(parsedInput)[0];
                    } catch {
                      // Use the input directly if JSON parsing fails
                    }

                    return (
                      <label
                        key={value.id}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            activeFilters[filterKey]?.includes(filterValue) ||
                            false
                          }
                          onChange={(e) =>
                            handleFilterChange(
                              filter.id,
                              value.input,
                              e.target.checked,
                            )
                          }
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {value.label} ({value.count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Clear All Filters */}
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="mt-4 text-sm text-gray-600 hover:text-black underline cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsFilterOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setIsFilterOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close filter modal"
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                  aria-label="Close filters"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto h-full">
              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Sort by
                </h3>
                <select
                  value={currentSortBy || 'collection-default'}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-sm text-gray-700"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Groups */}
              <div className="space-y-6">
                {filters.map((filter) => (
                  <div
                    key={filter.id}
                    className="border-b border-gray-200 pb-6"
                  >
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      {filter.label}
                    </h3>

                    {filter.type === 'LIST' && (
                      <div className="space-y-2">
                        {filter.values.map((value) => {
                          // Extract the actual filter key and value for checking
                          const filterKey = filter.id.includes('.')
                            ? filter.id.split('.').pop()!
                            : filter.id;
                          let filterValue = value.input;
                          let isComplexValue = false;

                          try {
                            const parsedInput = JSON.parse(
                              value.input,
                            ) as Record<string, any>;
                            const extractedValue =
                              Object.values(parsedInput)[0];

                            // Handle nested objects (like category filters)
                            if (
                              typeof extractedValue === 'object' &&
                              extractedValue !== null
                            ) {
                              filterValue = value.input; // Use the original JSON string
                              isComplexValue = true;
                            } else {
                              filterValue = String(extractedValue);
                            }
                          } catch {
                            // Use the input directly if JSON parsing fails
                          }

                          return (
                            <label
                              key={value.id}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  activeFilters[filterKey]?.includes(
                                    filterValue,
                                  ) || false
                                }
                                onChange={(e) =>
                                  handleFilterChange(
                                    filter.id,
                                    value.input,
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {value.label} ({value.count})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Clear All Filters */}
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-sm text-gray-600 hover:text-black underline cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([filterId, values]) =>
              values.map((value) => {
                // Find the corresponding filter and value to get the proper label
                const filter = filters.find((f) => {
                  const filterKey = f.id.includes('.')
                    ? f.id.split('.').pop()!
                    : f.id;
                  return filterKey === filterId;
                });

                let displayLabel = value;
                if (filter) {
                  // Find the matching value to get the proper label
                  const matchingValue = filter.values.find((v) => {
                    try {
                      const parsedInput = JSON.parse(v.input) as Record<
                        string,
                        string
                      >;
                      const filterValue = Object.values(parsedInput)[0];
                      return filterValue === value;
                    } catch {
                      return v.input === value;
                    }
                  });
                  if (matchingValue) {
                    displayLabel = matchingValue.label;
                  }
                }

                return (
                  <span
                    key={`${filterId}-${value}`}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-md text-sm"
                  >
                    {displayLabel}
                    <button
                      onClick={() => {
                        // Find the original input value to pass to handleFilterChange
                        let originalInput = value;
                        if (filter) {
                          const matchingValue = filter.values.find((v) => {
                            try {
                              const parsedInput = JSON.parse(v.input) as Record<
                                string,
                                string
                              >;
                              const filterValue = Object.values(parsedInput)[0];
                              return filterValue === value;
                            } catch {
                              return v.input === value;
                            }
                          });
                          if (matchingValue) {
                            originalInput = matchingValue.input;
                          }
                        }
                        handleFilterChange(
                          filter?.id || filterId,
                          originalInput,
                          false,
                        );
                      }}
                      className="ml-1 hover:text-red-600 cursor-pointer"
                    >
                      <IoClose className="w-3 h-3" />
                    </button>
                  </span>
                );
              }),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
