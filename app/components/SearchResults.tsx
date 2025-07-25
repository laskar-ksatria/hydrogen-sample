import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-light text-gray-900">
          Articles ({articles.nodes.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              key={article.id}
              prefetch="intent"
              to={articleUrl}
              className="group block p-6 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Article</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-light text-gray-900">
          Pages ({pages.nodes.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              key={page.id}
              prefetch="intent"
              to={pageUrl}
              className="group block p-6 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors duration-200 line-clamp-2">
                    {page.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Page</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-light text-gray-900">
          Products ({products.nodes.length})
        </h2>
      </div>

      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {nodes.map((product) => {
                const productUrl = urlWithTrackingParams({
                  baseUrl: `/products/${product.handle}`,
                  trackingParams: product.trackingParameters,
                  term,
                });

                const price = product?.selectedOrFirstAvailableVariant?.price;
                const image = product?.selectedOrFirstAvailableVariant?.image;

                return (
                  <Link
                    key={product.id}
                    prefetch="intent"
                    to={productUrl}
                    className="group cursor-pointer block"
                  >
                    {/* Product Image */}
                    <div className="aspect-[3/4] bg-gray-200 mb-3 overflow-hidden">
                      {image ? (
                        <Image
                          data={image}
                          alt={product.title}
                          sizes="(min-width: 1280px) 240px, (min-width: 1024px) 192px, (min-width: 768px) 160px, (min-width: 640px) 144px, 240px"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="text-gray-400 text-sm">No Image</div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wide text-gray-900">
                        {product.vendor || 'Brand'}
                      </div>
                      <div className="text-sm text-gray-700 leading-tight line-clamp-2">
                        {product.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base text-gray-900">
                          {price && <Money data={price} />}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          );

          return (
            <div className="space-y-8">
              {/* Previous Link */}
              <div className="flex justify-center">
                <PreviousLink className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-none text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      Load previous
                    </>
                  )}
                </PreviousLink>
              </div>

              {/* Products Grid */}
              {ItemsMarkup}

              {/* Next Link */}
              <div className="flex justify-center">
                <NextLink className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-none text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    <>
                      Load more
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <svg
          className="mx-auto h-16 w-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.219 0-4.207.906-5.65 2.368M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-500 mb-4">
          Sorry, we couldn&apos;t find any results. Try adjusting your search
          terms.
        </p>
        <div className="text-sm text-gray-400">
          <p>Search tips:</p>
          <ul className="mt-2 space-y-1">
            <li>• Check your spelling</li>
            <li>• Try different keywords</li>
            <li>• Use more general terms</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
