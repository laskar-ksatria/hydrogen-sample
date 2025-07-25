import {Await, Link, useLocation} from 'react-router';
import {Suspense, useId} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import HalloBar from './HalloBar';
import {useAside} from '~/components/Aside';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/account/login';
  const isRegisterPage = location.pathname === '/account/register';

  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {isHomePage && <HalloBar />}
      {header && !isLoginPage && !isRegisterPage && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      {!isLoginPage && !isRegisterPage && <Footer />}
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

// create styling for home page like on this website @https://hbx.com/
// Using tailwind css

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="p-4 max-w-md mx-auto z-50">
        {/* Search Form */}
        <SearchFormPredictive className="">
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="mb-6">
              <div className="relative mb-4">
                <input
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="Search products, collections..."
                  ref={inputRef}
                  type="search"
                  list={queriesDatalistId}
                  className="w-full px-4 py-3 border border-gray-200 rounded-none focus:outline-none focus:border-black transition-colors duration-200 text-sm"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {/* <button
                onClick={goToSearch}
                className="w-full bg-black text-white py-3 px-6 rounded-none hover:bg-gray-800 transition-colors duration-200 text-sm font-medium uppercase tracking-wide"
              >
                Search All Products
              </button> */}
            </div>
          )}
        </SearchFormPredictive>

        {/* Search Results */}
        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <SearchSkeleton />;
            }

            if (!total && term.current) {
              return (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    No results found for{' '}
                    <span className="font-medium">
                      &ldquo;{term.current}&rdquo;
                    </span>
                  </p>
                </div>
              );
            }

            if (!term.current) {
              return (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    Start typing to search products and collections
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />

                {products.length > 0 && (
                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={closeSearch}
                    term={term}
                  />
                )}

                {collections.length > 0 && (
                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={closeSearch}
                    term={term}
                  />
                )}

                {/* {pages.length > 0 && (
                  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={closeSearch}
                    term={term}
                  />
                )} */}

                {articles.length > 0 && (
                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={closeSearch}
                    term={term}
                  />
                )}

                {term.current && total ? (
                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      onClick={closeSearch}
                      to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                      className="block w-full text-center py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-sm font-medium text-gray-700 rounded-none"
                    >
                      View all {total} results for &ldquo;{term.current}&rdquo;
                      →
                    </Link>
                  </div>
                ) : null}
              </div>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-6">
      {/* Products Skeleton */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collections Skeleton */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  const {close} = useAside();
  const location = useLocation();

  if (!header.menu || !header.shop.primaryDomain?.url) {
    return null;
  }

  const menuItems = [
    {
      id: 'home',
      title: 'Home',
      url: '/',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    ...header.menu.items
      .map((item) => {
        let icon;
        switch (item.title.toLowerCase()) {
          case 'collections':
            icon = (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            );
            break;
          case 'blog':
            icon = (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            );
            break;
          case 'about':
            icon = (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            );
            break;
          case 'policies':
            icon = (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            );
            break;
          default:
            icon = (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            );
        }

        // Process URL like in HeaderMenu
        const url =
          item.url &&
          (item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(header.shop.primaryDomain?.url || ''))
            ? new URL(item.url).pathname
            : item.url;

        return {
          id: item.id,
          title: item.title,
          url,
          icon,
        };
      })
      .filter((item) => item.url), // Filter out items without URLs
  ];

  return (
    <Aside type="mobile" heading="MENU">
      <div className="font-mono">
        {/* Navigation Menu */}
        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              if (!item.url) return null;

              const isActive = location.pathname === item.url;

              return (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={close}
                  className={`flex items-center space-x-4 p-4 rounded-none transition-all duration-200 group ${
                    isActive
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <span
                    className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} transition-colors duration-200`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium uppercase tracking-wide">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200 mx-4"></div>

        {/* Account Section */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Account
          </h3>
          <div className="space-y-1">
            <Link
              to="/account"
              onClick={close}
              className="flex items-center space-x-4 p-4 hover:bg-gray-100 rounded-none transition-colors duration-200 group"
            >
              <span className="text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                My Account
              </span>
            </Link>

            <Link
              to="/account/orders"
              onClick={close}
              className="flex items-center space-x-4 p-4 hover:bg-gray-100 rounded-none transition-colors duration-200 group"
            >
              <span className="text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                Orders
              </span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mx-4"></div>

        {/* Support Section */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Support
          </h3>
          <div className="space-y-1">
            <Link
              to="/pages/contact"
              onClick={close}
              className="flex items-center space-x-4 p-4 hover:bg-gray-100 rounded-none transition-colors duration-200 group"
            >
              <span className="text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                Contact Us
              </span>
            </Link>

            <Link
              to="/pages/faq"
              onClick={close}
              className="flex items-center space-x-4 p-4 hover:bg-gray-100 rounded-none transition-colors duration-200 group"
            >
              <span className="text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                FAQ
              </span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mx-4"></div>

        {/* Footer Info */}
        <div className="p-4">
          <div className="text-center space-y-4">
            <div className="text-xl font-bold text-gray-900 tracking-wide">
              LOGO
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Premium quality products
              <br />
              crafted with care
            </p>

            {/* Social Links */}
            <div className="flex justify-center space-x-6 pt-2">
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.482-1.995.699 0 1.037.219 1.037 1.037 0 .631-.399 1.574-.609 2.45-.173.73.367 1.32 1.084 1.32 1.301 0 2.301-1.375 2.301-3.35 0-1.75-1.26-2.971-3.063-2.971-2.087 0-3.314 1.566-3.314 3.184 0 .631.242 1.306.545 1.674a.33.33 0 0 1 .076.317c-.083.349-.266 1.077-.303 1.228a.243.243 0 0 1-.35.175c-.979-.456-1.593-1.884-1.593-3.033 0-2.305 1.676-4.426 4.834-4.426 2.54 0 4.515 1.805 4.515 4.218 0 2.516-1.586 4.540-3.79 4.540-.741 0-1.438-.386-1.676-.851 0 0-.367 1.398-.456 1.742-.165.636-.612 1.436-.913 1.923a12 12 0 0 0 3.538.531c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.017 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Aside>
  );
}
