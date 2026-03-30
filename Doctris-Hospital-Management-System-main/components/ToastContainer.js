"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeNotification } from "@/features/ui/uiSlice";
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ToastContainer() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.ui.notifications);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} onRemove={() => dispatch(removeNotification(n.id))} />
      ))}
    </div>
  );
}

function ToastItem({ notification, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 5000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-emerald-500" />,
    error: <ExclamationCircleIcon className="w-6 h-6 text-rose-500" />,
    warning: <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
  };

  const colors = {
    success: "border-emerald-100 bg-emerald-50",
    error: "border-rose-100 bg-rose-50",
    warning: "border-amber-100 bg-amber-50",
    info: "border-blue-100 bg-blue-50",
  };

  return (
    <div className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg fade-in ${colors[notification.type] || colors.info}`}>
      <div className="shrink-0">{icons[notification.type] || icons.info}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 capitalize mb-0.5">{notification.type}</p>
        <p className="text-sm text-slate-600 line-clamp-2 leading-tight">{notification.message}</p>
      </div>
      <button onClick={onRemove} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
