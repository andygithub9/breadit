"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface EditorProps {
  subredditId: string;
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
  // 這行程式碼使用了 useForm 鉤子函式來初始化表單狀態與驗證邏輯。
  // useForm 接受一個泛型類型參數，這裡指定了 PostCreationRequest 作為表單資料的型別。
  // 泛型類型參數表示表單的資料型別。
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    // 這行程式碼使用 zodResolver 將 PostValidator 整合到表單的解析器中。
    // zodResolver 函式接受一個 Zod 物件模式，用於處理表單資料的驗證。
    // 在這裡，將 PostValidator 作為參數傳遞給 zodResolver，這樣就會使用 PostValidator 來驗證表單資料。
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });

  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const pathname = usePathname();

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor", // 要插入的 dom 元素 id

        // prevent re-init EditorJS
        onReady() {
          ref.current = editor;
        },

        placeholder: "Type here to white your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      // clean up 初始化 EditorJS
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        subredditId,
        title,
        content,
      };
      const { data } = await axios.post("/api/subreddit/post/create", payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Your post was not published, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // r/mycommunity/submit into r/mycommunity
      const newPathname = pathname.split("/").slice(0, -1).join("/");

      // https://nextjs.org/docs/app/api-reference/functions/use-router#userouter
      // router.push(href: string) 只是導航到 href 並在 history 添加一條記錄，不會刷新或清除 cache 所以我們要在執行 router.refresh() 讓客戶端拿到最新的資料
      router.push(newPathname);
      router.refresh();

      return toast({
        description: "Your post has been published.",
      });
    },
  });

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId,
    };

    createPost(payload);
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register("title"); // 拿到 react-hook-form 的 title ref

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e); // 把 e 元素綁定到 titleRef

              // @ts-ignore
              _titleRef.current = e; // 把 e 元素綁定到 _titleRef.current
            }}
            {...rest} // 把 register("title") 解構出來除了 ref 的東西放回 TextareaAutosize
            placeholder="Title"
            className=" w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
        </div>
        <div id="editor" className="min-h-[500px]" />
      </form>
    </div>
  );
};

export default Editor;
