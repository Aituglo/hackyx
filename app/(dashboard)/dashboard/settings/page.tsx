import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heading } from "@/components/ui/heading";

const breadcrumbItems = [{ title: "Settings", link: "/dashboard/settings" }];

export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between">
        <Heading title="Settings" description="Modify your settings here" />
      </div>
      </div>
    </ScrollArea>
  );
}
