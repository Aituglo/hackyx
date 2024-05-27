"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createPublicContent } from "@/actions/contentActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TagInput, Tag } from "emblor";
import { useToast } from "../ui/use-toast";
import Turnstile, { useTurnstile } from "react-turnstile";

const formSchema = z.object({
  title: z.string(),
  url: z.string().url().refine((data) => data.startsWith('http://') || data.startsWith('https://'), {
    message: "URL must start with http:// or https://",
  }),
  description: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()).optional().or(z.literal("")),
});

type PublicContentFormValues = z.infer<typeof formSchema>;

export const PublicContentForm: React.FC<{ setIsOpen: (isOpen: boolean) => void }> = ({ setIsOpen }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const turnstile = useTurnstile();

  const [tags, setTags] = useState<Tag[]>([]);
  const [captchaToken, setCaptchaToken] = useState(null);

  const form = useForm<PublicContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { setValue } = form;

  const onSubmit = async (data: PublicContentFormValues) => {
    try {
      if (!captchaToken) {
        toast({
          variant: "destructive",
          title: "Captcha validation failed",
          description: "Please complete the captcha to proceed.",
        });
        return;
      }
      setLoading(true);
      const response = await createPublicContent({ ...data, captcha: captchaToken });
      if (response.success) {
        router.push(`/`);
        toast({
          variant: "default",
          title: "Your content is sent and will now be moderated before added in Hackyx.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.error,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your content.",
      });
      turnstile.reset();
    } finally {
      setLoading(false);
      setCaptchaToken(null);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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
                  <Input disabled={loading} placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagInput
                    {...field}
                    placeholder="Enter a tag"
                    tags={tags}
                    setTags={(newTags) => {
                      setTags(newTags);
                      // @ts-ignore
                      setValue('tags', newTags.map((tag) => tag.text));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onVerify={(token) => setCaptchaToken(token)}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            Send
          </Button>
        </form>
      </Form>
    </>
  );
};