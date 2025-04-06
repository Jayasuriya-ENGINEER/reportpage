
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    const success = login(username, password);
    if (success) {
      toast.success('Login successful');
      // Redirect based on admin status
      if (username === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const success = register(username, password);
    if (success) {
      toast.success('Registration successful');
      navigate('/user');
    } else {
      toast.error('Username already exists');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-brand-blue/10 to-brand-purple/10">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple text-transparent bg-clip-text">
            Issue Reporter
          </CardTitle>
          <CardDescription>
            Report and manage your issues efficiently
          </CardDescription>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90">
                  Login
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="reg-username" className="text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="reg-username"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="reg-password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90">
                  Register
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
