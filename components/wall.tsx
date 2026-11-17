"use client";

import { useCallback, useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Post = {
  id: string;
  name: string;
  content: string;
  created_at: string;
};

export default function Wall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
      return;
    }

    setPosts(data ?? []);
  }, []);

  useEffect(() => {
    void fetchPosts();

    const channel = supabase
      .channel("wall-feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        () => {
          void fetchPosts();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  async function handlePost() {
    if (!content.trim() || loading) return;

    setLoading(true);

    const { error } = await supabase.from("posts").insert({
      name: name.trim() || "Anonymous",
      content: content.trim(),
    });

    if (error) {
      console.error(error.message);
      alert("Unable to publish post.");
    } else {
      setContent("");
      await fetchPosts();
    }

    setLoading(false);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* HEADER */}
        <header className="flex flex-col text-center space-y-2">
          <div className="flex items-center mx-auto gap-2">
            <div className=" flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <MessageSquare size={28} />
            </div>

            <h1 className="text-3xl font-bold">Wall</h1>
          </div>

          <p className="text-sm text-slate-500">
            Share your thoughts with everyone.
          </p>
        </header>

        {/* POST FORM */}
        <Card>
          <CardContent className="space-y-4 p-5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="Your name (optional)"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Textarea
              placeholder="What's on your mind?"
              value={content}
              maxLength={280}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-28 resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {content.length}/280
              </span>

              <Button
                onClick={handlePost}
                disabled={!content.trim() || loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FEED */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest posts</h2>

            <span className="text-sm text-slate-400">{posts.length} posts</span>
          </div>

          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="mx-auto mb-3 text-slate-400" />

                <p className="font-medium">No posts yet</p>

                <p className="text-sm text-slate-400">
                  Be the first to share something!
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{post.name}</p>

                    <time className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>

                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7">
                    {post.content}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </section>

        <footer className="text-center text-xs text-slate-400">
          Wall · A simple place to share.
        </footer>
      </div>
    </main>
  );
}
