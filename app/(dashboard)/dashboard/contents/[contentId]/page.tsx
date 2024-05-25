/* eslint-disable  @typescript-eslint/no-explicit-any */
import BreadCrumb from "@/components/breadcrumb";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentForm } from "@/components/forms/content-form";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

const breadcrumbItems = [{ title: "Contents", link: "/dashboard/contents" }];

export default async function page({ params }: { params: { contentId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  const content = await prisma.content.findUnique({
    where: {
      id: params.contentId,
    }
  });

  for (let key in content) {
    // @ts-ignore
    content[key] = content[key] || '';
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ContentForm
          initialData={content}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
