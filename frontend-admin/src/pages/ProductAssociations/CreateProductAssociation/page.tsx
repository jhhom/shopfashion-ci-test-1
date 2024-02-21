import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "~/pages/common/components/PageTitle";
import { Link, useNavigate } from "@tanstack/react-router";
import { InputField } from "~/pages/common/components/Form/InputField";
import { FormCreateActionButtons } from "~/pages/common/components/Form/FormCreateActionButtons";
import { Form } from "~/pages/common/components/Form/Form";
import { useCreateAssociation } from "~/pages/ProductAssociations/api";

const formSchema = z.object({
  name: z.string().min(1, "Association type name is required"),
});

export function CreateProductAssociationPage() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const createProductAssociationMutation = useCreateAssociation({
    onSuccess: () => {
      navigate({ to: "/product-associations" });
    },
  });

  return (
    <>
      <div className="flex items-end justify-between">
        <PageTitle
          title={"New product association type"}
          description="Manage association types of your products"
        />
      </div>

      <div className="mt-8 rounded-md border border-gray-300 bg-white p-5 text-sm">
        <Form
          schema={formSchema}
          onSubmit={(v) => {
            createProductAssociationMutation.mutate(v.name);
          }}
          className="rounded-md border border-gray-300 p-5"
        >
          {({ register, formState: { errors } }) => (
            <>
              <InputField
                label="Name"
                id="name"
                error={errors.name}
                type="text"
                registration={register("name")}
                required
              />
              <FormCreateActionButtons
                linkProps={{ to: "/product-associations", params: {} }}
                className="mt-12"
              />
            </>
          )}
        </Form>
      </div>
    </>
  );
}
