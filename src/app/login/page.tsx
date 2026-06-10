"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileText, LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    if (isRegister) {
      try {
        const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return; }
        await signIn("credentials", { email, password, redirect: false });
        router.push("/dashboard");
      } catch (err) { setError("Registration failed"); }
    } else {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) setError("Invalid email or password");
      else router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4"><FileText className="w-8 h-8 text-white" /></div>
          <h1 className="text-2xl font-bold text-gray-900">InvoicePDF Pro</h1>
          <p className="text-gray-500 mt-2">Professional Invoice Generator</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-2 mb-6">
            <button onClick={() => { setIsRegister(false); setError(""); }} className={`flex-1 py-2 rounded-lg font-medium transition ${!isRegister ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}><LogIn className="w-4 h-4 inline mr-1" /> Login</button>
            <button onClick={() => { setIsRegister(true); setError(""); }} className={`flex-1 py-2 rounded-lg font-medium transition ${isRegister ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}><UserPlus className="w-4 h-4 inline mr-1" /> Register</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Your name" /></div>}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" placeholder="Min 6 chars" required minLength={6} /></div>
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-400">{loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
