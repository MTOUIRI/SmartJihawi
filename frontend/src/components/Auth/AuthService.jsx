const API_BASE_URL = 'http://localhost:8080/api';

class AuthService {
  constructor() {
    // Separate storage keys for admin and student
    this.ADMIN_TOKEN_KEY = 'admin_token';
    this.ADMIN_USER_KEY = 'admin_user';
    this.STUDENT_TOKEN_KEY = 'student_token';
    this.STUDENT_USER_KEY = 'student_user';
  }

  // Get admin authentication
  getAdminAuth() {
    const token = localStorage.getItem(this.ADMIN_TOKEN_KEY);
    const user = localStorage.getItem(this.ADMIN_USER_KEY);
    return {
      token,
      user: user ? JSON.parse(user) : null
    };
  }

  // Get student authentication
  getStudentAuth() {
    const token = localStorage.getItem(this.STUDENT_TOKEN_KEY);
    const user = localStorage.getItem(this.STUDENT_USER_KEY);
    return {
      token,
      user: user ? JSON.parse(user) : null
    };
  }

  // Universal login method - stores in appropriate context based on role
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store in appropriate context based on role
      if (data.user.role === 'admin') {
        localStorage.setItem(this.ADMIN_TOKEN_KEY, data.token);
        localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(data.user));
      } else if (data.user.role === 'student') {
        localStorage.setItem(this.STUDENT_TOKEN_KEY, data.token);
        localStorage.setItem(this.STUDENT_USER_KEY, JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Admin-specific login method
  async adminLogin(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Admin login failed');
      }

      const data = await response.json();
      
      // Store in admin context
      localStorage.setItem(this.ADMIN_TOKEN_KEY, data.token);
      localStorage.setItem(this.ADMIN_USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Logout admin
  async logoutAdmin() {
    try {
      const adminAuth = this.getAdminAuth();
      if (adminAuth.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminAuth.token}`,
            'Content-Type': 'application/json',
          }
        });
      }
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      localStorage.removeItem(this.ADMIN_TOKEN_KEY);
      localStorage.removeItem(this.ADMIN_USER_KEY);
    }
  }

  // Logout student
  async logoutStudent() {
    try {
      const studentAuth = this.getStudentAuth();
      if (studentAuth.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${studentAuth.token}`,
            'Content-Type': 'application/json',
          }
        });
      }
    } catch (error) {
      console.error('Student logout error:', error);
    } finally {
      localStorage.removeItem(this.STUDENT_TOKEN_KEY);
      localStorage.removeItem(this.STUDENT_USER_KEY);
    }
  }

  // Check if admin is authenticated
  isAdminAuthenticated() {
    const adminAuth = this.getAdminAuth();
    return !!(adminAuth.token && adminAuth.user);
  }

  // Check if student is authenticated
  isStudentAuthenticated() {
    const studentAuth = this.getStudentAuth();
    return !!(studentAuth.token && studentAuth.user);
  }

  // Make authenticated API request (admin)
  async authenticatedAdminRequest(url, options = {}) {
    const adminAuth = this.getAdminAuth();
    if (!adminAuth.token) {
      throw new Error('No admin authentication token available');
    }

    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${adminAuth.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      if (response.status === 401) {
        this.logoutAdmin();
        throw new Error('Admin session expired. Please login again.');
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Make authenticated API request (student)
  async authenticatedStudentRequest(url, options = {}) {
    const studentAuth = this.getStudentAuth();
    if (!studentAuth.token) {
      throw new Error('No student authentication token available');
    }

    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${studentAuth.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      if (response.status === 401) {
        this.logoutStudent();
        throw new Error('Student session expired. Please login again.');
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;