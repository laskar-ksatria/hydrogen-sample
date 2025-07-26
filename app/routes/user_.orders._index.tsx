import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {useState} from 'react';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import {
  RiAccountCircleLine,
  RiTruckLine,
  RiCheckLine,
  RiTimeLine,
} from 'react-icons/ri';

// Dummy data that matches Shopify's order structure
const dummyOrders = [
  {
    id: 'gid://shopify/Order/1001',
    name: '#1001',
    number: 1001,
    processedAt: '2024-01-15T10:30:00Z',
    totalPrice: {
      amount: '299.99',
      currencyCode: 'USD' as CurrencyCode,
    },
    financialStatus: 'PAID',
    fulfillments: {
      nodes: [
        {
          status: 'FULFILLED',
        },
      ],
    },
    lineItems: {
      nodes: [
        {
          id: 'gid://shopify/LineItem/2001',
          title: 'Premium Cotton T-Shirt',
          quantity: 2,
          price: {
            amount: '29.99',
            currencyCode: 'USD' as CurrencyCode,
          },
          image: {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
            altText: 'Premium Cotton T-Shirt',
          },
          variantTitle: 'Medium / Blue',
        },
        {
          id: 'gid://shopify/LineItem/2002',
          title: 'Denim Jeans',
          quantity: 1,
          price: {
            amount: '89.99',
            currencyCode: 'USD' as CurrencyCode,
          },
          image: {
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop',
            altText: 'Denim Jeans',
          },
          variantTitle: '32 / Dark Blue',
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Order/1002',
    name: '#1002',
    number: 1002,
    processedAt: '2024-01-10T14:20:00Z',
    totalPrice: {
      amount: '159.98',
      currencyCode: 'USD' as CurrencyCode,
    },
    financialStatus: 'PAID',
    fulfillments: {
      nodes: [
        {
          status: 'IN_TRANSIT',
        },
      ],
    },
    lineItems: {
      nodes: [
        {
          id: 'gid://shopify/LineItem/2003',
          title: 'Wireless Headphones',
          quantity: 1,
          price: {
            amount: '159.98',
            currencyCode: 'USD' as CurrencyCode,
          },
          image: {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            altText: 'Wireless Headphones',
          },
          variantTitle: 'Black',
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Order/1003',
    name: '#1003',
    number: 1003,
    processedAt: '2024-01-05T09:15:00Z',
    totalPrice: {
      amount: '89.99',
      currencyCode: 'USD' as CurrencyCode,
    },
    financialStatus: 'PENDING',
    fulfillments: {
      nodes: [
        {
          status: 'PENDING',
        },
      ],
    },
    lineItems: {
      nodes: [
        {
          id: 'gid://shopify/LineItem/2004',
          title: 'Leather Wallet',
          quantity: 1,
          price: {
            amount: '89.99',
            currencyCode: 'USD' as CurrencyCode,
          },
          image: {
            url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop',
            altText: 'Leather Wallet',
          },
          variantTitle: 'Brown',
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Order/1004',
    name: '#1004',
    number: 1004,
    processedAt: '2023-12-28T16:45:00Z',
    totalPrice: {
      amount: '199.97',
      currencyCode: 'USD' as CurrencyCode,
    },
    financialStatus: 'PAID',
    fulfillments: {
      nodes: [
        {
          status: 'FULFILLED',
        },
      ],
    },
    lineItems: {
      nodes: [
        {
          id: 'gid://shopify/LineItem/2005',
          title: 'Smart Watch',
          quantity: 1,
          price: {
            amount: '149.99',
            currencyCode: 'USD' as CurrencyCode,
          },
          image: {
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
            altText: 'Smart Watch',
          },
          variantTitle: 'Silver / 42mm',
        },
        {
          id: 'gid://shopify/LineItem/2006',
          title: 'Phone Case',
          quantity: 1,
          price: {
            amount: '49.98',
            currencyCode: 'USD' as CurrencyCode,
          },
          image: {
            url: 'https://images.unsplash.com/photo-1603314585442-ee3b3c16fbcf?w=100&h=100&fit=crop',
            altText: 'Phone Case',
          },
          variantTitle: 'Clear / iPhone 15',
        },
      ],
    },
  },
];

// Status badge component
function StatusBadge({
  status,
  fulfillmentStatus,
}: {
  status: string;
  fulfillmentStatus: string;
}) {
  const getStatusConfig = () => {
    if (fulfillmentStatus === 'FULFILLED') {
      return {
        text: 'Delivered',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: RiCheckLine,
      };
    } else if (fulfillmentStatus === 'IN_TRANSIT') {
      return {
        text: 'In Transit',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        icon: RiTruckLine,
      };
    } else if (fulfillmentStatus === 'PENDING') {
      return {
        text: 'Processing',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: RiTimeLine,
      };
    } else {
      return {
        text: 'Pending',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        icon: RiAccountCircleLine,
      };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      <Icon className="w-3 h-3" />
      {config.text}
    </div>
  );
}

// Order card component
function OrderCard({order}: {order: (typeof dummyOrders)[0]}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status || 'PENDING';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Order Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <Link
                to={`/user/orders/${order.number}`}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {order.name}
              </Link>
              <p className="text-sm text-gray-500">
                {formatDate(order.processedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge
              status={order.financialStatus}
              fulfillmentStatus={fulfillmentStatus}
            />
            <Money
              data={order.totalPrice}
              className="font-semibold text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex -space-x-2">
            {order.lineItems.nodes.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
              >
                <img
                  src={item.image?.url}
                  alt={item.image?.altText || item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {order.lineItems.nodes.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  +{order.lineItems.nodes.length - 3}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {order.lineItems.nodes.length} item
              {order.lineItems.nodes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            {isExpanded ? 'Hide details' : 'View details'}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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
          </button>
          <Link
            to={`/user/orders/${order.number}`}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            View Full Details
          </Link>
        </div>
      </div>

      {/* Expanded Order Details */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="space-y-3">
            {order.lineItems.nodes.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
                  <img
                    src={item.image?.url}
                    alt={item.image?.altText || item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h4>
                  {item.variantTitle && (
                    <p className="text-xs text-gray-500">{item.variantTitle}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Qty: {item.quantity}
                  </p>
                  <Money data={item.price} className="text-sm text-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserOrders() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track your order history and current shipments
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {dummyOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        {/* Empty State (hidden when we have orders) */}
        {dummyOrders.length === 0 && (
          <div className="text-center py-12">
            <RiAccountCircleLine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
