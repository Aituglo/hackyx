import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentForm } from "@/components/forms/content-form";

const breadcrumbItems = [{ title: "Contents", link: "/dashboard/contents/new" }];

export default async function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ContentForm
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
