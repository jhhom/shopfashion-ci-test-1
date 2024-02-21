import { StoreProductsResponse } from "@api-contract/store-api/api";
import { match } from "ts-pattern";
import { IconCheck, IconShirt } from "~/pages/common/Icons";
import { useEffect, useMemo, useState } from "react";
import { QuantityInput } from "~/pages/common/components/QuantityInput";
import { Rating } from "~/pages/common/Rating";

import { clsx as cx } from "clsx";
import { useMap, Actions } from "usehooks-ts";
import { getDisabledOptions2 } from "~/pages/ProductDetails/components/get-disabled-options/get-disabled-options-3";
import { ProductStatus } from "@api-contract/common";

type Product = StoreProductsResponse["getOneProduct"]["body"];

type SimpleProductDetails = Extract<Product["product"], { type: "SIMPLE" }>;

type ConfigurableProductDetails = Extract<
  Product["product"],
  { type: "CONFIGURABLE" }
>;

export function ProductDetails(props: {
  product: Product;
  onAddToCart: (product: {
    id: number;
    type: "SIMPLE" | "CONFIGURABLE";
    quantity: number;
  }) => void;
}) {
  return (
    <div className="md:flex">
      <div className="basis-96 px-4 md:px-0">
        <div className="h-[28rem] w-full md:h-96 md:w-96">
          {props.product.productImageUrl ? (
            <img
              src={props.product.productImageUrl}
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-center">
              No image
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 md:mt-0 md:basis-[calc(100%-20rem)] md:pl-4">
        <div className="px-5 md:pl-5 md:pr-0">
          <h2 className="text-2xl font-semibold">{props.product.name}</h2>
          <p className="mt-2 text-sm text-gray-500">
            {props.product.description}
          </p>
          <div className="flex items-center py-3">
            <Rating
              value={props.product.rating}
              className="max-w-[100px]"
              onChange={undefined}
            />
            <span className="ml-2 text-sm">
              ({props.product.numberOfReviews})
            </span>
          </div>
        </div>
        {match(props.product.product)
          .with({ type: "SIMPLE" }, (p) => (
            <SimpleProductDetails
              product={p}
              status={props.product.status}
              onAddToCart={(quantity) => {
                props.onAddToCart({
                  id: props.product.id,
                  type: "SIMPLE",
                  quantity,
                });
              }}
            />
          ))
          .with({ type: "CONFIGURABLE" }, (p) => (
            <ConfigurableProductDetails
              product={p}
              onAddToCart={(variant) => {
                props.onAddToCart({
                  id: variant.id,
                  type: "CONFIGURABLE",
                  quantity: variant.quantity,
                });
              }}
            />
          ))
          .exhaustive()}
      </div>
    </div>
  );
}

function SimpleProductDetails(props: {
  product: SimpleProductDetails;
  status: ProductStatus;
  onAddToCart: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="px-5 md:pl-5 md:pr-0">
      <p className="text-xl font-semibold">RM {props.product.pricing}</p>
      <div className="mt-8 text-sm font-semibold">
        <p>Quantity</p>
        <QuantityInput
          className="mt-2"
          quantity={quantity}
          setQuantity={setQuantity}
          disabled={props.status === "OUT_OF_STOCK"}
        />
        {props.status === "OUT_OF_STOCK" && (
          <div className="mt-2 font-normal text-red-500">Out of stock</div>
        )}
      </div>
      <div className="mt-12">
        <button
          disabled={props.status === "OUT_OF_STOCK"}
          onClick={() => props.onAddToCart(quantity)}
          className="flex w-full max-w-full items-center justify-center rounded-md bg-teal-500 py-2.5 font-semibold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-teal-500/50 md:max-w-[240px]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function ConfigurableProductDetails({
  product,
  onAddToCart,
}: {
  product: ConfigurableProductDetails;
  onAddToCart: (productVariant: { id: number; quantity: number }) => void;
}) {
  const [errorNoVariantSelected, setErrorNoVariantSelected] = useState(false);
  const [productOptions, productOptionsAction] = useMap<string, number>();

  const disabledOptions = useMemo(() => {
    return getDisabledOptions2({
      selectedOptions: new Map(Array.from(productOptions.entries())),
      options: new Map(
        product.productOptions.map((o) => [
          o.code,
          new Set(o.values.map((v) => v.id)),
        ]) as [string, Set<number>][]
      ),
      variants: product.variants.map(
        (v) =>
          new Map(v.optionValues.map((ov) => [ov.optionCode, ov.optionValueId]))
      ),
    });
  }, [productOptions, product.productOptions, product.variants]);

  const matchingVariant = product.variants.find((variant) => {
    return mapsAreEqual(
      new Map(variant.optionValues.map((v) => [v.optionCode, v.optionValueId])),
      productOptions
    );
  });

  useEffect(() => {
    if (matchingVariant !== undefined) {
      setErrorNoVariantSelected(false);
    }
  }, [matchingVariant]);

  const minPrice = Math.min(...product.variants.map((v) => v.pricing));
  const maxPrice = Math.max(...product.variants.map((v) => v.pricing));

  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <p className="px-5 text-xl font-semibold md:pl-5 md:pr-0">
        {matchingVariant ? (
          <>
            <span className="text-sm">RM</span>{" "}
            <span>{matchingVariant.pricing.toFixed(2)}</span>
          </>
        ) : product.variants.length === 0 ? (
          "Unavailable"
        ) : (
          <span>
            <span className="text-sm">RM</span>{" "}
            {minPrice.toFixed(2) === maxPrice.toFixed(2)
              ? minPrice.toFixed(2)
              : `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`}
          </span>
        )}
      </p>
      <div
        className={cx("mt-4 px-5 pb-5 pt-4 md:pl-5 md:pr-0", {
          "bg-red-50": errorNoVariantSelected,
        })}
      >
        <div className="space-y-6 text-sm">
          {product.productOptions.map((o) => (
            <OptionSelector
              key={o.code}
              title={o.name}
              options={o.values.map((x) => ({ ...x, id: x.id }))}
              activeOption={productOptions.get(o.code) ?? 0}
              onOptionClick={(optionValueId) => {
                if (productOptions.get(o.code) === optionValueId) {
                  productOptionsAction.remove(o.code);
                } else {
                  productOptionsAction.set(o.code, optionValueId);
                }
              }}
              disabledOptions={disabledOptions.get(o.code) ?? new Set<number>()}
            />
          ))}
        </div>

        <div className="mt-8 text-sm font-semibold">
          <p>Quantity</p>
          <QuantityInput
            quantity={quantity}
            setQuantity={(q) => {
              if (matchingVariant === undefined) {
                setErrorNoVariantSelected(true);
              } else {
                setQuantity(q);
              }
            }}
            className="mt-2"
            disabled={matchingVariant?.status === "OUT_OF_STOCK"}
          />
          {errorNoVariantSelected && (
            <div className="mt-2 font-normal text-red-500">
              Please select product variation first
            </div>
          )}
          {matchingVariant?.status === "OUT_OF_STOCK" && (
            <div className="mt-2 font-normal text-red-500">Out of stock</div>
          )}
        </div>
      </div>

      <div className="mt-10 px-5 md:pl-5 md:pr-0">
        <button
          disabled={matchingVariant?.status === "OUT_OF_STOCK"}
          onClick={() => {
            if (matchingVariant) {
              onAddToCart({ id: matchingVariant.id, quantity });
            } else {
              setErrorNoVariantSelected(true);
            }
          }}
          className="flex w-full max-w-full items-center justify-center rounded-md bg-teal-500 py-2.5 
          font-semibold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-teal-500/50 md:max-w-[240px]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function OptionSelector<T extends React.Key>({
  title,
  options,
  activeOption,
  onOptionClick,
  disabledOptions,
}: {
  title: string;
  options: { value: string; id: T }[];
  activeOption: T;
  onOptionClick: (o: T) => void;
  disabledOptions: Set<T>;
}) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2">
        {options.map((s) => (
          <OptionButton
            key={s.id}
            text={s.value}
            active={s.id === activeOption}
            onClick={() => onOptionClick(s.id)}
            disabled={disabledOptions.has(s.id)}
          />
        ))}
      </div>
    </div>
  );
}

function OptionButton({
  text,
  active,
  onClick,
  disabled,
}: {
  text: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      key={text}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "relative min-w-[3rem] rounded-sm bg-white px-5 py-1.5 disabled:text-gray-300",
        {
          "border border-teal-600 text-teal-600": active && !disabled,
          "border border-gray-300": !active || disabled,
        }
      )}
    >
      {text}
      {active && !disabled && (
        <>
          <div
            className="absolute bottom-0 right-0 flex h-[1.1rem] w-[1.1rem] items-end justify-end 
        border-r-[1.1rem] border-t-[1.1rem] border-r-teal-500 border-t-white bg-teal-500"
          ></div>
          <IconCheck className="absolute bottom-0 right-0 z-10 h-[0.65rem] w-[0.65rem] text-white" />
        </>
      )}
    </button>
  );
}

function mapsAreEqual<K, V>(
  m1: Map<K, V>,
  m2: Omit<Map<K, V>, "set" | "clear" | "delete">
) {
  return (
    m1.size === m2.size &&
    Array.from(m1.keys()).every((key) => m1.get(key) === m2.get(key))
  );
}
