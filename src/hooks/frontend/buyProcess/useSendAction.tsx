"use client";
import { interestLinks } from "@/constants/routes/frontend";
import { useUIAppSelector } from "@/libs/redux/hooks";
import { useRouter } from "next/navigation";
import { SelectInterface } from "@/types/iu";

export default function useSendAction() {
  const router = useRouter();
  const uiSelector = useUIAppSelector((state) => state.filters);

  const handlerSubmit = () => {
    const catalogue = uiSelector.type;
    let catalogueValue = "";
    if (Array.isArray(catalogue)) {
      catalogueValue =
        catalogue.length > 0 && catalogue[0]?.value ? catalogue[0].value : "";
    } else if (catalogue && "value" in catalogue) {
      catalogueValue = catalogue.value;
    }

    const basePath =
      interestLinks.find((link) => link.machine_category === catalogueValue)
        ?.slug || "/catalogo";

    const params = new URLSearchParams();

    params.set("page", String(uiSelector.page || 1));
    params.set("page_size", String(uiSelector.pageSize || 20));
    params.set("national_only", String(uiSelector.nationalOnly ?? false));

    if (uiSelector.location && (uiSelector.location as SelectInterface).value) {
      params.set("location", (uiSelector.location as SelectInterface).value);
    }
    if (uiSelector.rangePrice?.min)
      params.set("min_price", String(uiSelector.rangePrice.min));
    if (uiSelector.rangePrice?.max)
      params.set("max_price", String(uiSelector.rangePrice.max));
    if (uiSelector.startDate) params.set("start_date", uiSelector.startDate);
    if (uiSelector.endDate) params.set("end_date", uiSelector.endDate);

    router.push(`${basePath}?${params.toString()}`);
  };

  return { handlerSubmit };
}
