// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/home');
      }
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return null; // ou um loading spinner

  return children;
}

export default ProtectedRoute;
