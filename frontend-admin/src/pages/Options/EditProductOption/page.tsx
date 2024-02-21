import { useNavigate, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "~/pages/common/components/PageTitle";

import { ok, err } from "neverthrow";

import { EditProductOptionForm } from "~/pages/Options/EditProductOption/components";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import {
  useDeleteProductOptionValue,
  useEditProductOption,
  useEditedProductOption,
} from "~/pages/Options/api";

export function EditProductOptionPage() {
  const productOptionCode = useParams({
    from: "/options/$optionCode/edit",
  }).optionCode;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const optionsQuery = useEditedProductOption(productOptionCode);

  const editProductOptionMutation = useEditProductOption(() => {
    navigate({ to: "/options" });
  });

  const deleteProductOptionValueMutation = useDeleteProductOptionValue();

  if (optionsQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="list product options"
        failed="load product options"
      />
    );
  }

  if (!optionsQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  const defaultFormValues = {
    position: optionsQuery.data.position,
    productOptionName: optionsQuery.data.optionName,
    editedProductOptionValues: optionsQuery.data.values.map((x) => ({
      id: x.id,
      name: x.value,
    })),
    newProductOptionValues: [],
  };

  return (
    <>
      <div className="flex items-end justify-between">
        <PageTitle
          title={"Edit product option"}
          description="Manage configuration options of your product"
        />
      </div>
      <div className="mt-8 rounded-md border border-gray-300 bg-white px-5 py-3">
        <EditProductOptionForm
          defaultFormValues={defaultFormValues}
          onSaveChanges={(formValues) => {
            return editProductOptionMutation.mutateAsync({
              optionCode: productOptionCode,
              productOption: {
                name: formValues.productOptionName,
                position: formValues.position,
                newProductOptionValues: formValues.newProductOptionValues.map(
                  (x) => x.name
                ),
                editedProductOptionValues: formValues.editedProductOptionValues,
              },
            });
          }}
          onDeleteProductOptionValue={(id) => {
            return deleteProductOptionValueMutation
              .mutateAsync(id)
              .then((v) => {
                return ok(v);
              })
              .catch((e) => {
                return err(e);
              });
          }}
          onCancel={() => navigate({ to: "/options" })}
        />
      </div>
    </>
  );
}
