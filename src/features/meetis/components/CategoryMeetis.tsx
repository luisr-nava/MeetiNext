import { meetiService } from "../services/MeetiService";
import MeetiCard from "./MeetiCard";

type Props = {
  categoryId: string;
};

export default async function CategoryMeetis({ categoryId }: Props) {
  const meetis = await meetiService.getMeetisByCategory(categoryId);
  return (
    <>
      {meetis.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 px-5 lg:px-0 py-10">
          {meetis.map((meeti) => (
            <MeetiCard meeti={meeti} key={meeti.id} />
          ))}
        </div>
      ) : (
        <p className="text-center mt-10 text-lg text-gray-600">
          No hay próximos Meetis en esta categoría
        </p>
      )}
    </>
  );
}

