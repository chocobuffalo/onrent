
"use client";
import { interestLinks } from "@/constants/routes/frontend";
import { useUIAppSelector } from "@/libs/redux/hooks";
import { useRouter } from "next/navigation";
import { SelectInterface } from "@/types/iu";

export default function useSendAction() {
  const router = useRouter();
  const filters = useUIAppSelector((state) => state.filters);

  const getFirstSelected = (
    v: SelectInterface[] | SelectInterface | null
  ): SelectInterface | null => {
    if (!v) return null;
    return Array.isArray(v) ? v[0] ?? null : v;
  };

  const handlerSubmit = () => {
    const firstType = getFirstSelected(filters.type);
    const catalogueValue = firstType?.value || "";

    const basePath =
      interestLinks.find((link) => link.machine_category === catalogueValue)
        ?.slug || "/catalogo";

    const params = new URLSearchParams();

    const locationValue = filters.location?.value;
    if (locationValue) params.set("location", locationValue);

    if (filters.rangePrice?.min != null && filters.rangePrice.min > 0) {
      params.set("min_price", String(filters.rangePrice.min));
    }
    if (filters.rangePrice?.max != null && filters.rangePrice.max > 0) {
      params.set("max_price", String(filters.rangePrice.max));
    }

    if (filters.startDate) params.set("start_date", filters.startDate);
    if (filters.endDate) params.set("end_date", filters.endDate);

    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  };

  return { handlerSubmit };
}
