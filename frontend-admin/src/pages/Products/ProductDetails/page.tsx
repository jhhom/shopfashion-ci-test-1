import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { isAppError } from "~/api-contract/errors/application-errors";
import { client } from "~/external/api-client/client";
import { useProductDetails } from "~/pages/Products/api";
import {
  ResourceNotFoundErrorMessage,
  UnexpectedErrorMessage,
} from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";

export function ProductDetailsPage() {
  const productId = Number.parseInt(
    useParams({ from: "/products/$productId" }).productId
  );

  const productDetailsQuery = useProductDetails(productId);

  if (productDetailsQuery.error) {
    if (
      isAppError(productDetailsQuery.error) &&
      productDetailsQuery.error.error.details.code === "RESOURCE_NOT_FOUND"
    ) {
      return <ResourceNotFoundErrorMessage resource="Product" />;
    } else {
      return (
        <UnexpectedErrorMessage
          intent="display product"
          failed="load product details"
        />
      );
    }
  }

  if (!productDetailsQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div>
      <div className="border border-gray-300 bg-white px-4 py-2 shadow-o-md">
        <table className="w-full table-fixed text-sm">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="w-32 border-r border-gray-300 py-2 pr-2 font-medium text-gray-400">
                Name
              </td>
              <td className=" py-2 pl-2.5">{productDetailsQuery.data.name}</td>
            </tr>
            <tr className="border-b border-gray-300 last:border-b-0">
              <td className="w-32 border-r  py-2 pr-2 font-medium text-gray-400">
                Status
              </td>
              <td className="py-2 pl-2.5">
                {productDetailsQuery.data.status[0].toUpperCase() +
                  productDetailsQuery.data.status.slice(1)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 border border-gray-300 bg-white px-4 pb-4 pt-3 text-sm shadow-o-md">
        <p className="font-medium text-gray-400">Media</p>
        {productDetailsQuery.data.imageUrl ? (
          <img
            className="mt-2 h-48 w-48 border border-gray-300 object-cover"
            src={productDetailsQuery.data.imageUrl}
          />
        ) : (
          <div className="mt-4">
            <p>No image</p>
          </div>
        )}
      </div>
    </div>
  );
}
