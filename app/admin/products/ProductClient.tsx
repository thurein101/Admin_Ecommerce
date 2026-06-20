"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteProductButton } from "@/components/admin/delete-product-btn";

export function AdminProductsClient({ products }: { products: any[] }) {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStock = 
      stockFilter === "all" ? true :
      stockFilter === "in-stock" ? p.stock > 0 : p.stock === 0;
    return matchesSearch && matchesStock;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Inventory</h1>
        </div>
        <div className="flex gap-2">
          <Input 
            placeholder="Search products..." 
            className="rounded-xl w-full md:w-64"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select onValueChange={setStockFilter} defaultValue="all">
            <SelectTrigger className="w-32 rounded-xl">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/admin/products/new"><Button className="rounded-xl"><Plus className="h-4 w-4 mr-2" /> Add</Button></Link>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-gray-100">
                <Image src={product.images[0] || "/placeholder.png"} alt={product.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                <p className="text-xs font-bold text-gray-900">${product.price.toFixed(2)}</p>
                <p className={`text-[10px] font-medium ${product.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                  {product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Link href={`/admin/products/${product.id}/edit`}><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></Link>
              <DeleteProductButton productId={product.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}