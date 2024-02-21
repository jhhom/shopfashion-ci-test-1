import { Link, useNavigate, useParams } from "@tanstack/react-router";

import { PageTitle } from "~/pages/common/components/PageTitle";
import { GenerateProductVariantsForm } from "~/pages/Products/GenerateProductVariants3/_components/GenerateProductVariantsForm";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import {
  useGenerateVariants,
  useSaveGeneratedVariants,
} from "~/pages/Products/api";

export function GenerateProductVariantsPage() {
  const params = useParams({
    from: "/products/$productId/variants/generate",
  });
  const productId = Number.parseInt(params.productId);
  const navigate = useNavigate();

  const generateVariantsQuery = useGenerateVariants(productId);

  const saveGeneratedProductVariantMutation = useSaveGeneratedVariants({
    productId,
    onSuccess: () => {
      navigate({
        to: "/products/$productId/variants",
        params: {
          productId: productId.toString(),
        },
      });
    },
  });

  if (!generateVariantsQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div>
      <PageTitle
        title={generateVariantsQuery.data.productName}
        description="Generate variants"
      />

      <GenerateProductVariantsForm
        productId={productId}
        configurableOptions={generateVariantsQuery.data.configurableOptions}
        existingVariants={generateVariantsQuery.data.existingProductVariants}
        generatedVariants={generateVariantsQuery.data.generatedProductVariants}
        onSubmit={(v) => {
          saveGeneratedProductVariantMutation.mutate({
            existingProductVariants: v.existingVariants,
            generatedProductVariants: v.generatedVariants,
          });
        }}
      />
    </div>
  );
}
