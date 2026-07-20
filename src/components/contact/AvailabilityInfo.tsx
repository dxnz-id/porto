const info = [
  { label: "Open to", value: "Fullstack roles — remote or Central Java" },
  { label: "Based in", value: "Central Java, Indonesia · GMT+7" },
  { label: "Reply time", value: "Within a day, most days" },
];

export default function AvailabilityInfo() {
  return (
    <div>
      <h2 className="text-label-caps text-secondary uppercase tracking-widest mb-8">
        Availability
      </h2>
      <div className="flex flex-col gap-4">
        {info.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-secondary">
              {label}
            </span>
            <p className="text-body-md text-primary">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
