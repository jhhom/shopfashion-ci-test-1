import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { z } from "zod";

import { PageTitle } from "~/pages/common/components/PageTitle";
import { IconPencil } from "~/pages/common/Icons";
import { Form } from "~/pages/common/components/Form/Form";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { InputField } from "~/pages/common/components/Form/InputField";
import {
  useEditAssociation,
  useOneAssociation,
} from "~/pages/ProductAssociations/api";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export function EditProductAssociationPage() {
  const navigate = useNavigate();

  const associationTypeId = Number.parseInt(
    useParams({
      from: "/product-associations/$productAssociationTypeId/edit",
    }).productAssociationTypeId
  );

  const editProductAssociationMutation = useEditAssociation({
    onSuccess: () => {
      navigate({ to: "/product-associations" });
    },
  });

  const associationQuery = useOneAssociation(associationTypeId);

  if (associationQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="display product association form"
        failed="load product association's data"
      />
    );
  }

  if (!associationQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div className="h-[calc(100vh-2.5rem)] overflow-y-auto">
      <PageTitle
        title="Edit product association type"
        description="Manage association types of your product"
        icon={<IconPencil className="h-6 w-6 text-teal-500" />}
      />
      <Form
        onSubmit={(v) => {
          editProductAssociationMutation.mutate({
            associationTypeId,
            associationTypeName: v.name,
          });
        }}
        schema={formSchema}
        options={{
          defaultValues: {
            name: associationQuery.data.name,
          },
        }}
        className="mt-5 rounded-md border border-gray-300 bg-white p-4 text-sm"
      >
        {({ register, setValue, formState: { errors } }) => {
          return (
            <>
              <InputField
                registration={register("name")}
                label="Name"
                error={errors["name"]}
              />

              <div className="mt-8 flex">
                <button
                  type="submit"
                  className="rounded-l-md bg-teal-500 px-4 py-2 font-medium text-white"
                >
                  Update
                </button>
                <Link
                  to="/product-associations"
                  className="rounded-r-md bg-gray-200 px-4 py-2"
                >
                  Cancel
                </Link>
              </div>
            </>
          );
        }}
      </Form>
    </div>
  );
}
