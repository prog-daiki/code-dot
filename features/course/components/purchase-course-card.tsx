import { formatPrice } from "@/lib/format-price";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PurchaseCourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  category: string;
}

export const PurchaseCourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  category,
}: PurchaseCourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group h-full overflow-hidden rounded-lg border hover:shadow-2xl shadow-lg transition duration-300 ease-in-out">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-md">
          <Image
            alt={title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={imageUrl}
          />
          <div className="absolute top-2 left-2 bg-sky-500 text-white px-2 py-1 text-xs font-semibold rounded">
            購入済み
          </div>
        </div>
        <div className="flex flex-col p-2 pb-4">
          <div className="line-clamp-2 text-lg font-bold transition group-hover:text-sky-700 md:text-base">{title}</div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-1 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <BookOpen className="h-4 w-4 text-slate-500 bg-sky-100 rounded-full p-0.5" />
              <span>
                {chaptersLength} {chaptersLength > 1 ? "chapters" : "chapter"}
              </span>
            </div>
          </div>
          <p className="text-md font-semibold text-slate-700 md:text-sm mt-1">
            {price === 0 ? "無料" : formatPrice(price)}
          </p>
        </div>
      </div>
    </Link>
  );
};
