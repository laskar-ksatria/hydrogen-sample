import {Link, useParams} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {useState} from 'react';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import {
  RiAccountCircleLine,
  RiTruckLine,
  RiCheckLine,
  RiTimeLine,
  RiArrowLeftLine,
  RiMapPinLine,
  RiCalendarLine,
} from 'react-icons/ri';

// Dummy order data that matches Shopify's detailed order structure
const dummyOrder = {
  id: 'gid://shopify/Order/1001',
  name: '#1001',
  number: 1001,
  processedAt: '2024-01-15T10:30:00Z',
  statusPageUrl: 'https://shop.example.com/orders/1001',
  totalPrice: {
    amount: '299.99',
    currencyCode: 'USD' as CurrencyCode,
  },
  subtotal: {
    amount: '279.98',
    currencyCode: 'USD' as CurrencyCode,
  },
  totalTax: {
    amount: '20.01',
    currencyCode: 'USD' as CurrencyCode,
  },
  financialStatus: 'PAID',
  fulfillments: {
    nodes: [
      {
        status: 'FULFILLED',
        trackingInfo: [
          {
            number: '1Z999AA1234567890',
            url: 'https://www.ups.com/track?tracknum=1Z999AA1234567890',
            company: 'UPS',
          },
        ],
      },
    ],
  },
  shippingAddress: {
    name: 'John Doe',
    formatted:
      'John Doe\n123 Main Street\nApt 4B\nNew York, NY 10001\nUnited States',
    formattedArea: 'New York, NY 10001, United States',
  },
  discountApplications: {
    nodes: [
      {
        value: {
          __typename: 'MoneyV2',
          amount: '10.00',
          currencyCode: 'USD' as CurrencyCode,
        },
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
        totalDiscount: {
          amount: '5.00',
          currencyCode: 'USD' as CurrencyCode,
        },
        image: {
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
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
        totalDiscount: {
          amount: '5.00',
          currencyCode: 'USD' as CurrencyCode,
        },
        image: {
          url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
          altText: 'Denim Jeans',
        },
        variantTitle: '32 / Dark Blue',
      },
    ],
  },
};

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
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}
    >
      <Icon className="w-4 h-4" />
      {config.text}
    </div>
  );
}

// Order summary component
function OrderSummary({order}: {order: typeof dummyOrder}) {
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
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{order.name}</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <RiCalendarLine className="w-4 h-4" />
            {formatDate(order.processedAt)}
          </p>
        </div>
        <StatusBadge
          status={order.financialStatus}
          fulfillmentStatus={order.fulfillments.nodes[0]?.status || 'PENDING'}
        />
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <RiMapPinLine className="w-4 h-4" />
            Shipping Address
          </h3>
          <div className="text-sm text-gray-600 whitespace-pre-line">
            {order.shippingAddress.formatted}
          </div>
        </div>

        {/* Tracking Information */}
        {order.fulfillments.nodes[0]?.trackingInfo && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <RiTruckLine className="w-4 h-4" />
              Tracking Information
            </h3>
            {order.fulfillments.nodes[0].trackingInfo.map((tracking, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium text-gray-900">{tracking.company}</p>
                <p className="text-gray-600">Tracking #: {tracking.number}</p>
                {tracking.url && (
                  <a
                    href={tracking.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Track Package →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Order items component
function OrderItems({order}: {order: typeof dummyOrder}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {order.lineItems.nodes.map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image?.url}
                  alt={item.image?.altText || item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                {item.variantTitle && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.variantTitle}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Quantity: {item.quantity}
                </p>
              </div>

              {/* Price Information */}
              <div className="text-right">
                <div className="flex flex-col items-end gap-1">
                  <Money
                    data={item.price}
                    className="font-medium text-gray-900"
                  />
                  {parseFloat(item.totalDiscount.amount) > 0 && (
                    <div className="text-sm text-red-600">
                      -<Money data={item.totalDiscount} />
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Total:{' '}
                    <Money
                      data={{
                        amount: (
                          parseFloat(item.price.amount) * item.quantity -
                          parseFloat(item.totalDiscount.amount)
                        ).toString(),
                        currencyCode: item.price.currencyCode,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Order summary component
function OrderSummaryDetails({order}: {order: typeof dummyOrder}) {
  const subtotal = parseFloat(order.subtotal.amount);
  const tax = parseFloat(order.totalTax.amount);
  const total = parseFloat(order.totalPrice.amount);
  const discount =
    order.discountApplications.nodes.length > 0
      ? parseFloat(order.discountApplications.nodes[0].value.amount)
      : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <Money data={order.subtotal} className="text-gray-900" />
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="text-red-600">
              -
              <Money
                data={{
                  amount: discount.toString(),
                  currencyCode: order.totalPrice.currencyCode,
                }}
              />
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <Money data={order.totalTax} className="text-gray-900" />
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span className="text-gray-900">Total</span>
            <Money data={order.totalPrice} className="text-gray-900" />
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Payment Status</span>
          <span
            className={`text-sm font-medium px-2 py-1 rounded-full ${
              order.financialStatus === 'PAID'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {order.financialStatus === 'PAID' ? 'Paid' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const {id} = useParams();

  // In a real app, you would fetch the order data based on the ID
  // For now, we'll use the dummy data
  const order = dummyOrder;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/user/orders"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>

        {/* Order Summary */}
        <OrderSummary order={order} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <OrderItems order={order} />
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummaryDetails order={order} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Download Invoice
          </button>
          <button className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Contact Support
          </button>
          <button className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Reorder
          </button>
        </div>
      </div>
    </div>
  );
}
