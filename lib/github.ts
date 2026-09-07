/**
 * Minimal GitHub Git Data API client.
 *
 * Commits one or more file changes to the content repo in a single atomic
 * commit, so the /admin "Publish" and "Reject" actions work on Vercel's
 * read-only filesystem. Every commit to the default branch triggers a Vercel
 * redeploy — the published article is live ~1–2 min later.
 *
 * Requires GITHUB_TOKEN: a fine-grained PAT with "Contents: Read and write"
 * on this repo. GITHUB_REPO ("owner/name") and GITHUB_BRANCH override the
 * defaults below. When GITHUB_TOKEN is unset the caller falls back to a
 * local filesystem write (fine for `npm run dev`, impossible on Vercel).
 */
const API = "https://api.github.com";

export type FileChange =
  | { path: string; content: string } // create or overwrite
  | { path: string; delete: true }; // remove

export function githubConfigured(): boolean {
  return !!process.env.GITHUB_TOKEN;
}

function repo(): string {
  return process.env.GITHUB_REPO || "brandbizkit/Brandbizkit-Website";
}

function branch(): string {
  return process.env.GITHUB_BRANCH || "main";
}

async function gh<T>(pathname: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}/repos/${repo()}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "brandbizkit-admin",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `GitHub ${init?.method ?? "GET"} ${pathname} → ${res.status}: ${body.slice(0, 300)}`
    );
  }
  return (res.status === 204 ? null : await res.json()) as T;
}

type TreeEntry = {
  path: string;
  mode: "100644";
  type: "blob";
  sha: string | null;
};

/** Commit `changes` as a single commit on the configured branch. Returns the new commit sha. */
export async function commitFiles(
  message: string,
  changes: FileChange[]
): Promise<string> {
  const ref = await gh<{ object: { sha: string } }>(
    `/git/ref/heads/${branch()}`
  );
  const baseSha = ref.object.sha;
  const baseCommit = await gh<{ tree: { sha: string } }>(
    `/git/commits/${baseSha}`
  );

  const tree: TreeEntry[] = [];
  for (const change of changes) {
    if ("delete" in change) {
      tree.push({ path: change.path, mode: "100644", type: "blob", sha: null });
    } else {
      const blob = await gh<{ sha: string }>(`/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: change.content, encoding: "utf-8" }),
      });
      tree.push({
        path: change.path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      });
    }
  }

  const newTree = await gh<{ sha: string }>(`/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree }),
  });
  const commit = await gh<{ sha: string }>(`/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [baseSha],
    }),
  });
  await gh(`/git/refs/heads/${branch()}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
  return commit.sha;
}
