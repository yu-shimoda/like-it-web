"use client";

import { useState } from "react";
import { insertLike } from "./actions";

export default function LikesPage() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="p-10">
      <form
        action={async () => {
          await insertLike();
          setSuccess(true);
        }}
      >
        <button type="submit" className="border p-2">
          Insert Like
        </button>
      </form>

      {success && <p className="mt-4">Success!</p>}
    </div>
  );
}
