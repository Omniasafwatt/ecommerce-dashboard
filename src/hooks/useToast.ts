import { useCallback } from 'react'
import { useAppDispatch } from '../store'
import { addToast, removeToast, clearAllToasts } from '../store/slices/uiSlice'
import type { Toast } from '../store/slices/uiSlice'

type ToastInput = Omit<Toast, 'id'>

const DEFAULT_DURATION = 4000 // ms

/**
 * Hook for showing and dismissing toast notifications.
 *
 * Toasts are stored in the Redux `ui` slice so they can be rendered
 * by a global `<ToastContainer />` component anywhere in the tree.
 */
export const useToast = () => {
  const dispatch = useAppDispatch()

  /** Show a generic toast */
  const toast = useCallback(
    (input: ToastInput) => {
      dispatch(addToast({ duration: DEFAULT_DURATION, ...input }))
    },
    [dispatch]
  )

  /** Show a success toast */
  const success = useCallback(
    (title: string, message?: string, duration = DEFAULT_DURATION) => {
      dispatch(addToast({ type: 'success', title, message, duration }))
    },
    [dispatch]
  )

  /** Show an error toast */
  const error = useCallback(
    (title: string, message?: string, duration = DEFAULT_DURATION) => {
      dispatch(addToast({ type: 'error', title, message, duration }))
    },
    [dispatch]
  )

  /** Show a warning toast */
  const warning = useCallback(
    (title: string, message?: string, duration = DEFAULT_DURATION) => {
      dispatch(addToast({ type: 'warning', title, message, duration }))
    },
    [dispatch]
  )

  /** Show an info toast */
  const info = useCallback(
    (title: string, message?: string, duration = DEFAULT_DURATION) => {
      dispatch(addToast({ type: 'info', title, message, duration }))
    },
    [dispatch]
  )

  /** Dismiss a specific toast by its id */
  const dismiss = useCallback(
    (id: string) => {
      dispatch(removeToast(id))
    },
    [dispatch]
  )

  /** Dismiss all toasts */
  const dismissAll = useCallback(() => {
    dispatch(clearAllToasts())
  }, [dispatch])

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  }
}

export default useToast
