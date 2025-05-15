
// This service handles authentication-related API calls
// In a real application, this would connect to MongoDB

// User type definition
interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

class AuthService {
  private currentUser: User | null = null;
  private isAuthenticated: boolean = false;

  constructor() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }

  // Register a new user
  async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      // In a real app, this would make an API call to register the user in MongoDB
      // Mocked successful registration
      console.log("Registering user:", { name, email });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, check if email already exists in localStorage
      if (localStorage.getItem(`user_${email}`)) {
        return false; // Email already exists
      }

      // Create a new user object
      const newUser: User = {
        _id: `user_${Date.now()}`,
        name,
        email,
        createdAt: new Date().toISOString()
      };

      // Store user in localStorage (simulating MongoDB)
      localStorage.setItem(`user_${email}`, JSON.stringify({
        ...newUser,
        password // In a real app, this would be hashed
      }));

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  }

  // Login user
  async login(email: string, password: string): Promise<boolean> {
    try {
      // In a real app, this would make an API call to authenticate with MongoDB
      console.log("Logging in user:", email);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, check credentials in localStorage
      const storedUser = localStorage.getItem(`user_${email}`);
      if (!storedUser) {
        return false; // User not found
      }

      const userData = JSON.parse(storedUser);
      if (userData.password !== password) {
        return false; // Wrong password
      }

      // Successfully authenticated
      const user: User = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt
      };

      // Store current user session
      this.currentUser = user;
      this.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(user));

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    // Clear user session
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem("user");
    console.log("User logged out");
  }

  // Check if user is authenticated
  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
