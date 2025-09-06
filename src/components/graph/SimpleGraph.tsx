export const SimpleGraph = () => {
  return (
    <div className="p-8 bg-background text-text-primary">
      <h1 className="text-2xl font-serif mb-4">Simple Graph Test</h1>
      <p className="text-text-secondary">Testing without D3 to isolate React issues.</p>
      <div className="mt-8 w-full h-96 border border-border rounded-lg bg-surface flex items-center justify-center">
        <p className="text-text-secondary">Graph placeholder - React working correctly</p>
      </div>
    </div>
  );
};