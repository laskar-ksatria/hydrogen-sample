import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import {FetcherWithComponents} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={`${className} font-mono`}>
      <div className=" pt-3">
        {/* <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide mb-3">
          Order Summary
        </h4> */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              {cart.cost?.subtotalAmount?.amount ? (
                <Money data={cart.cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </span>
          </div>
          {/* <CartDiscounts discountCodes={cart.discountCodes} />
          <CartGiftCard giftCardCodes={cart.appliedGiftCards} /> */}
          {/* <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Total</span>
              <span>
                {cart.cost?.totalAmount?.amount ? (
                  <Money data={cart.cost.totalAmount} />
                ) : cart.cost?.subtotalAmount?.amount ? (
                  <Money data={cart.cost.subtotalAmount} />
                ) : (
                  '-'
                )}
              </span>
            </div>
          </div> */}
        </div>
        <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
      </div>
    </div>
  );
  // return (
  //   <div aria-labelledby="cart-summary" className={`${className} font-mono`}>
  //     <div className="border-t border-gray-200 pt-3">
  // <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wide mb-3">
  //   Order Summary
  // </h4>

  // <div className="space-y-2">
  //   <div className="flex justify-between text-xs">
  //     <span className="text-gray-600">Subtotal</span>
  //     <span className="font-medium">
  //       {cart.cost?.subtotalAmount?.amount ? (
  //         <Money data={cart.cost?.subtotalAmount} />
  //       ) : (
  //         '-'
  //       )}
  //     </span>
  //   </div>

  // <CartDiscounts discountCodes={cart.discountCodes} />
  // <CartGiftCard giftCardCodes={cart.appliedGiftCards} />

  // <div className="border-t border-gray-200 pt-2">
  //   <div className="flex justify-between text-sm font-medium">
  //     <span>Total</span>
  //     <span>
  //       {cart.cost?.totalAmount?.amount ? (
  //         <Money data={cart.cost.totalAmount} />
  //       ) : cart.cost?.subtotalAmount?.amount ? (
  //         <Money data={cart.cost.subtotalAmount} />
  //       ) : (
  //         '-'
  //       )}
  //     </span>
  //   </div>
  // </div>
  //       </div>

  //       <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
  //     </div>
  //   </div>
  // );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="my-4">
      <a
        href={checkoutUrl}
        target="_self"
        className="block w-full bg-black text-white py-4 px-4 rounded-none hover:bg-gray-800 transition-colors duration-200 text-xs font-medium uppercase tracking-wide text-center cursor-pointer"
      >
        Continue to Checkout →
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="space-y-2">
      {/* Have existing discount, display it with a remove option */}
      {codes.length > 0 && (
        <div className="flex justify-between text-xs">
          <span className="text-green-600">Discount</span>
          <UpdateDiscountForm>
            <div className="flex items-center space-x-2">
              <code className="text-green-600 font-medium text-xs">
                {codes?.join(', ')}
              </code>
              <button className="text-[10px] text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      )}

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="space-y-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="w-full px-2 py-1 border border-gray-200 rounded-none focus:outline-none focus:border-black transition-colors duration-200 text-xs"
          />
          <button
            type="submit"
            className="w-full bg-gray-100 text-gray-700 py-1 px-3 rounded-none hover:bg-gray-200 transition-colors duration-200 text-xs font-medium uppercase tracking-wide cursor-pointer"
          >
            Apply Discount
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div className="space-y-2">
      {/* Have existing gift card applied, display it with a remove option */}
      {codes.length > 0 && (
        <div className="flex justify-between text-xs">
          <span className="text-purple-600">Gift Card</span>
          <UpdateGiftCardForm>
            <div className="flex items-center space-x-2">
              <code className="text-purple-600 font-medium text-xs">
                {codes?.join(', ')}
              </code>
              <button
                onSubmit={() => removeAppliedCode}
                className="text-[10px] text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </UpdateGiftCardForm>
        </div>
      )}

      {/* Show an input to apply a gift card */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className="space-y-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="w-full px-2 py-1 border border-gray-200 rounded-none focus:outline-none focus:border-black transition-colors duration-200 text-xs"
          />
          <button
            type="submit"
            className="w-full bg-gray-100 text-gray-700 py-1 px-3 rounded-none hover:bg-gray-200 transition-colors duration-200 text-xs font-medium uppercase tracking-wide cursor-pointer"
          >
            Apply Gift Card
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}
