export interface VirtualProduct {
  id: string; // "originalId--color"
  originalId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string | null;
  size: string[];
  selectedColor: string;
  allColors: string[];
  color: string[]; // Duplicate of allColors to match Prisma name
  hasVariants: boolean;
}

export function flattenProducts(products: any[]): VirtualProduct[] {
  const flattened: VirtualProduct[] = [];

  products.forEach((product) => {
    if (product.hasVariants && product.images && product.images.length > 0) {
      product.images.forEach((img: any) => {
        flattened.push({
          id: `${product.id}--${img.color?.replace(/\s+/g, "-")}`,
          originalId: product.id,
          name: `${img.color || ""} ${product.name}`,
          description: product.description,
          price: product.price,
          quantity: 20, // Each variant has 20 in our seed
          imageUrl: img.url,
          category: product.category,
          size: product.size,
          selectedColor: img.color || "",
          allColors: product.color,
          color: product.color,
          hasVariants: true,
        });
      });
    } else {
      // Fallback for non-variant products
      flattened.push({
        ...product,
        originalId: product.id,
        selectedColor: product.color[0] || "",
        allColors: product.color,
        color: product.color,
      });
    }
  });

  return flattened;
}
export function parseDescription(description: string = "") {
  const hasTags =
    description.includes("[Specifications]") &&
    description.includes("[Description]");

  if (!hasTags) {
    return {
      description: description.trim(),
      specifications: [],
      summary: description.trim(),
    };
  }

  const parts = description.split("[Description]");
  const specStr = parts[0].replace("[Specifications]", "").trim();
  const mainDesc = parts[1]?.trim() || description;

  const specifications = specStr
    .split("\n")
    .filter((line) => line.includes(":"))
    .map((line) => {
      const [label, ...valueParts] = line.split(":");
      return {
        label: label.trim(),
        value: valueParts.join(":").trim(),
      };
    });

  return {
    description: mainDesc,
    specifications,
    summary: mainDesc.length > 150 ? mainDesc.substring(0, 150) + "..." : mainDesc,
  };
}
