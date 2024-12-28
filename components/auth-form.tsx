"use client";

import { useState } from "react";
import { signIn, signUp } from "@/actions/auth";

export default function AuthForm({ type }: { type: "signIn" | "signUp" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    if (type === "signIn") {
      await signIn(formData);
    } else {
      await signUp(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">メールアドレス</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {type === "signIn" ? "サインイン" : "サインアップ"}
      </button>
    </form>
  );
}
