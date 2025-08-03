import React, { useEffect, Suspense } from "react"; // 1. Import Suspense
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import LoadingSpinner from "./components/LoadingSpinner";
import { checkAuth } from "./store/authSlice";
import Layout from "./components/Layout";

// 2. Lazy-load all the page components
const SignUpPage = React.lazy(() => import("./pages/SignUpPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const QuestionsListPage = React.lazy(() => import("./pages/QuestionsListPage"));
const QuestionDetailPage = React.lazy(() =>
  import("./pages/QuestionDetailPage")
);
const CreateQuestionPage = React.lazy(() =>
  import("./pages/CreateQuestionPage")
);
const UpdateQuestionPage = React.lazy(() =>
  import("./pages/UpdateQuestionPage")
);
const SubmissionsPage = React.lazy(() => import("./pages/SubmissionsPage"));
const SubmissionDetailPage = React.lazy(() =>
  import("./pages/SubmissionDetailPage")
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    user,
    status: authStatus,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authStatus === "idle") dispatch(checkAuth());
  }, [dispatch, authStatus]);

  if (authStatus === "loading" || authStatus === "idle") {
    return <LoadingSpinner />;
  }

  return (
    // 3. Wrap the Routes component in a Suspense boundary
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Dashboard - protected and with layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Auth pages - without layout */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Questions List */}
        <Route
          path="/questions"
          element={
            <Layout>
              <QuestionsListPage />
            </Layout>
          }
        />

        {/* Question Detail */}
        <Route
          path="/questions/:id"
          element={
            <Layout>
              <QuestionDetailPage />
            </Layout>
          }
        />

        {/* Submissions Page */}
        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <Layout>
                <SubmissionsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Submission Detail Page */}
        <Route
          path="/submissions/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <SubmissionDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin-only: Create Question */}
        <Route
          path="/questions/create"
          element={
            <ProtectedRoute>
              <Layout>
                {user?.isAdmin ? (
                  <CreateQuestionPage />
                ) : (
                  <Navigate to="/questions" replace />
                )}
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin-only: Update Question */}
        <Route
          path="/questions/update/:id"
          element={
            <ProtectedRoute>
              <Layout>
                {user?.isAdmin ? (
                  <UpdateQuestionPage />
                ) : (
                  <Navigate to="/questions" replace />
                )}
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;