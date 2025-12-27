import {LoaderFunctionArgs, useLoaderData} from 'react-router';
import {IProduct, ProductCard} from '~/components/ProductCarousel';
import ShopFilters, {IFilters} from '~/components/ShopFilters';

export interface IVariablesCollection {
  handle: string | undefined;
  reverse: boolean;
  filters: any[];
  sortKey?: string;
}

export const loader = async (args: LoaderFunctionArgs) => {
  const handle = args.params?.handle;

  if (!handle) throw new Error('404');

  // Fetch
  const url = new URL(args.request.url);
  const variables: IVariablesCollection = {
    handle: args.params?.handle,
    reverse: false,
    filters: [],
  };
  // SORT CHECKING --------------------------------------------- //
  const sortQuery = url.searchParams.get('sort');
  const reverseQuery = url.searchParams.get('reverse');
  if (sortQuery) variables.sortKey = sortQuery;
  if (reverseQuery) variables.reverse = reverseQuery === 'true' ? true : false;
  // SORT CHECKING --------------------------------------------- //

  // FILTER CHECKING ------------------------------------------- //
  // Available
  const available = url.searchParams.get('availability');
  if (available)
    variables.filters.push({available: available === 'true' ? true : false});

  // FILTER CHECKING ------------------------------------------- //

  const response = await args.context.storefront.query(Q_COLLECTION, {
    variables: {...variables},
  });

  return {
    collection: response?.collection,
  };
};

export default function CollectionPage() {
  const {collection} = useLoaderData<typeof loader>();
  console.log(collection);
  return (
    <div className="min-h-[90vh] w-full">
      <div className=" container py-8">
        {/* Collection Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-mono">
            {collection?.title}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <ShopFilters filters={collection?.products?.filters as IFilters[]} />
          <div className="flex-1 container h-fit grid md:grid-cols-3 grid-cols-2 lg:grid-cols-4 gap-4 space-y-4">
            {collection?.products?.nodes?.map((product: any) => (
              <ProductCard product={product as IProduct} key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Q_COLLECTION = `#graphql
query COLLECTION($handle: String
        $filters: [ProductFilter!],
        $sortKey: ProductCollectionSortKeys, 
        $reverse: Boolean
) {
  collection(handle: $handle) {
			id
      title
      handle
      description
    	bannerDescription: metafield(namespace: "custom", key: "banner_description") {
      description
      value
    }
      bannerImage: metafield(namespace: "custom", key: "banner") {
        id
        reference{
          ... on MediaImage {
            id
            image {
              url
              id
              width
              height
              altText
            }
          }
        }
      }
      image {
        id
        width height
        url
        altText
      }
     
    products(first: 250,                 
    filters: $filters, 
                sortKey: $sortKey, 
                reverse: $reverse) {
      filters {
        id
        type
        label
        values {
          id
          label
          input
        }
        
      }
    nodes {
      vendor
    	id
      title
      handle
      images(first: 20) {
        nodes {
          id
          width
          height
          altText
          url
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
    }
    }


  }
}
`;
