import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import AdminRoute from '@/components/shared/AdminRoute'

// Public Pages
import HomePage from '@/pages/public/HomePage'
import PostDetailPage from '@/pages/public/PostDetailPage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'

// Admin Pages
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminPostListPage from '@/pages/admin/posts/AdminPostListPage'
import AdminPostCreatePage from '@/pages/admin/posts/AdminPostCreatePage'
import AdminPostEditPage from '@/pages/admin/posts/AdminPostEditPage'
import AdminCategoryPage from '@/pages/admin/categories/AdminCategoryPage'
import AdminCommentPage from '@/pages/admin/comments/AdminCommentPage'

import '@/index.css'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 前台公開路由（含 Navbar + Footer）*/}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/posts/:slug"
            element={
              <PublicLayout>
                <PostDetailPage />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <RegisterPage />
              </PublicLayout>
            }
          />

          {/* 管理後台（AdminRoute 保護）*/}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="posts" element={<AdminPostListPage />} />
            <Route path="posts/create" element={<AdminPostCreatePage />} />
            <Route path="posts/:id/edit" element={<AdminPostEditPage />} />
            <Route path="categories" element={<AdminCategoryPage />} />
            <Route path="comments" element={<AdminCommentPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
