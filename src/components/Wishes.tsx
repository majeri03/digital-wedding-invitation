"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

interface Wish {
  id: string;
  name: string;
  text: string;
  createdAt: any;
}

export default function Wishes({ slug }: { slug: string }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cannot use orderBy directly with where without composite index in firestore by default.
    // To avoid complex indexing requirements for users, we'll fetch where and then sort on client side for now.
    const q = query(collection(db, "wishes"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let wishesData: Wish[] = [];
      snapshot.forEach((doc) => {
        if(doc.data().clientSlug === slug) {
          wishesData.push({ id: doc.id, ...doc.data() } as Wish);
        }
      });
      // Client-side sort to avoid "Index Required" errors in Firebase Console for composite queries
      wishesData.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      setWishes(wishesData);
    });

    return () => unsubscribe();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const text = (form.elements.namedItem("text") as HTMLTextAreaElement).value;

    try {
      await addDoc(collection(db, "wishes"), {
        clientSlug: slug,
        name,
        text,
        createdAt: serverTimestamp()
      });
      form.reset();
    } catch (error) {
      console.error("Error adding wish: ", error);
      alert("Gagal mengirim ucapan, pastikan koneksi internet stabil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-brand-ivory text-brand-maroon relative">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading text-brand-maroon mb-4">Ucapan & Doa</h2>
          <p className="text-sm opacity-80">
            Berikan ucapan selamat dan doa restu untuk kedua mempelai.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-lg border border-brand-maroon/10 mb-8"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nama"
              required
              className="w-full px-4 py-3 rounded-xl border border-brand-maroon/20 focus:outline-none focus:border-brand-gold bg-transparent text-sm"
            />
            <textarea
              name="text"
              placeholder="Ucapan & Doa"
              rows={4}
              required
              className="w-full px-4 py-3 rounded-xl border border-brand-maroon/20 focus:outline-none focus:border-brand-gold bg-transparent text-sm resize-none"
            ></textarea>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-brand-maroon text-brand-gold font-bold rounded-xl hover:bg-brand-maroon/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Mengirim..." : "Kirim Ucapan"}
            </button>
          </form>
        </motion.div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {wishes.map((wish, index) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-brand-maroon/5"
            >
              <h4 className="font-bold text-sm mb-1">{wish.name}</h4>
              <p className="text-sm opacity-80">{wish.text}</p>
            </motion.div>
          ))}
          {wishes.length === 0 && (
            <p className="text-center text-sm opacity-60 italic">Belum ada ucapan, jadilah yang pertama memberikan doa restu.</p>
          )}
        </div>
      </div>
    </section>
  );
}
