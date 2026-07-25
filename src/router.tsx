import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import FocusPage from './pages/FocusPage'
import LogPage from './pages/LogPage'
import ReviewPage from './pages/ReviewPage'
import LearningPage from './pages/LearningPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <FocusPage /> },
      { path: 'log', element: <LogPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'learning', element: <LearningPage /> },
    ],
  },
])
