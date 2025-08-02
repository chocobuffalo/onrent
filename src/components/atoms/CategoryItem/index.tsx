import { RouteItem } from "@/types/menu";
import "./categoryItem.scss";
import AOSWrapper from "../aosWrapper";
import Link from "next/link";
import Image from "next/image";

export default function CategoryItem({
  item: { id, image, title, slug },
}: {
  item: RouteItem;
}) {
  return (
    <AOSWrapper animation="fade-in" delay={id * 200} className="cat-item">
      <article className="flex flex-col justify-between overflow-hidden category-item items-center shadow-lg hover:shadow-xl rounded-2xl">
        <Link href={slug} className="block w-full">
          <div className="images-section">
            {image && (
              <Image
                src={image}
                alt={title}
                width={300}
                height={200}
                className="w-full h-auto object-cover"
              />
            )}
          </div>
          <div className="text-section p-3.5 pb-4">
            <h3 className="text-lg font-medium text-black">{title}</h3>
            <p className="explore-more duration-300 max-w-fit">Explorar más</p>
          </div>
        </Link>
      </article>
    </AOSWrapper>
  );
}
