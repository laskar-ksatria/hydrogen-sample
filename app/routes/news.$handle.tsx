import {LoaderFunctionArgs, useLoaderData, Link} from 'react-router';
import {RiArrowLeftLine, RiCalendarLine} from 'react-icons/ri';

export const loader = async (args: LoaderFunctionArgs) => {
  const handle = args.params.handle;

  const article = await args.context.storefront.query(Q_ARTICLE, {
    variables: {
      handle,
    },
  });

  if (!article?.blog?.id) {
    throw new Response('Not Found', {status: 404});
  }

  const findArticle = article?.blog?.articleByHandle;

  // In a real app, you would fetch the article data based on the handle
  // For now, we'll use dummy data that matches the sample format
  const dummyArticle = {
    id: 'gid://shopify/Article/562568167578',
    publishedAt: '2025-07-28T15:42:47Z',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
    contentHtml:
      '<p><meta charset="utf-8"><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span><br></p>\n<p><span><meta charset="utf-8">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</span></p>',
    excerpt:
      'Discover the latest trends shaping the future of online shopping and digital commerce.',
    excerptHtml:
      '<p><meta charset="utf-8"><span>Discover the latest trends shaping the future of online shopping and digital commerce.</span></p>',
    title: 'The Future of E-commerce',
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0675/6777/9994/articles/averie-woodard-5d20kdvFCfA-unsplash.jpg?v=1753718100',
      id: 'gid://shopify/ArticleImage/113013358746',
      altText: null,
    },
    handle: 'the-future-of-e-commerce',
  };

  return {
    article: findArticle,
  };
};

export default function NewsDetail() {
  const {article} = useLoaderData<typeof loader>();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <RiArrowLeftLine className="w-4 h-4" />
              Back to News
            </Link>
          </div>
        </div>
      </div>

      {/* Banner Image */}
      <div className="w-full h-64 md:h-80 lg:h-96 bg-zinc-200 relative overflow-hidden">
        {article.image?.url ? (
          <img
            src={article.image.url}
            alt={article.image.altText || article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
            <div className="text-zinc-400 text-lg font-medium">
              Article Image
            </div>
          </div>
        )}
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Article Content */}
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            {/* Publish Date */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <RiCalendarLine className="w-4 h-4" />
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <div className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-gray-200 pl-6">
                {article.excerpt}
              </div>
            )}
          </div>

          {/* Article Body */}
          <article className="prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{__html: article.contentHtml}}
            />
          </article>

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Published on {formatDate(article.publishedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Q_ARTICLE = `#graphql
query ARTICLE($handle: String!) {
  blog(handle: "news") {
    articleByHandle(handle: $handle) {
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
    id
  }
}
`;
