import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// fallback wild card for all unauthenticated routes in account section
export async function loader({context, request}: LoaderFunctionArgs) {
  const {session, storefront} = context;

  const {pathname} = new URL(request.url);

  const customerAccessToken = await session.get('customerAccessToken');

  const isLoggedIn = !!customerAccessToken?.accessToken;

  const isAccountHome = pathname === '/account' || pathname === '/account/';

  const isPrivateRoute =
    /^\/account\/(orders|orders\/.*|profile|addresses|addresses\/.*)$/.test(
      pathname,
    );
  const isOrderDetail = /^\/account\/orders\/[^\/]+$/.test(pathname);
  return {message: 'OKE'};
  // return redirect('/account');
}

export default function OrdersPage() {
  return <div>ORDERS</div>;
}

// export async function loader({request, context}: LoaderFunctionArgs) {
//   const {session, storefront} = context;
//   const {pathname} = new URL(request.url);
//   const customerAccessToken = await session.get('customerAccessToken');
//   const isLoggedIn = !!customerAccessToken?.accessToken;
//   const isAccountHome = pathname === '/account' || pathname === '/account/';
//   const isPrivateRoute =
//     /^\/account\/(orders|orders\/.*|profile|addresses|addresses\/.*)$/.test(
//       pathname,
//     );
//   const isOrderDetail = /^\/account\/orders\/[^\/]+$/.test(pathname);

//   if (!isLoggedIn) {
//     if (isPrivateRoute || isAccountHome) {
//       session.unset('customerAccessToken');
//       return redirect('/account/login', {
//         headers: {
//           'Set-Cookie': await session.commit(),
//         },
//       });
//     } else {
//       // public subroute such as /account/login...
//       return json({
//         isLoggedIn: false,
//         isAccountHome,
//         isPrivateRoute,
//         isOrderDetail,
//         customer: null,
//       });
//     }
//   } else {
//     // loggedIn, default redirect to the orders page
//     if (isAccountHome) {
//       return redirect('/account/orders');
//     }
//   }

//   try {
//     const {customer} = await storefront.query(CUSTOMER_QUERY, {
//       variables: {
//         customerAccessToken: customerAccessToken.accessToken,
//         country: storefront.i18n.country,
//         language: storefront.i18n.language,
//       },
//       cache: storefront.CacheNone(),
//     });

//     if (!customer) {
//       throw new Error('Customer not found');
//     }
//     return json(
//       {isLoggedIn, isPrivateRoute, isOrderDetail, isAccountHome, customer},
//       {
//         headers: {
//           'Cache-Control': 'no-cache, no-store, must-revalidate',
//         },
//       },
//     );
//   } catch (error) {
//     console.error('There was a problem loading account', error);
//     session.unset('customerAccessToken');
//     return redirect('/account/login', {
//       headers: {
//         'Set-Cookie': await session.commit(),
//       },
//     });
//   }
// }
