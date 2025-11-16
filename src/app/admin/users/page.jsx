'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function AdminUsersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'USER'
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchUsers()
    }
  }, [user])

  // get all users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data.users)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingUsers(false)
    }
  }

  // create a new user
  const handleCreateUser = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create user')
      setSuccessMessage('User created successfully')
      setShowCreateModal(false)
      setFormData({ email: '', password: '', name: '', role: 'USER' })
      fetchUsers()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  // update a user
  const handleUpdateUser = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const updatePayload = { email: formData.email, name: formData.name, role: formData.role }
      if (formData.password) updatePayload.password = formData.password
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update user')
      setSuccessMessage('User updated successfully')
      setShowEditModal(false)
      setSelectedUser(null)
      setFormData({ email: '', password: '', name: '', role: 'USER' })
      fetchUsers()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  // remove a user
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete user')
      setSuccessMessage('User deleted successfully')
      fetchUsers()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  // set a user to admin
  const handlePromoteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${userId}/promote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to promote user')
      setSuccessMessage('User promoted to admin')
      fetchUsers()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  // remove admin role to user
  const handleDemoteUser = async (userId) => {
    if (!confirm('Are you sure you want to demote this admin?')) return
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${userId}/demote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to demote user')
      setSuccessMessage('User demoted successfully')
      fetchUsers()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const openEditModal = (userToEdit) => {
    setSelectedUser(userToEdit)
    setFormData({
      email: userToEdit.email,
      password: '',
      name: userToEdit.name || '',
      role: userToEdit.role
    })
    setShowEditModal(true)
  }

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1320]">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-[#0b1320] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <button onClick={() => setShowCreateModal(true)} className="cursor-pointer bg-[#dd003f] hover:bg-[#ff0050] text-white px-6 py-2 rounded-lg transition-colors">
            Create New User
          </button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">{error}</div>}
        {successMessage && <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">{successMessage}</div>}

        <div className="bg-[#020d18] border border-[#233a50] shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-[#233a50]">
            <thead className="bg-[#0b1320]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#020d18] divide-y divide-[#233a50]">
              {users.map((userItem) => (
                <tr key={userItem.id} className="hover:bg-[#0b1320] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{userItem.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{userItem.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${userItem.role === 'ADMIN' ? 'bg-[#dcf836] text-[#020d18]' : 'bg-[#233a50] text-white'}`}>
                      {userItem.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${userItem.emailVerified ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {userItem.emailVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#abb7c4]">
                    {new Date(userItem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(userItem)} className="cursor-pointer text-[#dcf836] hover:text-[#e5ff3d] transition-colors">Edit</button>
                      {userItem.role === 'USER' ? (
                        <button onClick={() => handlePromoteUser(userItem.id)} className="cursor-pointer text-[#dcf836] hover:text-[#e5ff3d] transition-colors">Promote</button>
                      ) : userItem.id !== user.id && (
                        <button onClick={() => handleDemoteUser(userItem.id)} className="cursor-pointer text-orange-500 hover:text-orange-400 transition-colors">Demote</button>
                      )}
                      {userItem.id !== user.id && (
                        <button onClick={() => handleDeleteUser(userItem.id)} className="cursor-pointer text-red-500 hover:text-red-400 transition-colors">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* create new user */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6 text-white">Create New User</h2>
              <form onSubmit={handleCreateUser}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#abb7c4] mb-2">Email</label>
                  <input type="email" required className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white focus:outline-none focus:border-[#dd003f]" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#abb7c4] mb-2">Password</label>
                  <input type="password" required className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white focus:outline-none focus:border-[#dd003f]" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#abb7c4] mb-2">Name</label>
                  <input type="text" className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white focus:outline-none focus:border-[#dd003f]" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#abb7c4] mb-2">Role</label>
                  <select className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white focus:outline-none focus:border-[#dd003f]" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="cursor-pointer flex-1 bg-[#dd003f] hover:bg-[#ff0050] text-white py-2 rounded-lg transition-colors">Create User</button>
                  <button type="button" onClick={() => { setShowCreateModal(false); setFormData({ email: '', password: '', name: '', role: 'USER' }); setError(null) }} className="cursor-pointer flex-1 bg-[#233a50] hover:bg-[#2d4a63] text-white py-2 rounded-lg transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* edit user */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#020d18] border border-[#233a50] rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6 text-white">Edit User</h2>
              <form onSubmit={handleUpdateUser}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#abb7c4] mb-2">Email</label>
                  <input type="email" required className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white focus:outline-none focus:border-[#dd003f]" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#abb7c4] mb-2">Password (leave empty to keep)</label>
                  <input type="password" className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white focus:outline-none focus:border-[#dd003f]" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#abb7c4] mb-2">Name</label>
                  <input type="text" className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white focus:outline-none focus:border-[#dd003f]" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#abb7c4] mb-2">Role</label>
                  <select className="w-full px-3 py-2 bg-[#0b1320] border border-[#233a50] rounded-lg text-white focus:outline-none focus:border-[#dd003f]" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} disabled={selectedUser.id === user.id}>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  {selectedUser.id === user.id && <p className="text-xs text-[#abb7c4] mt-1">You cannot change your own role</p>}
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="cursor-pointer flex-1 bg-[#dd003f] hover:bg-[#ff0050] text-white py-2 rounded-lg transition-colors">Update User</button>
                  <button type="button" onClick={() => { setShowEditModal(false); setSelectedUser(null); setFormData({ email: '', password: '', name: '', role: 'USER' }); setError(null) }} className="cursor-pointer flex-1 bg-[#233a50] hover:bg-[#2d4a63] text-white py-2 rounded-lg transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
