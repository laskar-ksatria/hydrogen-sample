import {LoaderFunctionArgs} from 'react-router';

export async function loader({context}: LoaderFunctionArgs) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    throw new Response('Not Found', {status: 404});
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>GraphiQL</title>
        <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
      </head>
      <body style="margin: 0;">
        <div id="graphiql" style="height: 100vh;"></div>
        <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/graphiql/graphiql.min.js"></script>
        <script>
          const fetcher = GraphiQL.createFetcher({
            url: '${context.env.PUBLIC_STORE_DOMAIN}/api/2024-10/graphql.json',
            headers: {
              'X-Shopify-Storefront-Access-Token': '${context.env.PUBLIC_STOREFRONT_API_TOKEN}',
            },
          });
          
          ReactDOM.render(
            React.createElement(GraphiQL, { fetcher: fetcher }),
            document.getElementById('graphiql'),
          );
        </script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {'Content-Type': 'text/html'},
  });
}
