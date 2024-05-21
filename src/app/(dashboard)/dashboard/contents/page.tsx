import BreadCrumb from "@/components/breadcrumb";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Content } from "@/types/content";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentClient } from '@/components/tables/contents/client';

const breadcrumbItems = [{ title: "Contents", link: "/dashboard/contents" }];

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  const contents: Content[] = await prisma.content.findMany({
    where: {
      indexed: false,
    }
  });

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ContentClient data={contents} />
      </div>
    </ScrollArea>
  );
}
