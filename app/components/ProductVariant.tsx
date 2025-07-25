import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import React from 'react';
import {cn} from '~/lib/utils';

export default function ProductVariant({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  // STATES ============================================================================ //
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <>
      <div className="space-y-4">
        {productOptions.map((option) => {
          if (option.optionValues.length === 1) return null;
          return (
            <React.Fragment key={option.name}>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-black">
                  {option.name}
                </span>
                <button className="flex items-center text-sm text-blue-600 hover:underline">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Size Guide ›
                </button>
              </div>
              {/* Custom Size Grid */}
              <div className="grid grid-cols-3 gap-3">
                {option.optionValues.map((value, index: number) => {
                  const {
                    name,
                    handle,
                    variantUriQuery,
                    selected,
                    available,
                    exists,
                    isDifferentProduct,
                    swatch,
                  } = value;
                  return (
                    <button
                      type="button"
                      className={cn(
                        !available ? 'opacity-30' : 'cursor-pointer',
                        selected
                          ? 'border-black border-2'
                          : 'border-gray-300 border',
                        `px-4 py-3 text-sm font-medium text-center rounded-none  transition-colors`,
                      )}
                      disabled={!available}
                      key={name}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}

        {/* {productOptions.map((option) => {
          <div
            className="flex items-center justify-between"
            key={option.name}
          ></div>;
        })} */}
      </div>
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
          // You can add cart opening logic here if needed
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        <span className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors mt-6 block text-center">
          {selectedVariant?.availableForSale ? 'Add to Bag' : 'Sold out'}
        </span>
      </AddToCartButton>

      {/* Buy Now Button */}
      <button
        className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors mt-0"
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          // Add buy now logic here - typically redirects to checkout
          if (selectedVariant) {
            // You can add redirect to checkout logic here
          }
        }}
      >
        {selectedVariant?.availableForSale ? 'Buy Now' : 'Unavailable'}
      </button>
    </>
  );
}

//   {/* Size Selection */}
//   <div className="space-y-4">
//     <div className="flex items-center justify-between">
//       <span className="text-base font-medium text-black">Size</span>
//   <button className="flex items-center text-sm text-blue-600 hover:underline">
//     <svg
//       className="w-4 h-4 mr-1"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={1}
//         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//       />
//     </svg>
//     Size Guide ›
//   </button>
//     </div>

//     {/* Custom Size Grid */}
//     <div className="grid grid-cols-3 gap-3">
//       {[
//         'US 7 / W 8',
//         'US 8 / W 9',
//         'US 9 / W 10',
//         'US 10 / W 11',
//         'US 11 / W 12',
//       ].map((size, index) => (
// <button
//   key={size}
//   className={`
//      px-4 py-3 text-sm font-medium text-center
//      border border-gray-300 rounded-lg
//      hover:border-gray-400 transition-colors
//      ${index === 2 ? 'border-black bg-gray-50' : 'bg-white'}
//    `}
// >
//   {size}
// </button>
//       ))}
//     </div>

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// <div className="space-y-4">
//     <div className="flex items-center justify-between">
//       <span className="text-base font-medium text-black">Size</span>
//       <button className="flex items-center text-sm text-blue-600 hover:underline">
//         <svg
//           className="w-4 h-4 mr-1"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1}
//             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//           />
//         </svg>
//         Size Guide ›
//       </button>
//     </div>

//     {/* Custom Size Grid */}
//     <div className="grid grid-cols-3 gap-3">
//       {[
//         'US 7 / W 8',
//         'US 8 / W 9',
//         'US 9 / W 10',
//         'US 10 / W 11',
//         'US 11 / W 12',
//       ].map((size, index) => (
//         <button
//           key={size}
//           className={`
//              px-4 py-3 text-sm font-medium text-center
//              border border-gray-300 rounded-lg
//              hover:border-gray-400 transition-colors
//              ${index === 2 ? 'border-black bg-gray-50' : 'bg-white'}
//            `}
//         >
//           {size}
//         </button>
//       ))}
//     </div>

//     {/* Add to Bag Button */}
// <AddToCartButton
//   disabled={
//     !selectedVariant || !selectedVariant.availableForSale
//   }
//   onClick={() => {
//     // You can add cart opening logic here if needed
//   }}
//   lines={
//     selectedVariant
//       ? [
//           {
//             merchandiseId: selectedVariant.id,
//             quantity: 1,
//             selectedVariant,
//           },
//         ]
//       : []
//   }
// >
//   <span className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors mt-6 block text-center">
//     {selectedVariant?.availableForSale
//       ? 'Add to Bag'
//       : 'Sold out'}
//   </span>
// </AddToCartButton>

// {/* Buy Now Button */}
// <button
//   className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors mt-0"
//   disabled={
//     !selectedVariant || !selectedVariant.availableForSale
//   }
//   onClick={() => {
//     // Add buy now logic here - typically redirects to checkout
//     if (selectedVariant) {
//       // You can add redirect to checkout logic here
//     }
//   }}
// >
//   {selectedVariant?.availableForSale
//     ? 'Buy Now'
//     : 'Unavailable'}
// </button>

//     {/* Original ProductForm (hidden but functional) */}
//     <div className="hidden">
//       <ProductForm
//         productOptions={productOptions}
//         selectedVariant={selectedVariant}
//       />
//     </div>
//   </div>
