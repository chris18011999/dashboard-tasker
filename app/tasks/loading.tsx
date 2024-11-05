export default function LoadingPage() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex space-x-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg mb-4">title</h3>
            <div className="flex-1 bg-muted/50 rounded-lg p-4 flex flex-col gap-3"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg mb-4">title</h3>
            <div className="flex-1 bg-muted/50 rounded-lg p-4 flex flex-col gap-3"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg mb-4">title</h3>
            <div className="flex-1 bg-muted/50 rounded-lg p-4 flex flex-col gap-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
