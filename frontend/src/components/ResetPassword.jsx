import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    // Optional: verify token on mount
    const verifyToken = async () => {
      try {
        await axios.get(`${backendURL}/api/auth/reset-password/${token}`);
        setTokenValid(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Token is invalid or expired.');
        setTokenValid(false);
      }
    };
    verifyToken();
  }, [token, backendURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      const response = await axios.post(`${backendURL}/api/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
      
      // Optional: redirect to login after a delay
      // setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="glass-card border-0">
        <Card.Body>
          <h2 className="text-center mb-4">Update Password</h2>
          {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
          {message && <Alert variant="success" className="rounded-3">{message}</Alert>}
          
          {tokenValid ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group id="password" className="mb-3">
                <Form.Label className="fw-semibold">New Password</Form.Label>
                <Form.Control
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group id="confirm-password" className="mb-4">
                <Form.Label className="fw-semibold">Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              <Button disabled={loading} className="w-100 btn-premium" type="submit">
                Submit New Password
              </Button>
            </Form>
          ) : null}
        </Card.Body>
      </Card>
    </>
  );
}
