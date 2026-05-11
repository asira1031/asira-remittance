type Props = {
  title: string;
  value: string;
};

export default function StatsCard({ title, value }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <p className="text-white/50 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-3 text-emerald-400">
        {value}
      </h2>
    </div>
  );
}