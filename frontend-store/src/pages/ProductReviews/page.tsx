import { Rating } from "~/pages/common/Rating";
import { clsx as cx } from "clsx";
import { useParams } from "@tanstack/react-router";
import { LoadingSpinner } from "~/pages/Checkout/components/LoadingSpinner";
import {
  PageDoesNotExist,
  UnexpectedError,
} from "~/pages/common/ErrorContents";
import { useProductReviews } from "~/pages/ProductReviews/api";
import { parseApiError } from "~/utils/api-error";

export function ProductReviewsPage() {
  const productId = Number.parseInt(
    useParams({
      from: "/e-commerce/product/$productId/reviews",
    }).productId,
  );

  const reviewsQuery = useProductReviews(productId);

  if (reviewsQuery.error) {
    const e = parseApiError(reviewsQuery.error);
    if (
      e.type === "application" &&
      e.error.details.code === "RESOURCE_NOT_FOUND"
    ) {
      return <PageDoesNotExist />;
    } else {
      return <UnexpectedError />;
    }
  }

  if (!reviewsQuery.data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="px-4 md:px-12">
      <div className="md:flex">
        <div className="basis-64 pt-8">
          <div className="h-80 w-full md:h-64">
            {reviewsQuery.data.product.imageUrl ? (
              <img
                src={reviewsQuery.data.product.imageUrl}
                alt=""
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
                No image
              </div>
            )}
          </div>
          <h2 className="mt-4 text-lg font-semibold">
            {reviewsQuery.data.product.name}
          </h2>
          <div className="mt-2">
            <Rating
              value={reviewsQuery.data.product.rating}
              className="max-w-[100px]"
              onChange={undefined}
            />
          </div>
        </div>

        <div className="md:basis-[calc(100%-16rem)] md:pl-8">
          <ProductReviews
            marginTop="mt-8"
            reviews={reviewsQuery.data.reviews}
          />
        </div>
      </div>
    </div>
  );
}

type ProductReview = {
  customerEmail: string;
  rating: number;
  comment: string;
};

function ProductReviews(props: {
  marginTop?: string;
  reviews: ProductReview[];
}) {
  return (
    <div className={cx(props.marginTop)}>
      <h2 className="text-xl font-medium">Reviews ({props.reviews.length})</h2>
      {props.reviews.length > 0 ? (
        <div className="mt-4 space-y-4">
          {props.reviews.map((r) => (
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
