import DashboardLayout from '../layout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Settings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
