"use client";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Content } from "@/types/content";
import { columns } from "./columns";

interface ContentsProps {
  data: Content[];
}

export const ContentClient: React.FC<ContentsProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Contents`}
          description="Manage the contents"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/contents/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="url" columns={columns} data={data} />
    </>
  );
};