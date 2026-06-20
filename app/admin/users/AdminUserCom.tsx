"use client";

import { useState } from "react";
import Link from "next/link"; // Link import လုပ်ပါ
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AdminUsersPage({ users }: { users: any[] }) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <Input
          placeholder="Search by name or email..."
          className="max-w-xs rounded-xl bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* iOS Style Card Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="pl-6 font-semibold text-gray-900">
                    {/* User ID ကို ညွှန်းပေးထားပါတယ် */}
                    <Link href={`/admin/users/${user.id}`} className="hover:text-blue-600 transition-colors">
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-500">{user.email}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-medium capitalize">
                        {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}