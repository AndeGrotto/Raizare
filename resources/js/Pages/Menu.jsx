// resources/js/Components/Sidebar.jsx

import React, { useState } from 'react';
import { Link } from '@inertiajs/inertia-react';

export default function Sidebar() {
  const [openTalhao, setOpenTalhao] = useState(false);

  const toggleTalhao = () => setOpenTalhao(!openTalhao);

  return (
    <div style={{ width: 250, height: '100vh', backgroundColor: '#343a40', color: '#fff', padding: '1rem' }}>
      <nav>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          <li>
            <Link 
              href="/dashboard" 
              style={{ color: '#fff', display: 'block', padding: '10px 0', textDecoration: 'none' }}
              className="hover:text-primary"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/produtos" 
              style={{ color: '#fff', display: 'block', padding: '10px 0', textDecoration: 'none' }}
              className="hover:text-primary"
            >
              Estoque
            </Link>
          </li>
          <li>
            <button 
              onClick={toggleTalhao} 
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#fff',
                textAlign: 'left',
                padding: '10px 0',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Talhão {openTalhao ? '▼' : '▶'}
            </button>
            {openTalhao && (
              <ul style={{ listStyleType: 'none', paddingLeft: '1rem' }}>
                {[...Array(10)].map((_, index) => (
                  <li key={index}>
                    <Link 
                      href={`/talhoes/${index + 1}`} 
                      style={{ color: '#adb5bd', display: 'block', padding: '5px 0', textDecoration: 'none' }} 
                      className="hover:text-primary"
                    >
                      Talhão {index + 1}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
