import { clsx as cx } from "clsx";
import { Link } from "@tanstack/react-router";

import { Rating } from "~/pages/common/Rating";

type ProductReview = {
  customerEmail: string;
  rating: number;
  comment: string;
};

export function ProductReviews(props: {
  productId: number;
  marginTop?: string;
  reviews: ProductReview[];
}) {
  return (
    <div className={cx(props.marginTop)}>
      <h2 className="text-xl font-medium">Reviews ({props.reviews.length})</h2>
      {props.reviews.length > 0 ? (
        <div className="mt-4 space-y-4">
          {props.reviews.length > 3
            ? props.reviews
                .slice(0, 3)
                .map((r) => (
                  <ProductReview
                    key={r.customerEmail}
                    email={r.customerEmail}
                    rating={r.rating}
                    comment={r.comment}
                  />
                ))
            : props.reviews.map((r) => (
                <ProductReview
                  key={r.customerEmail}
                  email={r.customerEmail}
                  rating={r.rating}
                  comment={r.comment}
                />
              ))}
        </div>
      ) : (
        <p className="mt-2">There are not reviews yet for this product</p>
      )}
      {props.reviews.length > 3 && (
        <div className="mt-4 flex justify-center">
          <Link
            to="/product/$productId/reviews"
            params={{ productId: props.productId.toString() }}
            className="block w-[240px] rounded-md border border-gray-300 py-2.5 text-center"
          >
            Load more reviews
          </Link>
        </div>
      )}
    </div>
  );
}

function ProductReview(props: {
  email: string;
  rating: number;
  comment: string;
}) {
  return (
    <div className="border-b border-gray-300 pb-4 last:border-b-0">
      <p className="text-sm">{props.email}</p>
      <div className="mt-2">
        <Rating
          value={props.rating}
          className="max-w-[80px]"
          onChange={undefined}
        />
      </div>
      <p className="mt-4 text-sm">{props.comment}</p>
    </div>
  );
}
