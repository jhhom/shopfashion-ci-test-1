import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";

import { PageTitle } from "~/pages/common/components/PageTitle";
import { P, match } from "ts-pattern";
import { SimpleProductForm } from "~/pages/Products/EditProduct/_components/SimpleForm";
import { ConfigurableProductForm } from "~/pages/Products/EditProduct/_components/ConfigurableForm";
import { UnexpectedErrorMessages } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { file2Base64 } from "~/utils/utils";
import {
  useEditProduct,
  useEditedProductInfo,
  useTaxonParents,
  useTaxonTree,
} from "~/pages/Products/api";

export function EditProductPage() {
  const productId = Number.parseInt(
    useParams({ from: "/products/$productId/edit" }).productId
  );

  const navigate = useNavigate();

  const editProductMutation = useEditProduct({
    productId,
    onSuccess: () => {
      navigate({ to: "/products/" });
    },
  });

  const getEditedProductQuery = useEditedProductInfo(productId);

  const taxonParentsQuery = useTaxonParents();

  const taxonTreeQuery = useTaxonTree();

  if (
    getEditedProductQuery.isError ||
    taxonParentsQuery.isError ||
    taxonTreeQuery.isError
  ) {
    return (
      <UnexpectedErrorMessages
        intent="display edit product form"
        errors={[
          {
            error: getEditedProductQuery.error,
            action: "Load edited product",
          },
          {
            error: taxonParentsQuery.error,
            action: "Load taxons",
          },
          { error: taxonTreeQuery.error, action: "Load taxon tree" },
        ]}
      />
    );
  }

  if (
    !(
      getEditedProductQuery.data &&
      taxonParentsQuery.data &&
      taxonTreeQuery.data
    )
  ) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div className="">
      <PageTitle
        title="Edit product"
        description="Manage your product catalog"
      />
      {match(getEditedProductQuery)
        .with(
          {
            data: { product: { type: "SIMPLE" } },
          },
          (q) => (
            <SimpleProductForm
              taxonChoices={taxonParentsQuery.data}
              taxonTreeSelection={taxonTreeQuery.data}
              productData={{
                name: q.data.name,
                description: q.data.description,
                pricing: q.data.product.pricing,
                mainTaxonId: q.data.mainTaxonId,
                checkedTaxonIds: q.data.productTaxonIds,
                availableAssociations: q.data.availableAssociations,
                productAssociations: q.data.productAssociations,
                status: q.data.status,
                imageUrl: q.data.imageUrl,
              }}
              onSubmit={async (v, productTaxonIds) => {
                let imageBase64: string | null = null;
                let removeImage = false;
                if (v.image === null) {
                  imageBase64 = null;
                  removeImage = true;
                } else if (v.image && v.image.length > 0) {
                  const img = v.image?.item(0);
                  if (img) {
                    imageBase64 = await file2Base64(img);
                  } else {
                    imageBase64 = null;
                    removeImage = true;
                  }
                }

                editProductMutation.mutate({
                  type: "SIMPLE",
                  name: v.name,
                  description: v.description,
                  pricing: v.pricing,
                  mainTaxonId: v.taxonId,
                  productTaxonIds,
                  productAssociations: v.associations.map((a) => a.value),
                  status: v.status,
                  imageBase64,
                  removeImage,
                });
              }}
            />
          )
        )
        .with({ data: { product: { type: "CONFIGURABLE" } } }, (q) => (
          <ConfigurableProductForm
            taxonChoices={taxonParentsQuery.data}
            taxonTreeSelection={taxonTreeQuery.data}
            productData={{
              name: q.data.name,
              description: q.data.description,
              productOptions: q.data.product.productOptions,
              mainTaxonId: q.data.mainTaxonId,
              checkedTaxonIds: q.data.productTaxonIds,
              availableAssociations: q.data.availableAssociations,
              productAssociations: q.data.productAssociations,
              status: q.data.status,
              defaultImageUrl: q.data.imageUrl,
            }}
            onSubmit={async (v, productTaxonIds) => {
              let imageBase64: string | null = null;
              let removeImage = false;
              if (v.image === null) {
                imageBase64 = null;
                removeImage = true;
              } else if (v.image && v.image.length > 0) {
                const img = v.image?.item(0);
                if (img) {
                  imageBase64 = await file2Base64(img);
                } else {
                  imageBase64 = null;
                  removeImage = true;
                }
              }

              editProductMutation.mutate({
                type: "CONFIGURABLE",
                name: v.name,
                description: v.description,
                mainTaxonId: v.taxonId,
                productTaxonIds,
                productAssociations: v.associations.map((a) => a.value),
                status: v.status,
                imageBase64,
                removeImage,
              });
            }}
          />
        ))
        .exhaustive()}
    </div>
  );
}
