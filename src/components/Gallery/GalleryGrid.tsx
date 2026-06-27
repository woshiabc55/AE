interface Props {
  title: string;
  children: React.ReactNode;
}

export default function GalleryGrid({ title, children }: Props) {
  return (
    <section className="w-full">
      <h2 className="mb-4 font-pixel text-xl text-lawn-800">{title}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </section>
  );
}
