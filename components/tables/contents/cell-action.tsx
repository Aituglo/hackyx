"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Content } from "@/types/content";
import { Edit, MoreHorizontal, Trash, Plus, Check } from "lucide-react";
import { deleteContent, parseContent } from "@/actions/contentActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface CellActionProps {
  data: Content;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onConfirm = async () => {
    deleteContent(data.id);
  };

  const handleParseContent = async () => {
    setLoading(true);
    try {
      const response = await parseContent(data);
      if (response.success) {
        toast({
          variant: "default",
          title: "Content parsed successfully",
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to parse content",
        // @ts-ignore
        description: error.message || "There was a problem parsing the content.",
      });
    } finally {
      setLoading(false);
      router.refresh();
    }
  };



  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {data.parsed && (
            <DropdownMenuItem onClick={() => router.push(`/dashboard/contents/${data.id}`)}>
              <Check className="mr-2 h-4 w-4" /> Validate
            </DropdownMenuItem>
          )}
          {!data.parsed && (
          <DropdownMenuItem
            onClick={handleParseContent}
          >
            <Plus className="mr-2 h-4 w-4" /> Parse
          </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/contents/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};