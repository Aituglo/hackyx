"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TagInput, Tag } from "emblor";
import { useRouter } from "next/navigation";
import { createContent, updateContent, validateContent } from "@/actions/contentActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { useToast } from "../ui/use-toast";


const formSchema = z.object({
  title: z.string(),
  url: z
    .string()
    .url()
    .refine(
      (data) => data.startsWith("http://") || data.startsWith("https://"),
      {
        message: "URL must start with http:// or https://",
      },
    ),
  description: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()).optional().or(z.literal("")),
  program: z.string().optional().or(z.literal("")),
  source: z.string().optional().or(z.literal("")),
  cwe: z.string().optional().or(z.literal("")),
  cve: z.string().optional().or(z.literal("")),
});

type ContentFormValues = z.infer<typeof formSchema>;

interface ContentFormProps {
  initialData: any | null;
}

export const ContentForm: React.FC<ContentFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const title = initialData ? (initialData.parsed ? "Review content" : "Edit content") : "Add a content";
  const description = initialData ? "Edit a content." : "Add a new content";

  const [tags, setTags] = useState<Tag[]>(initialData ? initialData.tags.map((tag: string, index: number) => ({ id: index, text: tag })) : []);

  const defaultValues = initialData ? initialData : {};

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { setValue } = form;

  

  const onSubmit = async (data: ContentFormValues) => {
    try {
      setLoading(true);
      let response;

      if (initialData) {
        response = await updateContent(initialData.id, data);
        if (response.success) {
          toast({
            variant: "default",
            title: "Content updated successfully.",
          });
          router.push(`/dashboard/contents`);
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: response.error,
          });
        }
      } else {
        response = await createContent(data);
        if (response.success) {
          toast({
            variant: "default",
            title: "Content added successfully.",
          });
          router.push(`/dashboard/contents`);
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: response.error,
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-1/2"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Enter a tag"
                      tags={tags}
                      setTags={(newTags) => {
                        setTags(newTags);
                        // @ts-ignore
                        setValue(
                          "tags",
                          // @ts-ignore
                          newTags.map((tag) => tag.text),
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Program"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Source" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cwe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CWE</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="CWE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cve"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVE</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="CVE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button
            disabled={loading}
            className="ml-auto mr-4"
            type="submit"
          >
            {initialData ? "Save changes" : "Create"}
          </Button>
          
        {initialData?.parsed && (
          <Button
            disabled={loading}
            className="mt-4 ml-auto"
            type="button"
            onClick={async (event) => {
              event.preventDefault();
              if (initialData) {
                const validationResponse = await validateContent(initialData);
                if (validationResponse.success) {
                  toast({
                    variant: "default",
                    title: "Content validated successfully.",
                  });
                  router.push(`/dashboard/contents`);
                } else {
                  toast({
                    variant: "destructive",
                    title: "Validation failed.",
                    description: validationResponse.error,
                  });
                }
              }
            }}
          >
            Validate
          </Button>
        )}
        </form>
      </Form>
    </>
  );
};
