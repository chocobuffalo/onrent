import CategoryItem from "@/components/atoms/CategoryItem";
import { RouteItem } from "@/types/menu";

export default function CategoriesRow({items}:{items:RouteItem[]}){
    return(
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3.5'>
            {items.map((item) => (
                <CategoryItem key={item.id} item={item} />
            ))}
        </div>
    )
}
