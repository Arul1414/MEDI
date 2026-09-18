import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Users as UsersIcon,
  Plus,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  UserCheck,
  Search,
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { users, currentUser, setCurrentUser, addUser } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Add User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('STAFF');
  const [newDept, setNewDept] = useState('Emergency');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    addUser({
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDept,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
    });

    setAddModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header with Orchid Purple Module Identity */}
      <div className="bg-gradient-to-r from-purple-50 via-fuchsia-50/50 to-pink-50 border border-purple-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-800">
              Access Control • Orchid Purple Module
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-mono font-semibold">
              RBAC Security Protocol Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UsersIcon className="w-6 h-6 text-purple-600" />
            Hospital Users & Access Control
          </h1>
          <p className="text-slate-600 text-xs mt-1">
            Role-Based Access Control (RBAC) governing collection dispatch authorization, optical override clearances, and audit logging.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 self-start sm:self-auto cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New User</span>
        </button>
      </div>

      {/* Role Descriptions Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-xs shadow-2xs">
          <div className="font-bold text-purple-800 mb-1 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-purple-600" /> ADMIN ROLE
          </div>
          <p className="text-slate-600">
            Full platform configuration, confidence threshold modification, user role provisioning, and clinical audit certification.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs shadow-2xs">
          <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> WASTE MANAGER ROLE
          </div>
          <p className="text-slate-600">
            Autonomous fleet dispatch oversight, manual AI classification override approvals, container decanting, and emergency escalation.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 text-xs shadow-2xs">
          <div className="font-bold text-sky-800 mb-1 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-sky-600" /> STAFF / NURSE ROLE
          </div>
          <p className="text-slate-600">
            Ward-level collection request creation, optical waste photo uploads, and pickup progress status tracking.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="WASTE_MANAGER">WASTE MANAGER</option>
          <option value="STAFF">STAFF</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">USER</th>
                <th className="py-3 px-4 font-semibold">ROLE</th>
                <th className="py-3 px-4 font-semibold">DEPARTMENT</th>
                <th className="py-3 px-4 font-semibold">EMAIL</th>
                <th className="py-3 px-4 font-semibold">LAST ACTIVE</th>
                <th className="py-3 px-4 font-semibold text-right">ACTIVE SESSION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isCurrent = currentUser.id === user.id;
                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : user.role === 'WASTE_MANAGER'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{user.department}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{user.email}</td>
                    <td className="py-3 px-4 text-slate-400">{user.lastActive}</td>
                    <td className="py-3 px-4 text-right">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold font-mono text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CURRENT USER
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentUser(user)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Switch to User
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add User */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Register Hospital User</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Connor"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hospital Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sconnor@hospital.org"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="STAFF">STAFF (Ward Nurse / Orderly)</option>
                  <option value="WASTE_MANAGER">WASTE MANAGER (Biohazard Coordinator)</option>
                  <option value="ADMIN">ADMIN (System Administrator)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="Emergency">Emergency</option>
                  <option value="Operation Theatre">Operation Theatre</option>
                  <option value="ICU">ICU</option>
                  <option value="Pathology Lab">Pathology Lab</option>
                  <option value="Ward A">Ward A</option>
                  <option value="Ward B">Ward B</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
