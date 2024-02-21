import { Link } from "@tanstack/react-router";
import { Taxon } from "@api-contract/common";

type Navigation = {
  category: string;
  links: {
    title: string;
    link?: string;
  }[];
};

const navigations: {
  men: Navigation[];
  women: Navigation[];
  kids: Navigation[];
} = {
  men: [
    {
      category: "Outerwear",
      links: [
        {
          title: "Jackets & Coats",
        },
      ],
    },
    {
      category: "Tops",
      links: [
        {
          title: "Fleece",
        },
        {
          title: "Long Sleeve T-Shirts",
        },
        {
          title: "Short Sleeve T-Shirts",
        },
      ],
    },
    {
      category: "Bottoms",
      links: [
        {
          title: "Jeans",
        },
        {
          title: "Sweat Pants",
        },
        {
          title: "Shorts",
        },
      ],
    },
  ],
  women: [
    {
      category: "Outerwear",
      links: [
        {
          title: "Jackets & Coats",
          link: "women/jackets-coats",
        },
      ],
    },
    {
      category: "Tops",
      links: [
        {
          title: "Shirts & Blouses",
        },
        {
          title: "Long Sleeve T-Shirts",
        },
        {
          title: "Short Sleeve T-Shirts",
        },
      ],
    },
    {
      category: "Bottoms",
      links: [
        {
          title: "Jeans",
        },
        {
          title: "Sweat Pants",
        },
        {
          title: "Shorts",
        },
      ],
    },
  ],
  kids: [
    {
      category: "Outerwear",
      links: [
        {
          title: "Jackets & Coats",
        },
      ],
    },
    {
      category: "Tops",
      links: [
        {
          title: "T-shirts",
        },
      ],
    },
    {
      category: "Bottoms",
      links: [
        {
          title: "Pants",
        },
        {
          title: "Shorts",
        },
      ],
    },
  ],
};

export function NavPopup(props: { onClick?: () => void; taxonTree: Taxon[] }) {
  return (
    <div
      onClick={props.onClick}
      className="flex space-x-20 px-28 pb-12 pt-6 text-sm"
    >
      {props.taxonTree.map((n) => (
        <div key={n.taxonName}>
          <div className="font-semibold uppercase">
            <p>{n.taxonName}</p>
          </div>
          <div className="mt-3 space-y-2">
            {n.children.map((t) => (
              <Link
                className="block"
                from="/"
                to={`products/${t.slug}` as any}
                key={t.slug}
              >
                {t.taxonName}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
