import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useSettings } from "@/hook/useSettings";
import { Spinner } from "@/components/ui/spinner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { loading } = useSettings();

  return (
    <div className="dark min-h-screen w-screen bg-background text-foreground">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen min-w-screen">
          <Spinner />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
