import {LoaderFunctionArgs, useLoaderData} from 'react-router';
import {BlogCard, IBlog} from '~/components/BlogList';

export const loader = async (args: LoaderFunctionArgs) => {
  const blogs = await args.context.storefront.query(Q_BLOGS);
  return {
    blogs: blogs?.blog?.articles?.nodes?.map((item: any) => ({
      id: item?.id,
      title: item?.title,
      date: item?.publishedAt,
      image: item?.image?.url,
      excerpt: item?.excerpt,
      handle: item?.handle,
    })),
  };
};

export default function NewsPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="container py-8">
      <h2 className="text-xl font-mono md:text-3xl font-semibold text-gray-900 mb-1">
        Latest Stories
      </h2>
      <p className="text-gray-600 text-base font-mono">
        Discover insights, trends, and stories from our world
      </p>
      <div className="grid space-y-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 mt-5">
        {data?.blogs?.map((item: IBlog) => (
          <BlogCard blog={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}

const Q_BLOGS = `#graphql
query BLOGS {
  blog(handle: "news") {
    id
    articles(first: 10) {
      nodes {
        id
        publishedAt
        content
        contentHtml
        excerpt
        excerptHtml
        title
        image {
          url
          id
          altText
        }
        handle
        
      }
    }
  }
}
`;
