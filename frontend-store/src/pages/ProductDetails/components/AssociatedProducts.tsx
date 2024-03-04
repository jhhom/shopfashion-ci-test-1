import { Link } from "@tanstack/react-router";
import { MissingProductImage } from "~/pages/common/ErrorContents";

export function AssociatedProducts(props: {
  associations: {
    id: number;
    name: string;
    otherProducts: {
      id: number;
      name: string;
      imgUrl: string | null;
      pricing: number;
    }[];
  }[];
}) {
  return (
    <div className="mt-12 space-y-20 pb-12">
      {props.associations
        .filter((a) => a.otherProducts.length > 0)
        .map((a) => (
          <div key={a.id}>
            <h2 className="text-center text-xl font-medium after:pl-4 after:text-3xl after:text-teal-500 after:content-['›']">
              <span>{a.name}</span>
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 sm:gap-y-12 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {a.otherProducts.map((p) => (
                <li key={p.id} className="h-72 w-full">
                  <Link
                    to="/product/$productId"
                    className="h-full w-full"
                    params={{ productId: p.id.toString() }}
                  >
                    <div className="h-full w-full rounded-md">
                      {p.imgUrl ? (
                        <img
                          className="h-full w-full rounded-md object-cover"
                          src={p.imgUrl}
                        />
                      ) : (
                        <MissingProductImage />
                      )}
                    </div>
                    <div className="flex justify-between pt-2">
                      <p className="font-semibold">{p.name}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
